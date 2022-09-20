import { styled } from '@mui/material/styles';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { useState } from 'react';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import Produccion3Mod1 from './Produccion3Mod1';
import Produccion3Mod2 from './Produccion3Mod2';
import SidebarProduccion3 from './SidebarProduccion3';
import history from '@history';

const Root = styled(FusePageSimple)(({ theme }) => ({
    '& .FusePageSimple-sidebarContent': {
        backgroundColor: theme.palette.background.default,
    },
}));

function Produccion3() {
    const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
    const [leftSidebarOpen, setLeftSidebarOpen] = useState(!isMobile);
    const ruta = history.location.pathname;

    return (
        <Root
            content={
                ruta.includes("mod-1") ? (
                    <Produccion3Mod1
                        leftSidebarToggle={(ev) => {
                            setLeftSidebarOpen(!leftSidebarOpen);
                        }}
                    />) :
                    ruta.includes("mod-2") && (
                        <Produccion3Mod2
                            leftSidebarToggle={(ev) => {
                                setLeftSidebarOpen(!leftSidebarOpen);
                            }}
                        />)
            }
            leftSidebarOpen={leftSidebarOpen}
            leftSidebarOnClose={() => {
                setLeftSidebarOpen(false);
            }}
            leftSidebarContent={<SidebarProduccion3 />}
            leftSidebarWidth={200}
            scroll={isMobile ? 'normal' : 'content'}
        />
    );
}

export default Produccion3;
