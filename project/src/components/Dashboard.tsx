import React from 'react';
import { Users, Calendar, TrendingUp, Settings, Plus, BookOpen, Lightbulb } from 'lucide-react';
import { User, UserProfile } from '../types';

interface DashboardProps {
  currentUser: User;
  userProfile: UserProfile | null;
  onNavigate: (view: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  currentUser, 
  userProfile,
  onNavigate 
}) => {
  const hasProfile = userProfile && (userProfile.teach_skills.length > 0 || userProfile.learn_skills.length > 0);

  if (!hasProfile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Welcome to Skillnestor, {currentUser.name}!
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Let's set up your profile so you can start exchanging skills with others. 
              Tell us what you can teach and what you want to learn.
            </p>
            <button
              onClick={() => onNavigate('profile-setup')}
              className="px-8 py-4 bg-primary-600 text-white text-lg font-semibold rounded-xl hover:bg-primary-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
            >
              <Settings className="w-5 h-5" />
              Set Up My Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {currentUser.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Ready to continue your skill exchange journey? Here's what's happening today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Upcoming Sessions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">2</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">8</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-accent-100 dark:bg-accent-900/30 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-accent-600 dark:text-accent-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Connections</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Skills Learned</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">5</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Skills */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">My Skills</h2>
              <button
                onClick={() => onNavigate('profile-setup')}
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-sm transition-colors duration-200"
              >
                Edit
              </button>
            </div>

            <div className="space-y-6">
              {/* Skills I Can Teach */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <h3 className="font-medium text-gray-900 dark:text-white">I Can Teach</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {userProfile?.teach_skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                  {userProfile?.teach_skills.length === 0 && (
                    <p className="text-gray-500 dark:text-gray-400 text-sm">No skills added yet</p>
                  )}
                </div>
              </div>

              {/* Skills I Want to Learn */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="font-medium text-gray-900 dark:text-white">I Want to Learn</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {userProfile?.learn_skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                  {userProfile?.learn_skills.length === 0 && (
                    <p className="text-gray-500 dark:text-gray-400 text-sm">No skills added yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
            
            <div className="space-y-4">
              <button
                onClick={() => onNavigate('discover')}
                className="w-full p-4 text-left bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-lg transition-colors duration-200 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/50 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                    <Users className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Find Skill Partners</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Discover people to exchange skills with</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => onNavigate('requests')}
                className="w-full p-4 text-left bg-accent-50 dark:bg-accent-900/20 hover:bg-accent-100 dark:hover:bg-accent-900/30 rounded-lg transition-colors duration-200 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent-100 dark:bg-accent-900/50 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                    <Calendar className="w-5 h-5 text-accent-600 dark:text-accent-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Manage Requests</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">View and respond to pairing requests</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => onNavigate('calendar')}
                className="w-full p-4 text-left bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors duration-200 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                    <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">View Calendar</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">See your upcoming skill sessions</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-8 bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to Exchange Skills?</h2>
          <p className="text-primary-100 mb-6">
            Connect with others who want to learn what you know and can teach what you want to learn.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => onNavigate('discover')}
              className="px-6 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Find Partners
            </button>
            <button
              onClick={() => onNavigate('analytics')}
              className="px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-600 transition-all duration-200"
            >
              View Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};