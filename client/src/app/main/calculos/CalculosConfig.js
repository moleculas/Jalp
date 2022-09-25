import { lazy } from 'react';
import Calculos1 from './tabs/calculos-1/Calculos1';
import Calculos2 from './tabs/calculos-2/Calculos2';

const Calculos = lazy(() => import('./Calculos'));

const CalculosConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'calculos',
      element: <Calculos />,    
      children: [
        {
          path: 'calculos-1',
          element: <Calculos1 />,
        },
        {
          path: 'calculos-2',
          element: <Calculos2 />,
        },
      ] 
    },    
  ],
};

export default CalculosConfig;