import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '@/layout/MainLayout';
import { Dashboard } from '@/pages/Dashboard/index';
import { Sessions } from '@/pages/Sessions/index';
import { SessionDetails } from '@/pages/Sessions/SessionDetails';
import { Devices } from '@/pages/Devices/index';
import { DeviceDetails } from '@/pages/Devices/DeviceDetails';
import { Analytics } from '@/pages/Analytics/index';
import { Settings } from '@/pages/Settings/index';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'sessions',
        element: <Sessions />,
      },
      {
        path: 'sessions/:id',
        element: <SessionDetails />,
      },
      {
        path: 'devices',
        element: <Devices />,
      },
      {
        path: 'devices/:id',
        element: <DeviceDetails />,
      },
      {
        path: 'analytics',
        element: <Analytics />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
    ],
  },
]);
