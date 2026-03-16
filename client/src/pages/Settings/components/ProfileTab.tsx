import { useState } from 'react';
import { LogOut } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function ProfileTab() {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');

  const handleUpdateProfile = () => {
    console.log('Update profile:', { nickname, email, phone, role });
  };

  const handleLogout = () => {
    console.log('Logout');
  };

  return (
    <div className="space-y-8">
      {/* Profile Settings Section */}
      <div>
        <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Nickname */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nickname
            </label>
            <input
              type="text"
              placeholder="Placeholder"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email address
            </label>
            <input
              type="email"
              placeholder="Placeholder"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone number
            </label>
            <input
              type="tel"
              placeholder="Placeholder"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <Select value={role} onValueChange={(value) => setRole(value || '')}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Placeholder" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrator</SelectItem>
                <SelectItem value="therapist">Therapist</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <button
          onClick={handleUpdateProfile}
          className="mt-6 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 cursor-pointer"
        >
          Update profile
        </button>
      </div>

      {/* Logout Section */}
      <div className="border-t border-gray-200 pt-8">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">Logout account</h3>
            <p className="text-sm text-gray-600">
              Make sure your changes are saved before leaving.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 cursor-pointer"
          >
            <span>Logout</span>
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
