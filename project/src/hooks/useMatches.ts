import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { SkillMatch, User, UserProfile } from '../types';

export const useMatches = (currentUserId: string | null, userProfile: UserProfile | null) => {
  const [matches, setMatches] = useState<SkillMatch[]>([]);
  const [loading, setLoading] = useState(false);

  const findMatches = useCallback(async () => {
    if (!currentUserId || !userProfile) return;

    setLoading(true);
    try {
      // Get all public profiles except current user
      const { data: profiles, error } = await supabase
        .from('user_profiles')
        .select(`
          *,
          user:user_id (
            id,
            email,
            raw_user_meta_data
          )
        `)
        .eq('is_public', true)
        .neq('user_id', currentUserId);

      if (error) throw error;

      const skillMatches: SkillMatch[] = [];

      profiles?.forEach((profile) => {
        if (!profile.user) return;

        const user: User = {
          id: profile.user.id,
          email: profile.user.email,
          name: profile.user.raw_user_meta_data?.name || profile.user.email.split('@')[0],
          avatar_url: profile.user.raw_user_meta_data?.avatar_url,
          created_at: profile.created_at,
          updated_at: profile.updated_at
        };

        // Find matching skills
        const canTeach = userProfile.teach_skills.filter(skill => 
          profile.learn_skills.includes(skill)
        );
        const wantsToLearn = userProfile.learn_skills.filter(skill => 
          profile.teach_skills.includes(skill)
        );

        // Only include if there are matches
        if (canTeach.length > 0 || wantsToLearn.length > 0) {
          const matchScore = (canTeach.length + wantsToLearn.length) * 10 + 
                           (canTeach.length * wantsToLearn.length * 5); // Bonus for bidirectional matches

          skillMatches.push({
            user,
            profile,
            matchingSkills: {
              canTeach,
              wantsToLearn
            },
            matchScore
          });
        }
      });

      // Sort by match score (highest first)
      skillMatches.sort((a, b) => b.matchScore - a.matchScore);
      setMatches(skillMatches);
    } catch (error) {
      console.error('Error finding matches:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUserId, userProfile]);

  useEffect(() => {
    findMatches();
  }, [findMatches]);

  return {
    matches,
    loading,
    refetch: findMatches
  };
};