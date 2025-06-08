import React from 'react';
import { Users, ArrowRight, CheckCircle, Lightbulb, BookOpen, Heart } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (view: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-colors duration-200">
      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
              Share Skills,
              <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent block">
                Learn Together
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              Connect with people who want to learn what you know, and learn from those who know what you want to master. 
              A peer-to-peer skill exchange platform where everyone teaches and everyone learns.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => onNavigate('signup')}
                className="px-8 py-4 bg-primary-600 text-white text-lg font-semibold rounded-xl hover:bg-primary-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                Start Exchanging Skills <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => onNavigate('discover')}
                className="px-8 py-4 text-primary-600 dark:text-primary-400 text-lg font-semibold hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl transition-colors duration-200"
              >
                Explore Skills
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 animate-slide-up">
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">1,000+</h3>
              <p className="text-gray-600 dark:text-gray-400">Skill Exchangers</p>
            </div>
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-accent-100 dark:bg-accent-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-8 h-8 text-accent-600 dark:text-accent-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">500+</h3>
              <p className="text-gray-600 dark:text-gray-400">Skills Available</p>
            </div>
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">5,000+</h3>
              <p className="text-gray-600 dark:text-gray-400">Successful Exchanges</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              How Skillnestor Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Simple, effective skill exchange in three easy steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-gray-50 dark:bg-gray-700 rounded-2xl">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Lightbulb className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Share Your Skills</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Tell us what you can teach and what you want to learn. From coding to cooking, 
                every skill has value.
              </p>
            </div>

            <div className="text-center p-8 bg-gray-50 dark:bg-gray-700 rounded-2xl">
              <div className="w-16 h-16 bg-accent-100 dark:bg-accent-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-accent-600 dark:text-accent-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Find Perfect Matches</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Our smart matching system connects you with people who want to learn what you teach 
                and can teach what you want to learn.
              </p>
            </div>

            <div className="text-center p-8 bg-gray-50 dark:bg-gray-700 rounded-2xl">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Start Learning</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Schedule sessions, exchange knowledge, and grow together. 
                Build meaningful connections while expanding your skillset.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Why Choose Skillnestor?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: CheckCircle,
                title: 'Free Skill Exchange',
                description: 'No money involved - just pure knowledge sharing between passionate learners.'
              },
              {
                icon: Users,
                title: 'Smart Matching',
                description: 'Find the perfect learning partners based on complementary skills and interests.'
              },
              {
                icon: Heart,
                title: 'Community Driven',
                description: 'Join a supportive community where everyone teaches and everyone learns.'
              },
              {
                icon: Lightbulb,
                title: 'Diverse Skills',
                description: 'From technical skills to creative arts, life skills to professional development.'
              },
              {
                icon: BookOpen,
                title: 'Flexible Learning',
                description: 'Learn at your own pace with scheduling that works for both partners.'
              },
              {
                icon: ArrowRight,
                title: 'Track Progress',
                description: 'Monitor your learning journey and see your skill network grow over time.'
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="p-8 bg-white dark:bg-gray-800 rounded-2xl hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary-600 to-accent-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Your Skill Exchange Journey?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of learners who are already growing their skills through 
            meaningful peer-to-peer exchanges.
          </p>
          <button
            onClick={() => onNavigate('signup')}
            className="px-8 py-4 bg-white text-primary-600 text-lg font-semibold rounded-xl hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Join Skillnestor Today
          </button>
        </div>
      </section>
    </div>
  );
};