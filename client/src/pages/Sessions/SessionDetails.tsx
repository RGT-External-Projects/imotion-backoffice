import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Activity as ActivityIcon, Smartphone, User, Calendar, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { StimulusCards } from './components/StimulusCards';
import { ActivityTab } from './components/ActivityTab';

type TabType = 'overview' | 'activity';

export function SessionDetails() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  return (
    <div className="h-full flex flex-col">
      {/* Header Section - Fixed */}
      <div className="p-6 border-b border-gray-200 bg-white">
        {/* Back Button */}
        <button
          onClick={() => navigate('/sessions')}
          className="mb-4 flex items-center gap-2 text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Back to Sessions</span>
        </button>

        {/* Session Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">S1054</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Phone ID: P - 021</span>
            <span>•</span>
            <span>Device ID: D - 118</span>
            <span>•</span>
            <span>Date: 26 Feb 2026</span>
            <span>•</span>
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
              <span className="mr-1.5">●</span>
              Completed
            </Badge>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column - Stimulus Cards (Not Scrollable) */}
        <div className="flex-1 p-6">
          <StimulusCards />
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
                        <p className="text-xl font-semibold text-gray-900">v1.2.4</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Smartphone className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-2">Device ID</p>
                        <p className="text-xl font-semibold text-gray-900">D - 118</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Smartphone className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-2">Phone ID</p>
                        <p className="text-xl font-semibold text-gray-900">P - 021</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <User className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-2">Patient Code</p>
                        <p className="text-xl font-semibold text-gray-900">Patient - 233</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-2">Last used</p>
                        <p className="text-xl font-semibold text-gray-900">26 Feb 2026</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-2">Duration</p>
                        <p className="text-xl font-semibold text-gray-900">8 minutes</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <ActivityIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-2">Status</p>
                        <Badge className="bg-green-600 text-white hover:bg-green-600 mt-1">
                          <span className="mr-1.5">✓</span>
                          Active
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <ActivityTab />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
