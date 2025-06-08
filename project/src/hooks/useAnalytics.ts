import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { SkillAnalytics, UserStats } from '../types';

export const useAnalytics = (userId: string | null) => {
  const [skillAnalytics, setSkillAnalytics] = useState<SkillAnalytics[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch skill analytics
      const { data: skills, error: skillsError } = await supabase
        .from('skill_analytics')
        .select('*')
        .order('total_requests', { ascending: false })
        .limit(20);

      if (skillsError) throw skillsError;

      setSkillAnalytics(skills || []);

      // Fetch user stats if logged in
      if (userId) {
        const { data: stats, error: statsError } = await supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (statsError && statsError.code !== 'PGRST116') {
          throw statsError;
        }

        setUserStats(stats);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const getTopSkills = useCallback((type: 'teach' | 'learn' | 'popular', limit = 5) => {
    if (type === 'teach') {
      return skillAnalytics
        .sort((a, b) => b.teach_count - a.teach_count)
        .slice(0, limit);
    } else if (type === 'learn') {
      return skillAnalytics
        .sort((a, b) => b.learn_count - a.learn_count)
        .slice(0, limit);
    } else {
      return skillAnalytics
        .sort((a, b) => (b.teach_count + b.learn_count) - (a.teach_count + a.learn_count))
        .slice(0, limit);
    }
  }, [skillAnalytics]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    skillAnalytics,
    userStats,
    loading,
    getTopSkills,
    refetch: fetchAnalytics
  };
};