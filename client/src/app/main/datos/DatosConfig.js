import { lazy } from 'react';
const Datos = lazy(() => import('./Datos'));

const DatosConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'datos',
      element: <Datos />,
    },
    {
      path: 'datos/mod-1',
      element: <Datos />,
    },
    {
      path: 'datos/mod-2',
      element: <Datos />,
    },
    {
      path: 'datos/mod-3',
      element: <Datos />,
    },
    {
      path: 'datos/mod-4',
      element: <Datos />,
    },
    {
      path: 'datos/mod-5',
      element: <Datos />,
    },
    {
      path: 'datos/mod-6',
      element: <Datos />,
    },
    {
      path: 'datos/mod-7',
      element: <Datos />,
    },
    {
      path: 'datos/mod-8',
      element: <Datos />,
    },
  ],
};

export default DatosConfig;