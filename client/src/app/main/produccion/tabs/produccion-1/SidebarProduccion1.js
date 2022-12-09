import FuseNavigation from '@fuse/core/FuseNavigation';

const navigationData = [
    {
        id: '1',
        title: '1070x90x21',
        subtitle: 'Palet',
        type: 'item',
        icon: 'material-outline:layers',
        url: '/produccion/produccion-1/mod-1'
    },
    {
        id: '2',
        title: '1140x90x21',
        subtitle: 'Palet',
        type: 'item',
        icon: 'material-outline:layers',
        url: '/produccion/produccion-1/mod-2'
    },
    {
        id: '3',
        title: '1003x98x21',
        subtitle: 'Palet',
        type: 'item',
        icon: 'material-outline:layers',
        url: '/produccion/produccion-1/mod-3'
    }
];

function SidebarProduccion1() {
    return (
        <div className="py-36 w-[200px] min-w-[200px]">
            <div className="pl-36 pb-24 text-2xl font-extrabold tracking-tight leading-tight">Modelos</div>
            <FuseNavigation
                navigation={navigationData}
                className="pl-10 pr-8"
            />
        </div>
    );
}

export default SidebarProduccion1;