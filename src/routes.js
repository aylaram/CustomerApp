import { Navigate, useRoutes } from 'react-router-dom';
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
import UserPage from './pages/UserPage';
import Page404 from './pages/Page404';
import Trainings from './pages/Trainings';
import Calendar from './pages/Calendar';
import Statistics from './pages/Statistics';

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/customers" />, index: true },
        { path: 'customers', element: <UserPage /> },
        { path: 'trainings', element: <Trainings /> },
        { path: 'calendar', element: <Calendar /> },
        { path: 'statistics', element: <Statistics /> },

      ],
    },

    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/customers" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Page404 />,
    },
  ]);

  return routes;
}
