import FuseUtils from '@fuse/utils';
import FuseLoading from '@fuse/core/FuseLoading';
import { Navigate } from 'react-router-dom';
import settingsConfig from 'app/configs/settingsConfig';
import SignInConfig from '../main/pages/auth/sign-in/SignInConfig';
import SignOutConfig from '../main/pages/auth/sign-out/SignOutConfig';
import dashboardsConfigs from '../main/dashboards/dashboardsConfigs';
import appsConfigs from '../main/apps/appsConfigs';
import pagesConfigs from '../main/pages/pagesConfigs';
//rutas añadidas
import ForgotPasswordConfig from '../main/pages/auth/forgot-password/ForgotPasswordConfig';
import ResetPasswordConfig from '../main/pages/auth/reset-password/ResetPasswordConfig';
import GestionUsuariosConfig from '../main/pages/auth/gestion-usuarios/GestionUsuariosConfig';
import ProduccionConfig from '../main/produccion/ProduccionConfig';
import PedidosConfig from '../main/pedidos/PedidosConfig';
import CotizacionConfig from '../main/cotizacion/CotizacionConfig';
import EscandalloConfig from '../main/escandallo/EscandalloConfig';
import DatosConfig from '../main/datos/DatosConfig';

const routeConfigs = [
  ...appsConfigs,
  ...dashboardsConfigs,
  ...pagesConfigs,
  SignOutConfig,
  SignInConfig,
  ForgotPasswordConfig,
  ResetPasswordConfig,
  GestionUsuariosConfig,
  ProduccionConfig,
  PedidosConfig,
  CotizacionConfig,
  EscandalloConfig,
  DatosConfig
];

const routes = [
  ...FuseUtils.generateRoutesFromConfigs(routeConfigs, settingsConfig.defaultAuth),
  {
    path: '/',
    element: <Navigate to="dashboards/project" />,
    auth: settingsConfig.defaultAuth,
  },
  {
    path: 'loading',
    element: <FuseLoading />,
  },
  {
    path: '*',
    element: <Navigate to="pages/error/404" />,
  },
];

export default routes;
