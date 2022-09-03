import { lazy } from 'react';

const ProjectDashboardApp = lazy(() => import('./ProjectDashboardApp'));

const ProjectDashboardAppConfig = {
  settings: {
    layout: {
      config: {
        containerWidth: '100%',
      },
    },
  },
  routes: [
    {
      path: 'dashboards/project',
      element: <ProjectDashboardApp />,
    },
  ],
};

export default ProjectDashboardAppConfig;
