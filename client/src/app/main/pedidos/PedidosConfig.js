import { lazy } from 'react';
import Pedidos1 from './tabs/pedidos-1/Pedidos1';
import Pedidos2 from './tabs/pedidos-2/Pedidos2';
import Pedidos3 from './tabs/pedidos-3/Pedidos3';

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
      children: [
        {
          path: 'pedidos-1',
          element: <Pedidos1 />,
        },
        {
          path: 'pedidos-2',
          element: <Pedidos2 />,
        },
        {
          path: 'pedidos-3',
          element: <Pedidos3 />,
        },       
      ]
    }
  ],
};

export default PedidosConfig;