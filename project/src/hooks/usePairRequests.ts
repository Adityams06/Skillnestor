import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { PairRequest, User } from '../types';

export const usePairRequests = (userId: string | null) => {
  const [sentRequests, setSentRequests] = useState<PairRequest[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<PairRequest[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRequests = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      // Fetch sent requests
      const { data: sent, error: sentError } = await supabase
        .from('pair_requests')
        .select(`
          *,
          requested:requested_id (
            id,
            email,
            raw_user_meta_data
          )
        `)
        .eq('requester_id', userId)
        .order('created_at', { ascending: false });

      if (sentError) throw sentError;

      // Fetch received requests
      const { data: received, error: receivedError } = await supabase
        .from('pair_requests')
        .select(`
          *,
          requester:requester_id (
            id,
            email,
            raw_user_meta_data
          )
        `)
        .eq('requested_id', userId)
        .order('created_at', { ascending: false });

      if (receivedError) throw receivedError;

      // Transform the data
      const transformedSent = sent?.map(req => ({
        ...req,
        requested: req.requested ? {
          id: req.requested.id,
          email: req.requested.email,
          name: req.requested.raw_user_meta_data?.name || req.requested.email.split('@')[0],
          avatar_url: req.requested.raw_user_meta_data?.avatar_url,
          created_at: req.created_at,
          updated_at: req.updated_at
        } : undefined
      })) || [];

      const transformedReceived = received?.map(req => ({
        ...req,
        requester: req.requester ? {
          id: req.requester.id,
          email: req.requester.email,
          name: req.requester.raw_user_meta_data?.name || req.requester.email.split('@')[0],
          avatar_url: req.requester.raw_user_meta_data?.avatar_url,
          created_at: req.created_at,
          updated_at: req.updated_at
        } : undefined
      })) || [];

      setSentRequests(transformedSent);
      setReceivedRequests(transformedReceived);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const sendRequest = useCallback(async (requestedId: string, skill: string, message?: string) => {
    if (!userId) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('pair_requests')
      .insert({
        requester_id: userId,
        requested_id: requestedId,
        skill,
        message: message || '',
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;

    await fetchRequests();
    return data;
  }, [userId, fetchRequests]);

  const updateRequestStatus = useCallback(async (requestId: string, status: 'accepted' | 'declined' | 'cancelled') => {
    const { error } = await supabase
      .from('pair_requests')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId);

    if (error) throw error;

    await fetchRequests();
  }, [fetchRequests]);

  const hasExistingRequest = useCallback((requestedId: string, skill: string) => {
    return sentRequests.some(req => 
      req.requested_id === requestedId && 
      req.skill === skill && 
      req.status === 'pending'
    );
  }, [sentRequests]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return {
    sentRequests,
    receivedRequests,
    loading,
    sendRequest,
    updateRequestStatus,
    hasExistingRequest,
    refetch: fetchRequests
  };
};