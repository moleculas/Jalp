import { lazy } from 'react';
const Escandallo = lazy(() => import('./Escandallo'));

const EscandalloConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'escandallo',
      element: <Escandallo />,          
    },    
  ],
};

export default EscandalloConfig;