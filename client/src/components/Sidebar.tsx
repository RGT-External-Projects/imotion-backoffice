import { Link, useLocation } from 'react-router-dom';
import ImotionLogo from '@/assets/imotion-logo.svg';
import { cn } from '@/lib/utils';
import HomeIcon from '@/assets/icons/HomeIcon';
import SessionsIcon from '@/assets/icons/SessionsIcon';
import BluetoothIcon from '@/assets/icons/BluetoothIcon';
import AnalyticsIcon from '@/assets/icons/AnalyticsIcon';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Sessions', href: '/sessions', icon: SessionsIcon },
  { name: 'Devices', href: '/devices', icon: BluetoothIcon },
  { name: 'Analytics', href: '/analytics', icon: AnalyticsIcon },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="flex h-screen w-64 flex-col bg-[#0a1628] text-white">
      {/* Logo */}
      <div className="flex h-16 items-center px-6">
        <img
          src={ImotionLogo}
          alt="iMotion"
          className="h-6 w-auto"
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = item.href === '/' 
            ? location.pathname === '/' 
            : location.pathname.startsWith(item.href);
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Settings section hidden for now
      <div className="border-t border-gray-800 p-3">
        <Link
          to="/settings"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            location.pathname.startsWith('/settings')
              ? "bg-blue-600 text-white"
              : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
          )}
        >
          <Settings className="h-5 w-5" strokeWidth={2} />
          Settings
        </Link>
      </div>
      */}
    </div>
  );
}
