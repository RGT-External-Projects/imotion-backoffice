import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Activity as ActivityIcon, Smartphone, User, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { StimulusCards } from './components/StimulusCards';
import { ActivityTab } from './components/ActivityTab';
import { useSession } from '@/hooks/useSessions';
import { format } from 'date-fns';

type TabType = 'overview' | 'activity';

// Helper to format duration from seconds to readable string
const formatDuration = (seconds: number | null): string => {
  if (!seconds) return 'N/A';
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}m ${secs}s`;
};

// Helper to get status badge styling
const getStatusBadge = (status: string) => {
  const styles = {
    'COMPLETED': 'bg-emerald-700 text-white hover:bg-emerald-700 border-none px-3 py-1 h-8 rounded-lg font-normal text-sm',
    'IN_PROGRESS': 'bg-blue-100 text-blue-700 hover:bg-blue-100',
    'PAUSED': 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100',
    'INTERRUPTED': 'bg-red-100 text-red-700 hover:bg-red-100',
  };
  
  const labels = {
    'COMPLETED': 'Completed',
    'IN_PROGRESS': 'In Progress',
    'PAUSED': 'Paused',
    'INTERRUPTED': 'Interrupted',
  };

  return {
    className: styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-700',
    label: labels[status as keyof typeof labels] || status,
  };
};

export function SessionDetails() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  
  const { data: session, isLoading, error } = useSession(id!);

  if (isLoading) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-6 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigate('/sessions')}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-6 w-6 text-foreground" />
            </button>
            <Skeleton className="h-10 w-48" />
          </div>
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="flex-1 flex">
          <div className="flex-1 p-6">
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="w-96 border-l p-6">
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <p className="text-red-500 mb-4">Failed to load session details</p>
        <button
          onClick={() => navigate('/sessions')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Sessions
        </button>
      </div>
    );
  }

  const statusBadge = getStatusBadge(session.status);
  const formattedDate = format(new Date(session.sessionTimestamp), 'dd MMM yyyy');

  return (
    <div className="h-full flex flex-col">
      {/* Header Section - Fixed */}
      <div className="p-6 border-b border-gray-200 bg-white">
        {/* Session Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/sessions')}
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer group"
            title="Back to Sessions"
          >
            <ArrowLeft className="h-6 w-6 text-foreground group-hover:text-blue-600 transition-colors" />
          </button>
          <h1 className="text-3xl font-bold">Session Details</h1>
          <span className="text-3xl font-light text-muted-foreground">#{session.id.slice(0, 8)}</span>
        </div>
        <div className="mt-2">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Phone ID: {session.therapistPhone?.displayName || session.therapistPhone?.phoneNumber || 'N/A'}</span>
            <span>•</span>
            <span>Device ID: {session.device?.deviceId || 'N/A'}</span>
            <span>•</span>
            <span>Date: {formattedDate}</span>
            <span>•</span>
            <Badge className={statusBadge.className}>
              {session.status === 'COMPLETED' ? (
                <div className="flex items-center gap-2">
                  <div className="bg-white rounded-full p-0.5 flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#106334" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span className="text-lg font-medium tracking-wide">Completed</span>
                </div>
              ) : (
                <>
                  <span className="mr-1.5">●</span>
                  {statusBadge.label}
                </>
              )}
            </Badge>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column - Stimulus Cards (Not Scrollable) */}
        <div className="flex-1 p-6 overflow-y-auto">
          <h3 className="font-semibold mb-6 text-lg">Stimuli Used</h3>
          <StimulusCards
            initialSettings={session.initialSettings}
            finalSettings={session.finalSettings}
          />
        </div>

        {/* Right Column - Tabs & Content */}
        <div className="w-96 border-l border-gray-200 bg-gray-50 flex flex-col">
          {/* Tabs */}
          <div className="flex gap-2 p-4 bg-white border-b border-gray-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={cn(
                'flex-1 px-6 py-2.5 font-medium rounded-lg transition-colors',
                activeTab === 'overview'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={cn(
                'flex-1 px-6 py-2.5 font-medium rounded-lg transition-colors',
                activeTab === 'activity'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              Activity
            </button>
          </div>

          {/* Tab Content - Changes based on active tab */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'overview' ? (
              <>
                <h3 className="font-semibold mb-6 text-lg">Overview</h3>
                <div className="space-y-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <ActivityIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-2">Session ID</p>
                        <p className="text-xl font-semibold text-gray-900">{session.id.slice(0, 13)}...</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Smartphone className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-2">Device ID</p>
                        <p className="text-xl font-semibold text-gray-900">
                          {session.device?.deviceId || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Smartphone className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-2">Phone ID</p>
                        <p className="text-xl font-semibold text-gray-900">
                          {session.therapistPhone?.displayName || session.therapistPhone?.phoneNumber || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <User className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-2">Patient Code</p>
                        <p className="text-xl font-semibold text-gray-900">
                          {session.patient?.patientCode || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-2">Duration</p>
                        <p className="text-xl font-semibold text-gray-900">
                          {formatDuration(session.duration)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <ActivityIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-2">Status</p>
                        <Badge className={cn(statusBadge.className, "mt-1")}>
                          {session.status === 'COMPLETED' ? (
                            <div className="flex items-center gap-2">
                              <div className="bg-white rounded-full p-0.5 flex items-center justify-center">
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#106334" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                              </div>
                              <span className="font-medium">Completed</span>
                            </div>
                          ) : (
                            <>
                              <span className="mr-1.5">●</span>
                              {statusBadge.label}
                            </>
                          )}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <ActivityTab activityLogs={session.activityLogs || []} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
