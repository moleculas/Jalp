import { lazy } from 'react';

const Produccion = lazy(() => import('./Produccion'));

const ProduccionConfig = {
  settings: {
    layout: {
      config: {
        containerWidth: '100%',
      },
    },
  },
  routes: [
    {
      path: '/produccion',
      element: <Produccion />,
    }
  ],
};

export default ProduccionConfig;