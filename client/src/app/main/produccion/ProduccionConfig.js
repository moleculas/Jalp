import { lazy } from 'react';
import Produccion0 from './tabs/produccion-0/Produccion0';
import Produccion1 from './tabs/produccion-1/Produccion1';
import Produccion2 from './tabs/produccion-2/Produccion2';
import Produccion3 from './tabs/produccion-3/Produccion3';
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
          path: 'produccion-0',
          element: <Produccion0 />,
        },
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
          path: 'produccion-2/mod-1',
          element: <Produccion2 />,
        },
        {
          path: 'produccion-2/mod-2',
          element: <Produccion2 />,
        },
        {
          path: 'produccion-2/mod-3',
          element: <Produccion2 />,
        },
        {
          path: 'produccion-3/mod-1',
          element: <Produccion3 />,
        },
        {
          path: 'produccion-3/mod-2',
          element: <Produccion3 />,
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