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
    selectObjetoCotizacionActualizado,
    addCotizacion,
    deleteCotizacion,
    updateCotizacion,
    setOpenFormCotizacion,
    vaciarDatosGeneral
} from 'app/redux/produccion/cotizacionSlice';
import { StyledMenu } from 'app/logica/produccion/logicaProduccion';

function CotizacionContent() {
    const dispatch = useDispatch();
    const cotizacionCabecera = useSelector(selectObjetoCotizacionCabecera);
    const cotizacionCuerpo = useSelector(selectObjetoCotizacionCuerpo);
    const cotizacionLateralSup = useSelector(selectObjetoCotizacionLateralSup);
    const cotizacionLateralInf = useSelector(selectObjetoCotizacionLateralInf);
    const cotizacionActualizado = useSelector(selectObjetoCotizacionActualizado);
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
        vaciarDatos(false);
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
        if (cotizacionActualizado) {
            setDisabledBorrar(false);
            setDisabledNuevo(false);
            setDisabledGuardar(false);
        } else {
            setDisabledBorrar(true);
            setDisabledGuardar(true);
            setDisabledNuevo(true);
        };
    }, [cotizacionActualizado]);

    //funciones

    const vaciarDatos = (actualizacion) => {
        setActivoView(false);
        const clearData = async () => {
            await dispatch(vaciarDatosGeneral(actualizacion));
        };
        clearData().then(() => {
            setActivoView(true);
        });
    };

    const addCotizacionBtn = () => {
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
        objetoCotizacion.sumPrecioMerma = cotizacionCuerpo.sumPrecioMerma;
        objetoCotizacion.sumVolumenMerma = cotizacionCuerpo.sumVolumenMerma;
        //cotizacionLateralSup    
        objetoCotizacion.filasExtra = cotizacionLateralSup.filasExtra;
        objetoCotizacion.sumLateralSup = cotizacionLateralSup.sumLateralSup;
        //cotizacionLateralInf       
        objetoCotizacion.cu = cotizacionLateralInf.cu;
        objetoCotizacion.precio_venta = cotizacionLateralInf.precio_venta;
        objetoCotizacion.mc = cotizacionLateralInf.mc;
        objetoCotizacion.mc_porcentaje = cotizacionLateralInf.mc_porcentaje;
        objetoCotizacion.porcentaje = cotizacionLateralInf.porcentaje;
        objetoCotizacion.jalp = cotizacionLateralInf.jalp;
        objetoCotizacion.total = cotizacionLateralInf.total;
        objetoCotizacion.precio_venta_total = cotizacionLateralInf.precio_venta_total;
        dispatch(addCotizacion(objetoCotizacion)).then(() => {
            vaciarDatos(true);
        });
    };

    const actualizarCotizacionBtn = () => {
        handleCloseMenu();
        let objetoCotizacion = {};
        //cotizacionCabecera
        objetoCotizacion.descripcion = cotizacionCabecera ? cotizacionCabecera.descripcion : cotizacionActualizado.descripcion;
        objetoCotizacion.fecha = cotizacionCabecera ? cotizacionCabecera.fecha : cotizacionActualizado.fecha;
        objetoCotizacion.cliente = cotizacionCabecera ? cotizacionCabecera.cliente : cotizacionActualizado.cliente;
        objetoCotizacion.of = cotizacionCabecera ? cotizacionCabecera.of : cotizacionActualizado.of;
        objetoCotizacion.unidades = cotizacionCabecera ? cotizacionCabecera.unidades : cotizacionActualizado.unidades;
        //cotizacionCuerpo
        objetoCotizacion.filasCuerpo = cotizacionCuerpo ? cotizacionCuerpo.filasCuerpo : cotizacionActualizado.filasCuerpo;
        objetoCotizacion.sumCuerpo = cotizacionCuerpo ? cotizacionCuerpo.sumCuerpo : cotizacionActualizado.sumCuerpo;    
        objetoCotizacion.sumVolumen = cotizacionCuerpo ? cotizacionCuerpo.sumVolumen : cotizacionActualizado.sumVolumen;
        objetoCotizacion.sumPrecioMerma = cotizacionCuerpo ? cotizacionCuerpo.sumPrecioMerma : cotizacionActualizado.sumPrecioMerma;
        objetoCotizacion.sumVolumenMerma = cotizacionCuerpo ? cotizacionCuerpo.sumVolumenMerma : cotizacionActualizado.sumVolumenMerma;
        //cotizacionLateralSup    
        objetoCotizacion.filasExtra = cotizacionLateralSup ? cotizacionLateralSup.filasExtra : cotizacionActualizado.filasExtra;
        objetoCotizacion.sumLateralSup = cotizacionLateralSup ? cotizacionLateralSup.sumLateralSup : cotizacionActualizado.sumLateralSup;
        //cotizacionLateralInf       
        objetoCotizacion.cu = cotizacionLateralInf ? cotizacionLateralInf.cu : cotizacionActualizado.cu;
        objetoCotizacion.precio_venta = cotizacionLateralInf ? cotizacionLateralInf.precio_venta : cotizacionActualizado.precio_venta;
        objetoCotizacion.mc = cotizacionLateralInf ? cotizacionLateralInf.mc : cotizacionActualizado.mc;
        objetoCotizacion.mc_porcentaje = cotizacionLateralInf ? cotizacionLateralInf.mc_porcentaje : cotizacionActualizado.mc_porcentaje;
        objetoCotizacion.porcentaje = cotizacionLateralInf ? cotizacionLateralInf.porcentaje : cotizacionActualizado.porcentaje;
        objetoCotizacion.jalp = cotizacionLateralInf ? cotizacionLateralInf.jalp : cotizacionActualizado.jalp;
        objetoCotizacion.total = cotizacionLateralInf ? cotizacionLateralInf.total : cotizacionActualizado.total;
        objetoCotizacion.precio_venta_total = cotizacionLateralInf ? cotizacionLateralInf.precio_venta_total : cotizacionActualizado.precio_venta_total;
        const datosActualizar = { objeto: objetoCotizacion, id: cotizacionActualizado._id };
        dispatch(updateCotizacion(datosActualizar)).then(() => {
            vaciarDatos(true);
        });
    };

    const deleteCotizacionBtn = () => {
        handleCloseMenu();
        dispatch(deleteCotizacion(cotizacionActualizado._id)).then(() => {
            vaciarDatos(false);
        });
    };

    const handleClickMenu = (event) => {
        setAnchorElMenu(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorElMenu(null);
    };

    const cerrarMenuRegistro = () => {
        handleCloseMenu();
        setTimeout(() => {
            dispatch(setOpenFormCotizacion(true));
        }, 200);
    };

    if (!activoView) {
        return null
    };

    return (
        <>
            <motion.div
                className="grid grid-cols-1 md:grid-cols-1 gap-24 p-24 w-full"
                variants={container}
                initial="hidden"
                animate="show"
            >
                <div className="flex flex-wrap w-full p-12">
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
                                    onClick={cotizacionActualizado ? actualizarCotizacionBtn : addCotizacionBtn}
                                    disableRipple
                                >
                                    <FuseSvgIcon size={20}>material-outline:save</FuseSvgIcon>
                                    {cotizacionActualizado ? 'Actualizar' : 'Guardar'}
                                </MenuItem>
                                <MenuItem
                                    disabled={disabledNuevo}
                                    onClick={() => { handleCloseMenu(); vaciarDatos(false) }}
                                    disableRipple
                                >
                                    <FuseSvgIcon size={20}>heroicons-outline:plus</FuseSvgIcon>
                                    Nuevo
                                </MenuItem>
                                <MenuItem
                                    disabled={disabledGuardar}
                                    onClick={handleCloseMenu}
                                    disableRipple
                                >
                                    <FuseSvgIcon size={20}>heroicons-outline:printer</FuseSvgIcon>
                                    Imprimir
                                </MenuItem>
                                <MenuItem
                                    disabled={disabledBorrar}
                                    onClick={deleteCotizacionBtn}
                                    disableRipple
                                >
                                    <FuseSvgIcon className="text-red-400" size={20}>heroicons-outline:trash</FuseSvgIcon>
                                    <span className="text-red-400">Eliminar</span>
                                </MenuItem>
                                <Divider sx={{ my: 0.5 }} />
                                <MenuItem
                                    onClick={cerrarMenuRegistro}
                                    disableRipple
                                >
                                    <FuseSvgIcon size={20}>material-outline:folder</FuseSvgIcon>
                                    Registro
                                </MenuItem>
                            </StyledMenu>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 md:gap-24 w-full">
                        <div className="w-full col-span-3">
                            <motion.div variants={item1} className="w-full flex flex-col">
                                <CabeceraCotizacion
                                    cotizacionCabecera={cotizacionCabecera}
                                />
                                <CuerpoCotizacion
                                    cotizacionCuerpo={cotizacionCuerpo}
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