import React, { useState } from 'react';
import { Calendar, Clock, Video, FileText, User, CheckCircle, XCircle, Edit3 } from 'lucide-react';
import { useSkillSessions } from '../hooks/useSkillSessions';
import { User as AppUser } from '../types';

interface CalendarPageProps {
  currentUser: AppUser;
}

export const CalendarPage: React.FC<CalendarPageProps> = ({ currentUser }) => {
  const { sessions, updateSession, loading } = useSkillSessions(currentUser.id);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [editingSession, setEditingSession] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    scheduled_date: '',
    meeting_link: '',
    notes: ''
  });

  const upcomingSessions = sessions.filter(s => 
    s.status === 'scheduled' && 
    (!s.scheduled_date || new Date(s.scheduled_date) > new Date())
  );

  const pastSessions = sessions.filter(s => 
    s.status === 'completed' || 
    (s.scheduled_date && new Date(s.scheduled_date) < new Date())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCompleteSession = async (sessionId: string) => {
    try {
      await updateSession(sessionId, { status: 'completed' });
    } catch (error) {
      console.error('Error completing session:', error);
    }
  };

  const handleCancelSession = async (sessionId: string) => {
    try {
      await updateSession(sessionId, { status: 'cancelled' });
    } catch (error) {
      console.error('Error cancelling session:', error);
    }
  };

  const handleEditSession = (session: any) => {
    setEditingSession(session.id);
    setEditForm({
      scheduled_date: session.scheduled_date ? new Date(session.scheduled_date).toISOString().slice(0, 16) : '',
      meeting_link: session.meeting_link || '',
      notes: session.notes || ''
    });
  };

  const handleSaveEdit = async () => {
    if (!editingSession) return;

    try {
      await updateSession(editingSession, {
        scheduled_date: editForm.scheduled_date || undefined,
        meeting_link: editForm.meeting_link || undefined,
        notes: editForm.notes || undefined
      });
      setEditingSession(null);
    } catch (error) {
      console.error('Error updating session:', error);
    }
  };

  const getPartnerInfo = (session: any) => {
    const isTeacher = session.teacher_id === currentUser.id;
    const partner = isTeacher ? session.learner : session.teacher;
    const role = isTeacher ? 'Teaching' : 'Learning';
    return { partner, role };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your calendar...</p>
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
            Learning Calendar
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Manage your skill exchange sessions and track your learning journey
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Sessions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                Upcoming Sessions ({upcomingSessions.length})
              </h2>
            </div>

            <div className="p-6">
              {upcomingSessions.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No upcoming sessions</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Accept some pairing requests to schedule your first learning session!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingSessions.map((session) => {
                    const { partner, role } = getPartnerInfo(session);
                    return (
                      <div
                        key={session.id}
                        className="bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 rounded-lg p-4 border border-primary-200 dark:border-primary-700"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 text-xs font-medium rounded-full">
                                {role}
                              </span>
                              <span className="font-semibold text-gray-900 dark:text-white">
                                {session.skill}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                              <User className="w-4 h-4" />
                              <span>with {partner?.name}</span>
                            </div>

                            {session.scheduled_date && (
                              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                                <Clock className="w-4 h-4" />
                                <span>{formatDate(session.scheduled_date)}</span>
                              </div>
                            )}

                            {session.meeting_link && (
                              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                                <Video className="w-4 h-4" />
                                <a
                                  href={session.meeting_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary-600 dark:text-primary-400 hover:underline"
                                >
                                  Join Meeting
                                </a>
                              </div>
                            )}

                            {session.notes && (
                              <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <FileText className="w-4 h-4 mt-0.5" />
                                <span>{session.notes}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => handleEditSession(session)}
                              className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                              title="Edit Session"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleCompleteSession(session.id)}
                              className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                              title="Mark Complete"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleCancelSession(session.id)}
                              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              title="Cancel Session"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Past Sessions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                Completed Sessions ({pastSessions.length})
              </h2>
            </div>

            <div className="p-6 max-h-96 overflow-y-auto">
              {pastSessions.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No completed sessions yet</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Your completed learning sessions will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pastSessions.map((session) => {
                    const { partner, role } = getPartnerInfo(session);
                    return (
                      <div
                        key={session.id}
                        className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs font-medium rounded-full">
                              {role}
                            </span>
                            <span className="font-medium text-gray-900 dark:text-white text-sm">
                              {session.skill}
                            </span>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            session.status === 'completed' 
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                              : 'bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-300'
                          }`}>
                            {session.status}
                          </span>
                        </div>
                        
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          with {partner?.name}
                          {session.scheduled_date && (
                            <span className="ml-2">• {formatDate(session.scheduled_date)}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Edit Session Modal */}
        {editingSession && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Edit Session
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={editForm.scheduled_date}
                    onChange={(e) => setEditForm(prev => ({ ...prev, scheduled_date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Meeting Link
                  </label>
                  <input
                    type="url"
                    value={editForm.meeting_link}
                    onChange={(e) => setEditForm(prev => ({ ...prev, meeting_link: e.target.value }))}
                    placeholder="https://zoom.us/j/..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Session Notes
                  </label>
                  <textarea
                    value={editForm.notes}
                    onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    placeholder="What will you cover in this session?"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setEditingSession(null)}
                  className="flex-1 py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};