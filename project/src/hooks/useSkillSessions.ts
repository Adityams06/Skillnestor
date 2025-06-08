import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { SkillSession, User } from '../types';

export const useSkillSessions = (userId: string | null) => {
  const [sessions, setSessions] = useState<SkillSession[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSessions = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('skill_sessions')
        .select(`
          *,
          teacher:teacher_id (
            id,
            email,
            raw_user_meta_data
          ),
          learner:learner_id (
            id,
            email,
            raw_user_meta_data
          )
        `)
        .or(`teacher_id.eq.${userId},learner_id.eq.${userId}`)
        .order('scheduled_date', { ascending: true });

      if (error) throw error;

      const transformedSessions = data?.map(session => ({
        ...session,
        teacher: session.teacher ? {
          id: session.teacher.id,
          email: session.teacher.email,
          name: session.teacher.raw_user_meta_data?.name || session.teacher.email.split('@')[0],
          avatar_url: session.teacher.raw_user_meta_data?.avatar_url,
          created_at: session.created_at,
          updated_at: session.updated_at
        } : undefined,
        learner: session.learner ? {
          id: session.learner.id,
          email: session.learner.email,
          name: session.learner.raw_user_meta_data?.name || session.learner.email.split('@')[0],
          avatar_url: session.learner.raw_user_meta_data?.avatar_url,
          created_at: session.created_at,
          updated_at: session.updated_at
        } : undefined
      })) || [];

      setSessions(transformedSessions);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const createSession = useCallback(async (sessionData: {
    pair_request_id: string;
    teacher_id: string;
    learner_id: string;
    skill: string;
    scheduled_date?: string;
    duration_minutes?: number;
    meeting_link?: string;
    notes?: string;
  }) => {
    const { data, error } = await supabase
      .from('skill_sessions')
      .insert({
        ...sessionData,
        status: 'scheduled'
      })
      .select()
      .single();

    if (error) throw error;

    await fetchSessions();
    return data;
  }, [fetchSessions]);

  const updateSession = useCallback(async (sessionId: string, updates: Partial<SkillSession>) => {
    const { error } = await supabase
      .from('skill_sessions')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId);

    if (error) throw error;

    await fetchSessions();
  }, [fetchSessions]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return {
    sessions,
    loading,
    createSession,
    updateSession,
    refetch: fetchSessions
  };
};