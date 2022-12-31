import { styled } from '@mui/material/styles';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { useState, useEffect } from 'react';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import SidebarDatos from './SidebarDatos';
import history from '@history';
import { useNavigate } from 'react-router-dom';
import DatosMod1 from './datos-1/DatosMod1';
import DatosMod2 from './datos-2/DatosMod2';
import DatosMod3 from './datos-3/DatosMod3';
import DatosMod4 from './datos-4/DatosMod4';
import DatosMod5 from './datos-5/DatosMod5';
import DatosMod6 from './datos-6/DatosMod6';
import DatosMod7 from './datos-7/DatosMod7';
import SidebarHistorico1 from './datos-1/SidebarHistorico1';
import SidebarHistorico2 from './datos-2/SidebarHistorico2';
import SidebarHistorico3 from './datos-3/SidebarHistorico3';
import SidebarHistorico4 from './datos-4/SidebarHistorico4';
import SidebarHistorico5 from './datos-5/SidebarHistorico5';
import SidebarHistorico6 from './datos-6/SidebarHistorico6';
import SidebarHistorico7 from './datos-7/SidebarHistorico7';

const Root = styled(FusePageSimple)(({ theme }) => ({
    '& .FusePageSimple-sidebarContent': {
        backgroundColor: theme.palette.background.default,
    },
}));

function DatosContent() {
    const navigate = useNavigate();
    const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
    const [leftSidebarOpen, setLeftSidebarOpen] = useState(!isMobile);
    const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
    const ruta = history.location.pathname;

    //useEffect

    useEffect(() => {
        ruta === "/datos" && navigate("/datos/mod-1");
    }, [ruta]);

    return (
        <Root
            content={
                <div className="w-full">
                    {ruta.includes("mod-1") && (
                        <DatosMod1
                            leftSidebarToggle={(ev) => {
                                setLeftSidebarOpen(!leftSidebarOpen);
                            }}
                            rightSidebarToggle={(ev) => {
                                setRightSidebarOpen(!rightSidebarOpen);
                            }}
                            rightSidebarOpen={rightSidebarOpen}
                        />
                    )}
                    {ruta.includes("mod-2") && (
                        <DatosMod2
                            leftSidebarToggle={(ev) => {
                                setLeftSidebarOpen(!leftSidebarOpen);
                            }}
                            rightSidebarToggle={(ev) => {
                                setRightSidebarOpen(!rightSidebarOpen);
                            }}
                            rightSidebarOpen={rightSidebarOpen}
                        />
                    )}
                    {ruta.includes("mod-3") && (
                        <DatosMod3
                            leftSidebarToggle={(ev) => {
                                setLeftSidebarOpen(!leftSidebarOpen);
                            }}
                            rightSidebarToggle={(ev) => {
                                setRightSidebarOpen(!rightSidebarOpen);
                            }}
                            rightSidebarOpen={rightSidebarOpen}
                        />
                    )}
                    {ruta.includes("mod-4") && (
                        <DatosMod4
                            leftSidebarToggle={(ev) => {
                                setLeftSidebarOpen(!leftSidebarOpen);
                            }}
                            rightSidebarToggle={(ev) => {
                                setRightSidebarOpen(!rightSidebarOpen);
                            }}
                            rightSidebarOpen={rightSidebarOpen}
                        />
                    )}
                    {ruta.includes("mod-5") && (
                        <DatosMod5
                            leftSidebarToggle={(ev) => {
                                setLeftSidebarOpen(!leftSidebarOpen);
                            }}
                            rightSidebarToggle={(ev) => {
                                setRightSidebarOpen(!rightSidebarOpen);
                            }}
                            rightSidebarOpen={rightSidebarOpen}
                        />
                    )}
                     {ruta.includes("mod-6") && (
                        <DatosMod6
                            leftSidebarToggle={(ev) => {
                                setLeftSidebarOpen(!leftSidebarOpen);
                            }}
                            rightSidebarToggle={(ev) => {
                                setRightSidebarOpen(!rightSidebarOpen);
                            }}
                            rightSidebarOpen={rightSidebarOpen}
                        />
                    )}
                    {ruta.includes("mod-7") && (
                        <DatosMod7
                            leftSidebarToggle={(ev) => {
                                setLeftSidebarOpen(!leftSidebarOpen);
                            }}
                            rightSidebarToggle={(ev) => {
                                setRightSidebarOpen(!rightSidebarOpen);
                            }}
                            rightSidebarOpen={rightSidebarOpen}
                        />
                    )}
                </div>
            }
            leftSidebarOpen={leftSidebarOpen}
            leftSidebarOnClose={() => {
                setLeftSidebarOpen(false);
            }}
            leftSidebarContent={<SidebarDatos />}
            leftSidebarWidth={200}
            rightSidebarOpen={rightSidebarOpen}
            rightSidebarOnClose={() => {
                setRightSidebarOpen(false);
            }}
            rightSidebarContent={
                <>
                    {ruta.includes("mod-1") && (
                        <SidebarHistorico1 />
                    )}
                    {ruta.includes("mod-2") && (
                        <SidebarHistorico2 />
                    )}
                    {ruta.includes("mod-3") && (
                        <SidebarHistorico3 />
                    )}
                    {ruta.includes("mod-4") && (
                        <SidebarHistorico4 />
                    )}
                    {ruta.includes("mod-5") && (
                        <SidebarHistorico5 />
                    )}
                    {ruta.includes("mod-6") && (
                        <SidebarHistorico6 />
                    )}
                    {ruta.includes("mod-7") && (
                        <SidebarHistorico7 />
                    )}
                </>
            }
            rightSidebarWidth={400}
            scroll={isMobile ? 'normal' : 'content'}
        />
    );
}

export default DatosContent;