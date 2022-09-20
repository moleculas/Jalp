import { styled } from '@mui/material/styles';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { useState } from 'react';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import Produccion2Mod1 from './Produccion2Mod1';
import Produccion2Mod2 from './Produccion2Mod2';
import Produccion2Mod3 from './Produccion2Mod3';
import SidebarProduccion2 from './SidebarProduccion2';
import history from '@history';

const Root = styled(FusePageSimple)(({ theme }) => ({
    '& .FusePageSimple-sidebarContent': {
        backgroundColor: theme.palette.background.default,
    },
}));

function Produccion2() {
    const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
    const [leftSidebarOpen, setLeftSidebarOpen] = useState(!isMobile);
    const ruta = history.location.pathname;

    return (
        <Root
            content={
                ruta.includes("mod-1") ? (
                    <Produccion2Mod1
                        leftSidebarToggle={(ev) => {
                            setLeftSidebarOpen(!leftSidebarOpen);
                        }}
                    />) :
                    ruta.includes("mod-2") ? (
                        <Produccion2Mod2
                            leftSidebarToggle={(ev) => {
                                setLeftSidebarOpen(!leftSidebarOpen);
                            }}
                        />) :
                        ruta.includes("mod-3") && (
                            <Produccion2Mod3
                                leftSidebarToggle={(ev) => {
                                    setLeftSidebarOpen(!leftSidebarOpen);
                                }}
                            />)
            }
            leftSidebarOpen={leftSidebarOpen}
            leftSidebarOnClose={() => {
                setLeftSidebarOpen(false);
            }}
            leftSidebarContent={<SidebarProduccion2 />}
            leftSidebarWidth={200}
            scroll={isMobile ? 'normal' : 'content'}
        />
    );
}

export default Produccion2;
