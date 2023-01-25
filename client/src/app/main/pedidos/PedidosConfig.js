import { lazy } from 'react';

const Pedidos = lazy(() => import('./Pedidos'));

const PedidosConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'pedidos',
      element: <Pedidos />,
    }
  ],
};

export default PedidosConfig;