import i18next from 'i18next';
import es from './navigation-i18n/es';
import { authRoles } from '../auth/authRoles';

i18next.addResourceBundle('es', 'navigation', es);

const navigationConfig = [
  {
    id: 'dashboards',
    title: 'Inicio',
    subtitle: 'Datos Inicio Aplicación',
    type: 'group',
    icon: 'heroicons-outline:home',
    translate: 'DASHBOARDS',
    children: [
      {
        id: 'dashboards.project',
        title: 'Inicio',
        type: 'item',
        icon: 'heroicons-outline:home',
        url: '/dashboards/project',
      },
      {
        id: 'produccion',
        title: 'Producción',
        type: 'item',
        icon: 'material-outline:query_stats',
        url: '/produccion',
      },      
      {
        id: 'pedidos',
        title: 'Pedidos',
        type: 'item',
        icon: 'material-outline:launch',
        url: '/pedidos',
      },
      {
        id: 'escandallo',
        title: 'Cálculos',
        type: 'item',
        icon: 'material-outline:dashboard_customize',
        url: '/calculos',
      },
    ],
  },
  {
    id: 'apps',
    title: 'Aplicaciones',
    subtitle: 'Módulos de gestión',
    type: 'group',
    icon: 'heroicons-outline:home',
    translate: 'APPLICATIONS',
    children: [
      {
        id: 'apps.calendar',
        title: 'Calendario',
        subtitle: '',
        type: 'item',
        icon: 'heroicons-outline:calendar',
        url: '/apps/calendar',
        translate: 'CALENDAR',
      },
      {
        id: 'apps.tasks',
        title: 'Tareas',
        subtitle: '',
        type: 'item',
        icon: 'heroicons-outline:check-circle',
        url: '/apps/tasks',
        translate: 'TASKS',
      },
      {
        id: 'apps.notes',
        title: 'Notas',
        type: 'item',
        icon: 'heroicons-outline:pencil-alt',
        url: '/apps/notes',
        translate: 'NOTES',
      },
      {
        id: 'apps.chat',
        title: 'Chat',
        type: 'item',
        icon: 'heroicons-outline:chat-alt',
        url: '/apps/chat',
        translate: 'CHAT',
      },
      {
        id: 'apps.file-manager',
        title: 'Gestor de archivos',
        type: 'item',
        icon: 'heroicons-outline:cloud',
        url: '/apps/file-manager',
        end: true,
        translate: 'FILE_MANAGER',
      },
      {
        id: 'pages.activities',
        title: 'Actividad',
        type: 'item',
        icon: 'heroicons-outline:menu-alt-2',
        url: '/pages/activities',
      },
    ],
  },
  {
    type: 'divider',
    id: 'divider-2',
    auth: authRoles.admin,//['admin']
  },
  {
    id: 'area-usuario-administrador',
    auth: authRoles.admin,//['admin']
    title: 'Usuario administrador',
    subtitle: 'Área de gestión usuario administrador',
    type: 'group',
    icon: 'heroicons-outline:menu',
    children: [
      {
        id: 'area-usuario-administrador-gestion-usuarios',
        auth: authRoles.admin,//['admin']
        title: 'Gestión usuarios',
        type: 'item',
        icon: 'heroicons-outline:users',
        url: '/gestion-usuarios',
      }
    ],
  },
];

export default navigationConfig;
