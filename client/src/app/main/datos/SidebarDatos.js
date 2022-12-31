import FuseNavigation from '@fuse/core/FuseNavigation';

const navigationData = [
    {
        id: 'panel-datos-1',
        title: 'Clientes',
        type: 'item',
        url: '/datos/mod-1',
        icon: 'material-outline:checklist',
    },
    {
        id: 'panel-datos-4',
        title: 'Proveedores',
        type: 'item',
        url: '/datos/mod-6',
        icon: 'material-outline:checklist',
    },
    {
        id: 'panel-datos-2',
        title: 'Productos',
        type: 'collapse',
        icon: 'material-outline:checklist',
        children: [
            {
                id: 'panel-datos-2.1',
                title: 'Clavos',
                subtitle: '',
                type: 'item',
                url: '/datos/mod-2',
            },
            {
                id: 'panel-datos-2.2',
                title: 'Maderas',
                subtitle: '',
                type: 'item',
                url: '/datos/mod-3',
            },
        ]
    },
    {
        id: 'panel-datos-3',
        title: 'Costes',
        type: 'collapse',
        icon: 'material-outline:checklist',
        children: [
            {
                id: 'panel-datos-3.1',
                title: 'Horas operario',
                subtitle: '',
                type: 'item',
                url: '/datos/mod-4',
            },
            {
                id: 'panel-datos-3.2',
                title: 'Procesos',
                subtitle: '',
                type: 'item',
                url: '/datos/mod-5',
            },
            {
                id: 'panel-datos-3.3',
                title: 'Transporte',
                subtitle: '',
                type: 'item',
                url: '/datos/mod-7',
            },
        ]
    },
];

function SidebarDatos() {
    return (
        <div className="py-36 w-[200px] min-w-[200px]">
            <div className="pl-36 pb-24 text-2xl font-extrabold tracking-tight leading-tight">Datos JALP</div>
            <FuseNavigation
                navigation={navigationData}
                className="pl-10 pr-8"
            />
        </div>
    );
}

export default SidebarDatos;