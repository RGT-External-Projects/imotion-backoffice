import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ProfileTab } from './components/ProfileTab';
import { UserManagementTab } from './components/UserManagementTab';
import { NotificationsTab } from './components/NotificationsTab';

type TabType = 'profile' | 'userManagement' | 'notifications';

export function Settings() {
  const [activeTab, setActiveTab] = useState<TabType>('profile');

  return (
    <div className="h-full p-6">
      {/* Tabs */}
      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setActiveTab('profile')}
          className={cn(
            'px-6 py-2.5 font-medium rounded-lg transition-colors',
            activeTab === 'profile'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          )}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab('userManagement')}
          className={cn(
            'px-6 py-2.5 font-medium rounded-lg transition-colors',
            activeTab === 'userManagement'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          )}
        >
          User management
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={cn(
            'px-6 py-2.5 font-medium rounded-lg transition-colors',
            activeTab === 'notifications'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          )}
        >
          Notifications
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'profile' && <ProfileTab />}
        {activeTab === 'userManagement' && <UserManagementTab />}
        {activeTab === 'notifications' && <NotificationsTab />}
      </div>
    </div>
  );
}
