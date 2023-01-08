import { motion } from 'framer-motion';
import Typography from '@mui/material/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import CabeceraCotizacion from './componentes/CabeceraCotizacion';
import CuerpoCotizacion from './componentes/CuerpoCotizacion';
import LateralSupCotizacion from './componentes/LateralSupCotizacion';
import LateralInfCotizacion from './componentes/LateralInfCotizacion';
import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';

//importacion acciones
import {
    selectObjetoCotizacionCabecera,
    selectObjetoCotizacionCuerpo,
    selectObjetoCotizacionLateralSup,
    selectObjetoCotizacionLateralInf,
    addCotizacion,
    deleteCotizacion,
    updateCotizacion,
    setOpenSidebarCotizacion,
    vaciarDatosGeneral,
    selectActualizandoCotizacion,
} from 'app/redux/produccion/cotizacionSlice';
import { openDialogPdf } from 'app/redux/fuse/pdfSlice';
import { StyledMenu } from 'app/logica/produccion/logicaProduccion';

function CotizacionContent() {
    const dispatch = useDispatch();
    const cotizacionCabecera = useSelector(selectObjetoCotizacionCabecera);
    const cotizacionCuerpo = useSelector(selectObjetoCotizacionCuerpo);
    const cotizacionLateralSup = useSelector(selectObjetoCotizacionLateralSup);
    const cotizacionLateralInf = useSelector(selectObjetoCotizacionLateralInf);
    const actualizandoCotizacion = useSelector(selectActualizandoCotizacion);
    const container = {
        show: {
            transition: {
                staggerChildren: 0.1,
            },
        },
    };
    const item1 = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { delay: 0.3 } },
    };
    const item2 = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { delay: 0.5 } },
    };
    const [disabledGuardar, setDisabledGuardar] = useState(true);
    const [disabledBorrar, setDisabledBorrar] = useState(true);
    const [disabledNuevo, setDisabledNuevo] = useState(true);
    const [activoView, setActivoView] = useState(false);
    const [anchorElMenu, setAnchorElMenu] = useState(null);
    const openMenu = Boolean(anchorElMenu);

    //useEffect  

    useEffect(() => {
        vaciarDatos();
    }, []);

    useEffect(() => {
        if (cotizacionCabecera && cotizacionCuerpo && cotizacionLateralSup && cotizacionLateralInf) {
            let disabled = true;
            if (
                cotizacionCabecera.cliente &&
                cotizacionCabecera.of &&
                cotizacionCabecera.unidades > 0 &&
                cotizacionCuerpo.sumCuerpo > 0
            ) {
                disabled = false;
            };
            setDisabledGuardar(disabled);
        };
    }, [cotizacionCabecera, cotizacionCuerpo, cotizacionLateralSup, cotizacionLateralInf]);

    useEffect(() => {
        if (actualizandoCotizacion.objeto) {
            setDisabledBorrar(false);
            setDisabledNuevo(false);
            setDisabledGuardar(false);
        } else {
            setDisabledBorrar(true);
            setDisabledGuardar(true);
            setDisabledNuevo(true);
        };
    }, [actualizandoCotizacion]);

    //funciones

    const vaciarDatos = () => {
        setActivoView(false);
        const clearData = async () => {
            await dispatch(vaciarDatosGeneral());
        };
        clearData().then(() => {
            setActivoView(true);
        });
    };

    const addCotizacionBtn = (actualizacion) => {
        handleCloseMenu();
        let objetoCotizacion = {};
        //cotizacionCabecera
        objetoCotizacion.descripcion = cotizacionCabecera.descripcion;
        objetoCotizacion.fecha = cotizacionCabecera.fecha;
        objetoCotizacion.cliente = cotizacionCabecera.cliente;
        objetoCotizacion.of = cotizacionCabecera.of;
        objetoCotizacion.unidades = cotizacionCabecera.unidades;
        //cotizacionCuerpo
        objetoCotizacion.filasCuerpo = cotizacionCuerpo.filasCuerpo;
        objetoCotizacion.sumCuerpo = cotizacionCuerpo.sumCuerpo;
        objetoCotizacion.sumVolumen = cotizacionCuerpo.sumVolumen;
        objetoCotizacion.merma = cotizacionCuerpo.merma;
        //cotizacionLateralSup    
        objetoCotizacion.filasClavos = cotizacionLateralSup.filasClavos;
        objetoCotizacion.sumClavos = cotizacionLateralSup.sumClavos;
        objetoCotizacion.filaCorteMadera = cotizacionLateralSup.filaCorteMadera;
        objetoCotizacion.sumCorteMadera = cotizacionLateralSup.sumCorteMadera;
        objetoCotizacion.filaMontaje = cotizacionLateralSup.filaMontaje;
        objetoCotizacion.sumMontaje = cotizacionLateralSup.sumMontaje;
        objetoCotizacion.filaPatines = cotizacionLateralSup.filaPatines;
        objetoCotizacion.sumPatines = cotizacionLateralSup.sumPatines;
        objetoCotizacion.filaTransporte = cotizacionLateralSup.filaTransporte;
        objetoCotizacion.sumTransporte = cotizacionLateralSup.sumTransporte;
        objetoCotizacion.sumTratamiento = cotizacionLateralSup.sumTratamiento;
        objetoCotizacion.sumLateralSup = cotizacionLateralSup.sumLateralSup;
        objetoCotizacion.filasExtra = cotizacionLateralSup.filasExtra;
        //cotizacionLateralInf       
        objetoCotizacion.cu = cotizacionLateralInf.cu;
        objetoCotizacion.precio_venta = cotizacionLateralInf.precio_venta;
        objetoCotizacion.mc = cotizacionLateralInf.mc;
        objetoCotizacion.mc_porcentaje = cotizacionLateralInf.mc_porcentaje;
        objetoCotizacion.precio = cotizacionLateralInf.precio;      
        if (actualizacion) {
            const datosActualizar = { objeto: objetoCotizacion, id: actualizandoCotizacion.id };
            dispatch(vaciarDatosGeneral());
            dispatch(updateCotizacion(datosActualizar));
        } else {
            dispatch(vaciarDatosGeneral());
            dispatch(addCotizacion(objetoCotizacion));
        };
    };

    const deleteCotizacionBtn = (id) => {
        vaciarDatos();
        handleCloseMenu();
        dispatch(deleteCotizacion(id));
    };

    const handleClickMenu = (event) => {
        setAnchorElMenu(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorElMenu(null);
    };

    const abrirSidebar = (objeto) => {
        handleCloseMenu();
        setTimeout(() => {
            dispatch(setOpenSidebarCotizacion({ estado: true, objeto }));
        }, 200);
    };

    if (!activoView) {
        return null
    };

    return (
        <>
            <motion.div
                className="w-full p-24"
                variants={container}
                initial="hidden"
                animate="show"
            >
                <div className="w-full p-12">
                    <div className="flex flex-col sm:flex-row flex-1 items-center px-12 justify-between mb-24 space-y-16 sm:space-y-0">
                        <div>
                            <Typography className="text-2xl font-extrabold tracking-tight leading-tight">
                                Cotización palets
                            </Typography>
                            <div className="mt-2 font-medium">
                                <Typography>Calculadora para cotización palets.</Typography>
                            </div>
                        </div>
                        <div className="flex items-center -mx-8">
                            <Button
                                id="boton-cotizacion"
                                color="secondary"
                                aria-controls={openMenu ? 'menu-cotizacion' : undefined}
                                aria-haspopup="true"
                                aria-expanded={openMenu ? 'true' : undefined}
                                variant="contained"
                                disableElevation
                                onClick={handleClickMenu}
                                endIcon={<FuseSvgIcon size={20}>{!openMenu ? 'heroicons-outline:chevron-down' : 'heroicons-outline:chevron-up'}</FuseSvgIcon>}
                            >
                                <span className="mx-12">
                                    Gestión cotizaciones
                                </span>
                            </Button>
                            <StyledMenu
                                id="menu-cotizacion"
                                MenuListProps={{
                                    'aria-labelledby': 'boton-cotizacion',
                                }}
                                anchorEl={anchorElMenu}
                                open={openMenu}
                                onClose={handleCloseMenu}
                            >
                                <MenuItem
                                    disabled={disabledGuardar}
                                    onClick={() => actualizandoCotizacion.objeto ? addCotizacionBtn(true) : addCotizacionBtn(false)}
                                    disableRipple
                                >
                                    <FuseSvgIcon size={20}>material-outline:save</FuseSvgIcon>
                                    {actualizandoCotizacion.objeto ? 'Actualizar' : 'Guardar'}
                                </MenuItem>
                                <MenuItem
                                    disabled={disabledNuevo}
                                    onClick={() => { handleCloseMenu(); vaciarDatos() }}
                                    disableRipple
                                >
                                    <FuseSvgIcon size={20}>heroicons-outline:plus</FuseSvgIcon>
                                    Nuevo
                                </MenuItem>
                                <MenuItem
                                    disabled={disabledGuardar}
                                    onClick={() => { handleCloseMenu(); dispatch(openDialogPdf('cotizacion')) }}
                                    disableRipple
                                >
                                    <FuseSvgIcon size={20}>heroicons-outline:printer</FuseSvgIcon>
                                    Imprimir
                                </MenuItem>
                                <MenuItem
                                    disabled={disabledBorrar}
                                    onClick={() => deleteCotizacionBtn(actualizandoCotizacion.id)}
                                    disableRipple
                                >
                                    <FuseSvgIcon className="text-red-400" size={20}>heroicons-outline:trash</FuseSvgIcon>
                                    <span className="text-red-400">Eliminar</span>
                                </MenuItem>
                                <Divider sx={{ my: 0.5 }} />
                                <MenuItem
                                    onClick={() => abrirSidebar("registro")}
                                    disableRipple
                                >
                                    <FuseSvgIcon size={20}>material-outline:folder</FuseSvgIcon>
                                    Registro
                                </MenuItem>
                            </StyledMenu>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 md:gap-24">
                        <div className="w-full col-span-2">
                            <motion.div variants={item1} className="w-full flex flex-col">
                                <CabeceraCotizacion
                                    cotizacionCabecera={cotizacionCabecera}
                                />
                                <CuerpoCotizacion
                                    cotizacionCuerpo={cotizacionCuerpo}
                                    cotizacionCabecera={cotizacionCabecera}
                                />
                            </motion.div>
                        </div>
                        <div className="w-full">
                            <div className="flex flex-col sm:flex-row flex-1 items-start justify-between mb-24">
                                <motion.div variants={item2} className="w-full flex flex-col">
                                    <LateralSupCotizacion
                                        cotizacionLateralSup={cotizacionLateralSup}
                                        cotizacionCabecera={cotizacionCabecera}
                                        cotizacionCuerpo={cotizacionCuerpo}
                                    />
                                    <LateralInfCotizacion
                                        cotizacionLateralInf={cotizacionLateralInf}
                                        cotizacionLateralSup={cotizacionLateralSup}
                                        cotizacionCabecera={cotizacionCabecera}
                                        cotizacionCuerpo={cotizacionCuerpo}
                                    />
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </>
    );
}

export default CotizacionContent;