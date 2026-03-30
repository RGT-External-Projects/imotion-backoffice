import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { ArrowLeft, Bell } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const getPageTitle = (pathname: string): string => {
  if (pathname === '/') return 'Dashboard';
  if (pathname.startsWith('/sessions/')) return 'Session details';
  if (pathname === '/sessions') return 'Sessions';
  if (pathname.startsWith('/devices/')) return 'Devices details';
  if (pathname === '/devices') return 'Devices';
  if (pathname === '/analytics') return 'Analytics';
  if (pathname === '/settings') return 'Settings';
  return 'iMotion';
};

export function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const pageTitle = getPageTitle(location.pathname);
  const isDeviceDetails = location.pathname.startsWith('/devices/');
  const isSessionDetails = location.pathname.startsWith('/sessions/');
  const showBackButton = isDeviceDetails || isSessionDetails;
  const backTarget = isDeviceDetails ? '/devices' : isSessionDetails ? '/sessions' : '/';

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header - Shared across all pages */}
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
          <div className="flex items-center gap-3">
            {showBackButton && (
              <button
                type="button"
                onClick={() => navigate(backTarget)}
                className="rounded-full p-1 hover:bg-gray-100"
              >
                <ArrowLeft className="h-4 w-4 text-gray-900" />
              </button>
            )}
            <h2 className="text-lg font-semibold">{pageTitle}</h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="rounded-full p-2 hover:bg-gray-100">
              <Bell className="h-5 w-5 text-gray-600" />
            </button>
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
