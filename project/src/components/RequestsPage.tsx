import React, { useState } from 'react';
import { Clock, CheckCircle, XCircle, Calendar, MessageSquare, User, ArrowRight } from 'lucide-react';
import { usePairRequests } from '../hooks/usePairRequests';
import { useSkillSessions } from '../hooks/useSkillSessions';
import { User as AppUser } from '../types';

interface RequestsPageProps {
  currentUser: AppUser;
}

export const RequestsPage: React.FC<RequestsPageProps> = ({ currentUser }) => {
  const { sentRequests, receivedRequests, updateRequestStatus, loading } = usePairRequests(currentUser.id);
  const { createSession } = useSkillSessions(currentUser.id);
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [schedulingRequest, setSchedulingRequest] = useState<string | null>(null);
  const [scheduledDate, setScheduledDate] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [sessionNotes, setSessionNotes] = useState('');

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await updateRequestStatus(requestId, 'accepted');
      setSchedulingRequest(requestId);
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  const handleDeclineRequest = async (requestId: string) => {
    try {
      await updateRequestStatus(requestId, 'declined');
    } catch (error) {
      console.error('Error declining request:', error);
    }
  };

  const handleScheduleSession = async () => {
    if (!schedulingRequest) return;

    const request = receivedRequests.find(r => r.id === schedulingRequest);
    if (!request) return;

    try {
      await createSession({
        pair_request_id: request.id,
        teacher_id: currentUser.id,
        learner_id: request.requester_id,
        skill: request.skill,
        scheduled_date: scheduledDate || undefined,
        meeting_link: meetingLink || undefined,
        notes: sessionNotes || undefined
      });

      setSchedulingRequest(null);
      setScheduledDate('');
      setMeetingLink('');
      setSessionNotes('');
    } catch (error) {
      console.error('Error scheduling session:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'accepted': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      case 'declined': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
      case 'cancelled': return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Pair Requests
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Manage your skill exchange requests and connect with learning partners
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('received')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'received'
                  ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Received ({receivedRequests.filter(r => r.status === 'pending').length})
            </button>
            <button
              onClick={() => setActiveTab('sent')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'sent'
                  ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Sent ({sentRequests.length})
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'received' ? (
              <div className="space-y-4">
                {receivedRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No requests yet</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      When others want to learn from you, their requests will appear here.
                    </p>
                  </div>
                ) : (
                  receivedRequests.map((request) => (
                    <div
                      key={request.id}
                      className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white">
                                {request.requester?.name}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                wants to learn <span className="font-medium text-primary-600 dark:text-primary-400">{request.skill}</span>
                              </p>
                            </div>
                          </div>

                          {request.message && (
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 ml-13">
                              "{request.message}"
                            </p>
                          )}

                          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 ml-13">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDate(request.created_at)}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </span>
                          </div>
                        </div>

                        {request.status === 'pending' && (
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => handleDeclineRequest(request.id)}
                              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              title="Decline"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleAcceptRequest(request.id)}
                              className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                              title="Accept"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {sentRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <ArrowRight className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No requests sent</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Start exploring profiles and send requests to potential skill partners.
                    </p>
                  </div>
                ) : (
                  sentRequests.map((request) => (
                    <div
                      key={request.id}
                      className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-accent-100 dark:bg-accent-900/30 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-accent-600 dark:text-accent-400" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white">
                                {request.requested?.name}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Request for <span className="font-medium text-primary-600 dark:text-primary-400">{request.skill}</span>
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 ml-13">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDate(request.created_at)}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Scheduling Modal */}
        {schedulingRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Schedule Learning Session
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date & Time (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Meeting Link (Optional)
                  </label>
                  <input
                    type="url"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    placeholder="https://zoom.us/j/..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Session Notes (Optional)
                  </label>
                  <textarea
                    value={sessionNotes}
                    onChange={(e) => setSessionNotes(e.target.value)}
                    rows={3}
                    placeholder="What would you like to cover in this session?"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setSchedulingRequest(null)}
                  className="flex-1 py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleScheduleSession}
                  className="flex-1 py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
                >
                  Create Session
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};