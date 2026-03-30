import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, Smartphone, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Sessions', href: '/sessions', icon: Calendar },
  { name: 'Devices', href: '/devices', icon: Smartphone },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="flex h-screen w-64 flex-col bg-[#0a1628] text-white">
      {/* Logo */}
      <div className="flex h-16 items-center px-6">
        <h1 className="text-2xl font-bold">iMotion</h1>
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
              <item.icon className="h-5 w-5" strokeWidth={2} />
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
