import { styled } from '@mui/material/styles';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { useState } from 'react';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import Produccion1Mod1 from './Produccion1Mod1';
import Produccion1Mod2 from './Produccion1Mod2';
import Produccion1Mod3 from './Produccion1Mod3';
import SidebarProduccion1 from './SidebarProduccion1';
import history from '@history';

const Root = styled(FusePageSimple)(({ theme }) => ({
    '& .FusePageSimple-sidebarContent': {
        backgroundColor: theme.palette.background.default,
        overflowX: "hidden"
    },
}));

function Produccion1() {
    const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
    const [leftSidebarOpen, setLeftSidebarOpen] = useState(!isMobile);
    const ruta = history.location.pathname;

    return (
        <Root
            content={
                ruta.includes("mod-1") ? (
                    <Produccion1Mod1
                        leftSidebarToggle={(ev) => {
                            setLeftSidebarOpen(!leftSidebarOpen);
                        }}
                    />) :
                    ruta.includes("mod-2") ? (
                        <Produccion1Mod2
                            leftSidebarToggle={(ev) => {
                                setLeftSidebarOpen(!leftSidebarOpen);
                            }}
                        />) :
                        ruta.includes("mod-3") && (
                            <Produccion1Mod3
                                leftSidebarToggle={(ev) => {
                                    setLeftSidebarOpen(!leftSidebarOpen);
                                }}
                            />)
            }
            leftSidebarOpen={leftSidebarOpen}
            leftSidebarOnClose={() => {
                setLeftSidebarOpen(false);
            }}
            leftSidebarContent={<SidebarProduccion1 />}
            leftSidebarWidth={200}
            scroll={isMobile ? 'normal' : 'content'}
        />
    );
}

export default Produccion1;
