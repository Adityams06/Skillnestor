import React from 'react';
import { TrendingUp, Users, BookOpen, Lightbulb, Award, Target, Calendar, Star } from 'lucide-react';
import { useAnalytics } from '../hooks/useAnalytics';
import { User as AppUser } from '../types';

interface AnalyticsPageProps {
  currentUser: AppUser;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ currentUser }) => {
  const { skillAnalytics, userStats, getTopSkills, loading } = useAnalytics(currentUser.id);

  const topTeachSkills = getTopSkills('teach', 5);
  const topLearnSkills = getTopSkills('learn', 5);
  const popularSkills = getTopSkills('popular', 10);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading analytics...</p>
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
            Skill Analytics & Trends
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Discover popular skills and track your learning journey
          </p>
        </div>

        {/* Personal Stats */}
        {userStats && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Award className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              Your Skillnestor Journey
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{userStats.sent_requests}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Requests Sent</p>
              </div>

              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{userStats.accepted_requests}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Requests Accepted</p>
              </div>

              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{userStats.completed_sessions}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Sessions Completed</p>
              </div>

              <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {userStats.teach_skills.length + userStats.learn_skills.length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Skills</p>
              </div>
            </div>

            {/* Success Rate */}
            {userStats.sent_requests > 0 && (
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Success Rate</span>
                  <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                    {Math.round((userStats.accepted_requests / userStats.sent_requests) * 100)}%
                  </span>
                </div>
                <div className="mt-2 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(userStats.accepted_requests / userStats.sent_requests) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Skills to Teach */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-green-600 dark:text-green-400" />
              Most Taught Skills
            </h3>
            
            <div className="space-y-4">
              {topTeachSkills.map((skill, index) => (
                <div key={skill.skill_name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-green-600 dark:text-green-400">
                        {index + 1}
                      </span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {skill.skill_name}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {skill.teach_count} teachers
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {skill.total_requests} requests
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Skills to Learn */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Most Wanted Skills
            </h3>
            
            <div className="space-y-4">
              {topLearnSkills.map((skill, index) => (
                <div key={skill.skill_name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                        {index + 1}
                      </span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {skill.skill_name}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {skill.learn_count} learners
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {skill.total_requests} requests
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Popular Skills Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            Skill Trends & Popularity
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularSkills.map((skill) => {
              const totalActivity = skill.teach_count + skill.learn_count;
              const successRate = skill.total_requests > 0 
                ? Math.round((skill.successful_matches / skill.total_requests) * 100)
                : 0;

              return (
                <div
                  key={skill.skill_name}
                  className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-lg border border-gray-200 dark:border-gray-600"
                >
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                    {skill.skill_name}
                  </h4>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Teachers:</span>
                      <span className="font-medium text-green-600 dark:text-green-400">
                        {skill.teach_count}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Learners:</span>
                      <span className="font-medium text-blue-600 dark:text-blue-400">
                        {skill.learn_count}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Requests:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {skill.total_requests}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Success Rate:</span>
                      <span className={`font-medium ${
                        successRate >= 70 ? 'text-green-600 dark:text-green-400' :
                        successRate >= 40 ? 'text-yellow-600 dark:text-yellow-400' :
                        'text-red-600 dark:text-red-400'
                      }`}>
                        {successRate}%
                      </span>
                    </div>
                  </div>

                  {/* Activity Bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                      <span>Activity Level</span>
                      <span>{totalActivity}</span>
                    </div>
                    <div className="bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min((totalActivity / Math.max(...popularSkills.map(s => s.teach_count + s.learn_count))) * 100, 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Insights */}
        <div className="mt-8 bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl p-6 text-white">
          <h3 className="text-xl font-semibold mb-4">💡 Skill Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium mb-2">🔥 Trending Skills:</p>
              <p className="text-primary-100">
                {popularSkills.slice(0, 3).map(s => s.skill_name).join(', ')} are seeing the most activity
              </p>
            </div>
            <div>
              <p className="font-medium mb-2">🎯 High Success Rate:</p>
              <p className="text-primary-100">
                Skills with 70%+ match success rate tend to be more specific and practical
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};