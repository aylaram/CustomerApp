import Iconify from '../../../components/iconify';

const icon = (name) => <Iconify icon={name} />;

const navConfig = [
  {
    title: 'Customers',
    path: '/dashboard/customers',
    icon: icon('mdi:user-group'),
  },
  {
    title: 'Trainings',
    path: '/dashboard/trainings',
    icon: icon('material-symbols:model-training'),
  },
  {
    title: 'Calendar',
    path: '/dashboard/calendar',
    icon: icon('material-symbols:calendar-month'),
  },
  {
    title: 'Statistics',
    path: '/dashboard/statistics',
    icon: icon('material-symbols:bar-chart-4-bars-rounded'),
  },
];

export default navConfig;
