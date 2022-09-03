import { lazy } from 'react';

const ActivitiesPage = lazy(() => import('./ActivitiesPage'));

const activitiesPageConfig = {
  settings: {
    layout: {
      config: {
        containerWidth: '100%',
      },
    },
  },
  routes: [
    {
      path: 'pages/activities',
      element: <ActivitiesPage />,
    },
  ],
};

export default activitiesPageConfig;
