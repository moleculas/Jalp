import FuseNavigation from '@fuse/core/FuseNavigation';

const navigationData = [
    {
        id: '1',
        title: '1150x135x21',
        subtitle: 'Patín',
        type: 'item',
        icon: 'material-outline:layers',
        url: '/produccion/produccion-3/mod-1'
    },
    {
        id: '2',
        title: '1150x78x21',
        subtitle: 'Patín',
        type: 'item',
        icon: 'material-outline:layers',
        url: '/produccion/produccion-3/mod-2'
    }
];

function SidebarProduccion3() {
    return (
        <div className="py-36">
            <div className="pl-36 pb-24 text-2xl font-extrabold tracking-tight leading-tight">Modelos</div>
            <FuseNavigation
                navigation={navigationData}
                className="pl-10 pr-8"
            />
        </div>
    );
}

export default SidebarProduccion3;