import { lazy } from 'react';
const Cotizacion = lazy(() => import('./Cotizacion'));

const CotizacionConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'cotizacion',
      element: <Cotizacion />,          
    },    
  ],
};

export default CotizacionConfig;