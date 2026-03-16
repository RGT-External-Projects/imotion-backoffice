import { useState } from 'react';
import { MoreVertical, Plus, UserX } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { InviteUserModal } from './InviteUserModal';

interface User {
  id: string;
  name: string;
  email: string;
  dateJoined: string;
  role: string;
}

const initialUsers: User[] = [
  {
    id: 'A-021',
    name: 'A-021',
    email: 'john@imotion.com',
    dateJoined: '12 Jan 2026 • 09:15 AM',
    role: 'Administrator',
  },
  {
    id: 'T-021',
    name: 'T-021',
    email: 'jonathan@imotion.com',
    dateJoined: '02 Feb 2026 • 14:45 PM',
    role: 'Therapist',
  },
  {
    id: 'T-024',
    name: 'T-024',
    email: 'jonathan@imotion.com',
    dateJoined: '23 Dec 2025 • 10:30 AM',
    role: 'Therapist',
  },
  {
    id: 'T-045',
    name: 'T-045',
    email: 'jonathan@imotion.com',
    dateJoined: '02 Feb 2026 • 12:00 PM',
    role: 'Therapist',
  },
  {
    id: 'T-123',
    name: 'T-123',
    email: 'jonathan@imotion.com',
    dateJoined: '14 Feb 2026 • 10:30 AM',
    role: 'Administrator',
  },
];

export function UserManagementTab() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [showDropdownId, setShowDropdownId] = useState<string | null>(null);

  const handleInviteUser = (email: string, role: string) => {
    console.log('Invite user:', email, role);
    // In a real app, this would make an API call
  };

  const handleRemoveAccess = (userId: string) => {
    console.log('Remove access for:', userId);
    setShowDropdownId(null);
    // In a real app, this would make an API call
  };

  return (
    <>
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">User Management</h2>
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Invite users</span>
          </button>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 text-left text-sm text-gray-600">
                <th className="pb-3 font-medium">Users</th>
                <th className="pb-3 font-medium">Date joined</th>
                <th className="pb-3 font-medium">Roles</th>
                <th className="pb-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 last:border-0">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gray-200 text-gray-600">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-gray-600">{user.dateJoined}</td>
                  <td className="py-4 text-gray-900">{user.role}</td>
                  <td className="py-4 text-right">
                    <div className="relative inline-block">
                      <button
                        onClick={() => setShowDropdownId(showDropdownId === user.id ? null : user.id)}
                        className="p-1 hover:bg-gray-100 rounded cursor-pointer"
                      >
                        <MoreVertical className="h-5 w-5 text-gray-600" />
                      </button>
                      
                      {showDropdownId === user.id && (
                        <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                          <button
                            onClick={() => handleRemoveAccess(user.id)}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                          >
                            <UserX className="h-4 w-4" />
                            <span>Remove access</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite User Modal */}
      <InviteUserModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInvite={handleInviteUser}
      />
    </>
  );
}
