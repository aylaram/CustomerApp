import { Navigate, useRoutes } from 'react-router-dom';
import DashboardLayout from './layouts/dashboard';
import UserPage from './pages/UserPage';
import Trainings from './pages/Trainings';
import Calendar from './pages/Calendar';
import Statistics from './pages/Statistics';

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
  ]);

  return routes;
}
