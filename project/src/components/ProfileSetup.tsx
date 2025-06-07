import React, { useState, useEffect } from 'react';
import { User, BookOpen, Lightbulb, Save, X } from 'lucide-react';
import { AVAILABLE_SKILLS } from '../types';
import { useProfile } from '../hooks/useProfile';

interface ProfileSetupProps {
  userId: string;
  onComplete: () => void;
  isFirstTime?: boolean;
}

export const ProfileSetup: React.FC<ProfileSetupProps> = ({ 
  userId, 
  onComplete, 
  isFirstTime = false 
}) => {
  const { profile, createOrUpdateProfile } = useProfile(userId);
  const [teachSkills, setTeachSkills] = useState<string[]>([]);
  const [learnSkills, setLearnSkills] = useState<string[]>([]);
  const [bio, setBio] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [customTeachSkill, setCustomTeachSkill] = useState('');
  const [customLearnSkill, setCustomLearnSkill] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (profile) {
      setTeachSkills(profile.teach_skills || []);
      setLearnSkills(profile.learn_skills || []);
      setBio(profile.bio || '');
      setIsPublic(profile.is_public);
    }
  }, [profile]);

  const addSkill = (skill: string, type: 'teach' | 'learn') => {
    const trimmedSkill = skill.trim();
    if (!trimmedSkill) return;

    if (type === 'teach') {
      if (teachSkills.length >= 3) {
        setErrors(['You can only select up to 3 skills to teach']);
        return;
      }
      if (!teachSkills.includes(trimmedSkill)) {
        setTeachSkills([...teachSkills, trimmedSkill]);
        setCustomTeachSkill('');
      }
    } else {
      if (learnSkills.length >= 3) {
        setErrors(['You can only select up to 3 skills to learn']);
        return;
      }
      if (!learnSkills.includes(trimmedSkill)) {
        setLearnSkills([...learnSkills, trimmedSkill]);
        setCustomLearnSkill('');
      }
    }
    setErrors([]);
  };

  const removeSkill = (skill: string, type: 'teach' | 'learn') => {
    if (type === 'teach') {
      setTeachSkills(teachSkills.filter(s => s !== skill));
    } else {
      setLearnSkills(learnSkills.filter(s => s !== skill));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    if (teachSkills.length === 0 && learnSkills.length === 0) {
      setErrors(['Please select at least one skill to teach or learn']);
      return;
    }

    setLoading(true);
    try {
      await createOrUpdateProfile({
        teach_skills: teachSkills,
        learn_skills: learnSkills,
        bio: bio.trim(),
        is_public: isPublic
      });
      onComplete();
    } catch (error) {
      console.error('Error saving profile:', error);
      setErrors(['Failed to save profile. Please try again.']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-200">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {isFirstTime ? 'Welcome to Skillnestor!' : 'Update Your Profile'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isFirstTime 
              ? 'Let\'s set up your profile to find the perfect skill exchange partners'
              : 'Update your skills and preferences'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Skills to Teach */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Skills I Can Teach</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Select up to 3 skills you can teach others</p>
              </div>
            </div>

            {/* Selected Skills */}
            <div className="flex flex-wrap gap-2 mb-4">
              {teachSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm rounded-full"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill, 'teach')}
                    className="hover:bg-green-200 dark:hover:bg-green-800 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Skill Selection */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Choose from popular skills:
                </label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {AVAILABLE_SKILLS.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => addSkill(skill, 'teach')}
                      disabled={teachSkills.includes(skill) || teachSkills.length >= 3}
                      className={`px-3 py-1 text-sm rounded-full border transition-colors duration-200 ${
                        teachSkills.includes(skill)
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700'
                          : teachSkills.length >= 3
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 border-gray-300 dark:border-gray-600 cursor-not-allowed'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Or add a custom skill:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customTeachSkill}
                    onChange={(e) => setCustomTeachSkill(e.target.value)}
                    placeholder="Enter a skill you can teach"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    disabled={teachSkills.length >= 3}
                  />
                  <button
                    type="button"
                    onClick={() => addSkill(customTeachSkill, 'teach')}
                    disabled={!customTeachSkill.trim() || teachSkills.length >= 3}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Skills to Learn */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Skills I Want to Learn</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Select up to 3 skills you want to learn</p>
              </div>
            </div>

            {/* Selected Skills */}
            <div className="flex flex-wrap gap-2 mb-4">
              {learnSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm rounded-full"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill, 'learn')}
                    className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Skill Selection */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Choose from popular skills:
                </label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {AVAILABLE_SKILLS.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => addSkill(skill, 'learn')}
                      disabled={learnSkills.includes(skill) || learnSkills.length >= 3}
                      className={`px-3 py-1 text-sm rounded-full border transition-colors duration-200 ${
                        learnSkills.includes(skill)
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700'
                          : learnSkills.length >= 3
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 border-gray-300 dark:border-gray-600 cursor-not-allowed'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Or add a custom skill:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customLearnSkill}
                    onChange={(e) => setCustomLearnSkill(e.target.value)}
                    placeholder="Enter a skill you want to learn"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    disabled={learnSkills.length >= 3}
                  />
                  <button
                    type="button"
                    onClick={() => addSkill(customLearnSkill, 'learn')}
                    disabled={!customLearnSkill.trim() || learnSkills.length >= 3}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bio and Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Additional Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bio (Optional)
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  placeholder="Tell others about yourself, your experience, or what you're passionate about..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="w-4 h-4 text-primary-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500"
                />
                <label htmlFor="isPublic" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Make my profile visible in public discovery (recommended)
                </label>
              </div>
            </div>
          </div>

          {errors.length > 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <ul className="text-sm text-red-600 dark:text-red-400 space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 disabled:bg-primary-400 transition-colors duration-200"
            >
              <Save className="w-5 h-5" />
              {loading ? 'Saving...' : isFirstTime ? 'Complete Setup' : 'Update Profile'}
            </button>
            {!isFirstTime && (
              <button
                type="button"
                onClick={onComplete}
                className="flex-1 py-3 px-6 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};