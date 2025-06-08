import React, { useState, useEffect } from 'react';
import { Search, Filter, Users, BookOpen, Lightbulb, MapPin, Clock, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { User, UserProfile, SKILL_CATEGORIES } from '../types';
import { usePairRequests } from '../hooks/usePairRequests';

interface DiscoverPageProps {
  currentUser: User | null;
  onNavigate: (view: string) => void;
}

interface PublicProfile {
  user: User;
  profile: UserProfile;
}

export const DiscoverPage: React.FC<DiscoverPageProps> = ({ currentUser, onNavigate }) => {
  const [profiles, setProfiles] = useState<PublicProfile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<PublicProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [skillFilter, setSkillFilter] = useState<'teach' | 'learn' | 'all'>('all');
  const [selectedProfile, setSelectedProfile] = useState<PublicProfile | null>(null);
  const [requestMessage, setRequestMessage] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');

  const { sendRequest, hasExistingRequest, loading: requestLoading } = usePairRequests(currentUser?.id || null);

  useEffect(() => {
    fetchPublicProfiles();
  }, []);

  useEffect(() => {
    filterProfiles();
  }, [profiles, searchTerm, selectedCategory, skillFilter]);

  const fetchPublicProfiles = async () => {
    try {
      const { data, error } = await supabase
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
        .neq('user_id', currentUser?.id || '');

      if (error) throw error;

      const publicProfiles: PublicProfile[] = data?.map(profile => ({
        user: {
          id: profile.user.id,
          email: profile.user.email,
          name: profile.user.raw_user_meta_data?.name || profile.user.email.split('@')[0],
          avatar_url: profile.user.raw_user_meta_data?.avatar_url,
          created_at: profile.created_at,
          updated_at: profile.updated_at
        },
        profile
      })) || [];

      setProfiles(publicProfiles);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProfiles = () => {
    let filtered = [...profiles];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(({ user, profile }) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          user.name.toLowerCase().includes(searchLower) ||
          profile.bio?.toLowerCase().includes(searchLower) ||
          profile.teach_skills.some(skill => skill.toLowerCase().includes(searchLower)) ||
          profile.learn_skills.some(skill => skill.toLowerCase().includes(searchLower))
        );
      });
    }

    // Category filter
    if (selectedCategory !== 'all') {
      const categorySkills = SKILL_CATEGORIES[selectedCategory as keyof typeof SKILL_CATEGORIES] || [];
      filtered = filtered.filter(({ profile }) => {
        const allSkills = [...profile.teach_skills, ...profile.learn_skills];
        return allSkills.some(skill => categorySkills.includes(skill));
      });
    }

    // Skill type filter
    if (skillFilter === 'teach') {
      filtered = filtered.filter(({ profile }) => profile.teach_skills.length > 0);
    } else if (skillFilter === 'learn') {
      filtered = filtered.filter(({ profile }) => profile.learn_skills.length > 0);
    }

    setFilteredProfiles(filtered);
  };

  const handleSendRequest = async () => {
    if (!currentUser || !selectedProfile || !selectedSkill) return;

    try {
      await sendRequest(selectedProfile.user.id, selectedSkill, requestMessage);
      setSelectedProfile(null);
      setRequestMessage('');
      setSelectedSkill('');
    } catch (error) {
      console.error('Error sending request:', error);
    }
  };

  const getAvailableSkills = (profile: UserProfile) => {
    if (!currentUser) return [];
    
    // Skills they can teach that we want to learn, or skills we can teach that they want to learn
    const teachToUs = profile.teach_skills;
    const learnFromUs = profile.learn_skills;
    
    return [...new Set([...teachToUs, ...learnFromUs])];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading skill profiles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Discover Skill Partners
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Find amazing people to exchange skills with. Browse profiles, see what others can teach and want to learn.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, skills, or bio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Categories</option>
                {Object.keys(SKILL_CATEGORIES).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Skill Type Filter */}
            <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
              <button
                onClick={() => setSkillFilter('all')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  skillFilter === 'all'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSkillFilter('teach')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  skillFilter === 'teach'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                Can Teach
              </button>
              <button
                onClick={() => setSkillFilter('learn')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  skillFilter === 'learn'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                Want to Learn
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Found {filteredProfiles.length} skill {filteredProfiles.length === 1 ? 'partner' : 'partners'}
          </p>
        </div>

        {/* Profiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfiles.map(({ user, profile }) => (
            <div
              key={user.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-300"
            >
              {/* User Info */}
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{user.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {profile.location || 'Location not specified'}
                  </p>
                </div>
              </div>

              {/* Bio */}
              {profile.bio && (
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  {profile.bio}
                </p>
              )}

              {/* Skills */}
              <div className="space-y-3 mb-4">
                {profile.teach_skills.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Can Teach</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {profile.teach_skills.slice(0, 3).map(skill => (
                        <span
                          key={skill}
                          className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                      {profile.teach_skills.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                          +{profile.teach_skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {profile.learn_skills.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Wants to Learn</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {profile.learn_skills.slice(0, 3).map(skill => (
                        <span
                          key={skill}
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                      {profile.learn_skills.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                          +{profile.learn_skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              {currentUser ? (
                <button
                  onClick={() => setSelectedProfile({ user, profile })}
                  className="w-full py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 text-sm font-medium"
                >
                  Request to Pair
                </button>
              ) : (
                <button
                  onClick={() => onNavigate('login')}
                  className="w-full py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 text-sm font-medium"
                >
                  Sign In to Connect
                </button>
              )}
            </div>
          ))}
        </div>

        {filteredProfiles.length === 0 && !loading && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No profiles found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search criteria or check back later for new skill partners.
            </p>
          </div>
        )}

        {/* Request Modal */}
        {selectedProfile && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Send Pairing Request to {selectedProfile.user.name}
              </h3>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Skill
                </label>
                <select
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Choose a skill...</option>
                  {getAvailableSkills(selectedProfile.profile).map(skill => (
                    <option key={skill} value={skill}>{skill}</option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message (Optional)
                </label>
                <textarea
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  rows={3}
                  placeholder="Introduce yourself and explain why you'd like to connect..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedProfile(null)}
                  className="flex-1 py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendRequest}
                  disabled={!selectedSkill || requestLoading}
                  className="flex-1 py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-primary-400 transition-colors duration-200"
                >
                  {requestLoading ? 'Sending...' : 'Send Request'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};