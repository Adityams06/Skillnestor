import React, { useState } from 'react';
import { Users, Lightbulb, BookOpen, Send, Star, Filter } from 'lucide-react';
import { useMatches } from '../hooks/useMatches';
import { usePairRequests } from '../hooks/usePairRequests';
import { User as AppUser, UserProfile } from '../types';

interface MatchesPageProps {
  currentUser: AppUser;
  userProfile: UserProfile | null;
}

export const MatchesPage: React.FC<MatchesPageProps> = ({ currentUser, userProfile }) => {
  const { matches, loading } = useMatches(currentUser.id, userProfile);
  const { sendRequest, hasExistingRequest, loading: requestLoading } = usePairRequests(currentUser.id);
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [requestMessage, setRequestMessage] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [sortBy, setSortBy] = useState<'score' | 'bidirectional'>('score');

  const sortedMatches = [...matches].sort((a, b) => {
    if (sortBy === 'bidirectional') {
      const aBidirectional = a.matchingSkills.canTeach.length > 0 && a.matchingSkills.wantsToLearn.length > 0;
      const bBidirectional = b.matchingSkills.canTeach.length > 0 && b.matchingSkills.wantsToLearn.length > 0;
      if (aBidirectional && !bBidirectional) return -1;
      if (!aBidirectional && bBidirectional) return 1;
    }
    return b.matchScore - a.matchScore;
  });

  const handleSendRequest = async () => {
    if (!selectedMatch || !selectedSkill) return;

    try {
      await sendRequest(selectedMatch, selectedSkill, requestMessage);
      setSelectedMatch(null);
      setRequestMessage('');
      setSelectedSkill('');
    } catch (error) {
      console.error('Error sending request:', error);
    }
  };

  const getAvailableSkills = (match: any) => {
    return [...new Set([...match.matchingSkills.canTeach, ...match.matchingSkills.wantsToLearn])];
  };

  const getMatchTypeLabel = (match: any) => {
    const canTeach = match.matchingSkills.canTeach.length > 0;
    const wantsToLearn = match.matchingSkills.wantsToLearn.length > 0;
    
    if (canTeach && wantsToLearn) return { label: 'Perfect Match', color: 'text-green-600 dark:text-green-400' };
    if (canTeach) return { label: 'You Can Teach', color: 'text-blue-600 dark:text-blue-400' };
    if (wantsToLearn) return { label: 'You Can Learn', color: 'text-purple-600 dark:text-purple-400' };
    return { label: 'Match', color: 'text-gray-600 dark:text-gray-400' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Finding your perfect skill matches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Your Skill Matches
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Smart matches based on complementary skills - people who can teach what you want to learn
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Filter className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'score' | 'bidirectional')}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="score">Match Score</option>
                <option value="bidirectional">Perfect Matches First</option>
              </select>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {matches.length} {matches.length === 1 ? 'match' : 'matches'} found
            </div>
          </div>
        </div>

        {matches.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No matches found yet</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              We couldn't find any skill matches right now. Try updating your profile with more skills, 
              or check back later as more people join Skillnestor!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sortedMatches.map((match) => {
              const matchType = getMatchTypeLabel(match);
              const isBidirectional = match.matchingSkills.canTeach.length > 0 && match.matchingSkills.wantsToLearn.length > 0;
              
              return (
                <div
                  key={match.user.id}
                  className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 transition-all duration-300 hover:shadow-md ${
                    isBidirectional 
                      ? 'border-green-200 dark:border-green-700 bg-gradient-to-br from-green-50 to-white dark:from-green-900/10 dark:to-gray-800'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {match.user.name}
                          </h3>
                          <p className={`text-sm font-medium ${matchType.color}`}>
                            {matchType.label}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {isBidirectional && (
                          <Star className="w-5 h-5 text-yellow-500 fill-current" />
                        )}
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            Score: {match.matchScore}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {match.matchingSkills.canTeach.length + match.matchingSkills.wantsToLearn.length} skills
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Bio */}
                    {match.profile.bio && (
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                        {match.profile.bio}
                      </p>
                    )}

                    {/* Matching Skills */}
                    <div className="space-y-3 mb-4">
                      {match.matchingSkills.canTeach.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Lightbulb className="w-4 h-4 text-green-600 dark:text-green-400" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              You can teach them:
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {match.matchingSkills.canTeach.map(skill => (
                              <span
                                key={skill}
                                className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs rounded-full font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {match.matchingSkills.wantsToLearn.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              They can teach you:
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {match.matchingSkills.wantsToLearn.map(skill => (
                              <span
                                key={skill}
                                className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => setSelectedMatch(match.user.id)}
                      disabled={hasExistingRequest(match.user.id, getAvailableSkills(match)[0])}
                      className={`w-full py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${
                        hasExistingRequest(match.user.id, getAvailableSkills(match)[0])
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                          : isBidirectional
                          ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700'
                          : 'bg-primary-600 text-white hover:bg-primary-700'
                      }`}
                    >
                      {hasExistingRequest(match.user.id, getAvailableSkills(match)[0])
                        ? 'Request Already Sent'
                        : 'Send Pairing Request'
                      }
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Request Modal */}
        {selectedMatch && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Send Pairing Request
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
                  {getAvailableSkills(matches.find(m => m.user.id === selectedMatch)).map(skill => (
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
                  onClick={() => setSelectedMatch(null)}
                  className="flex-1 py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendRequest}
                  disabled={!selectedSkill || requestLoading}
                  className="flex-1 py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-primary-400 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
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