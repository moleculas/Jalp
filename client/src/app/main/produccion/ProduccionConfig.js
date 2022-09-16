import { lazy } from 'react';
import Produccion1 from './tabs/produccion-1/Produccion1';
import Produccion4 from './tabs/produccion-4/Produccion4';
import Objetivos from './tabs/objetivos/Objetivos';

const Produccion = lazy(() => import('./Produccion'));

const ProduccionConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'produccion',
      element: <Produccion />,
      children: [
        {
          path: 'produccion-1/mod-1',
          element: <Produccion1 />,
        },
        {
          path: 'produccion-1/mod-2',
          element: <Produccion1 />,
        },
        {
          path: 'produccion-1/mod-3',
          element: <Produccion1 />,
        },
        {
          path: 'produccion-4',
          element: <Produccion4 />,
        },
        {
          path: 'objetivos',
          element: <Objetivos />,
        },
      ]
    }
  ],
};

export default ProduccionConfig;