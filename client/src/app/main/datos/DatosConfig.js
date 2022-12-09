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
  ],
};

export default DatosConfig;