import { lazy } from 'react';

const NotesApp = lazy(() => import('./NotesApp'));

const NotesAppConfig = {
  settings: {
    layout: {
      config: {
        containerWidth: '100%',
      },
    },
  },
  routes: [
    {
      path: 'apps/notes',
      element: <NotesApp />,
      children: [
        {
          path: ':filter',
          element: <NotesApp />,
          children: [
            {
              path: ':id',
              element: <NotesApp />,
            },
          ],
        },
      ],
    },
  ],
};

export default NotesAppConfig;
