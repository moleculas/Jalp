import FuseNavigation from '@fuse/core/FuseNavigation';

const navigationData = [
    {
        id: '1',
        title: '135x72',
        subtitle: 'Taco',
        type: 'item',
        icon: 'material-outline:layers',
        url: '/produccion/produccion-2/mod-1'
    },
    {
        id: '2',
        title: '103x72',
        subtitle: 'Taco',
        type: 'item',
        icon: 'material-outline:layers',
        url: '/produccion/produccion-2/mod-2'
    },
    {
        id: '3',
        title: '103x94',
        subtitle: 'Taco',
        type: 'item',
        icon: 'material-outline:layers',
        url: '/produccion/produccion-2/mod-3'
    }
];

function SidebarProduccion2() {
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

export default SidebarProduccion2;