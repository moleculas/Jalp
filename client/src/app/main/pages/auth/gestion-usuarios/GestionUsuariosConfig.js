import { lazy } from 'react';
import { authRoles } from 'app/auth/authRoles';

const GestionUsuariosPage = lazy(() => import('./GestionUsuariosPage'));

const GestionUsuariosConfig = {
    settings: {
        layout: {
            config: {},
        },
    },
    auth: authRoles.admin,
    routes: [
        {
            path: 'gestion-usuarios',
            element: <GestionUsuariosPage />,
        },
    ],
};

export default GestionUsuariosConfig;