import { motion } from 'framer-motion';
import Typography from '@mui/material/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import CabeceraCotizacion from './CabeceraCotizacion';
import CuerpoCotizacion from './CuerpoCotizacion';
import LateralSupCotizacion from './LateralSupCotizacion';
import LateralInfCotizacion from './LateralInfCotizacion';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

//importacion acciones
import {
    selectObjetoCotizacionCabecera,
    selectObjetoCotizacionCuerpo,
    selectObjetoCotizacionLateralSup,
    selectObjetoCotizacionLateralInf,
    setObjetoCotizacionCabecera,
    setObjetoCotizacionCuerpo,
    setObjetoCotizacionLateralSup,
    setObjetoCotizacionLateralInf,
    setObjetoCotizacionActualizado,
    selectObjetoCotizacionActualizado,
    addCotizacion,
    deleteCotizacion,
    updateCotizacion
} from 'app/redux/produccion/cotizacionSlice';

function Calculos2() {
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
    const [activoView, setActivoView] = useState(false);

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
        } else {
            setDisabledBorrar(true);
            setDisabledGuardar(true);
        };
    }, [cotizacionActualizado]);

    //funciones

    const vaciarDatos = (actualizacion) => {
        setActivoView(false);
        const clearData = async () => {
            !actualizacion && await dispatch(setObjetoCotizacionActualizado(null));
            await dispatch(setObjetoCotizacionCabecera(null));
            await dispatch(setObjetoCotizacionCuerpo(null));
            await dispatch(setObjetoCotizacionLateralSup(null));
            await dispatch(setObjetoCotizacionLateralInf(null));
        };
        clearData().then(() => {
            setActivoView(true);
        });
    };

    const addCotizacionBtn = () => {
        let objetoCotizacion = {};
        //cotizacionCabecera
        objetoCotizacion.fecha = cotizacionCabecera.fecha;
        objetoCotizacion.cliente = cotizacionCabecera.cliente;
        objetoCotizacion.of = cotizacionCabecera.of;
        objetoCotizacion.unidades = cotizacionCabecera.unidades;
        //cotizacionCuerpo
        objetoCotizacion.filasCuerpo = cotizacionCuerpo.filasCuerpo;
        objetoCotizacion.sumCuerpo = cotizacionCuerpo.sumCuerpo;
        //cotizacionLateralSup    
        objetoCotizacion.clavos = cotizacionLateralSup.clavos;
        objetoCotizacion.corte_madera = cotizacionLateralSup.corte_madera;
        objetoCotizacion.montaje = cotizacionLateralSup.montaje;
        objetoCotizacion.patines = cotizacionLateralSup.patines;
        objetoCotizacion.transporte = cotizacionLateralSup.transporte;
        objetoCotizacion.tratamiento = cotizacionLateralSup.tratamiento;
        objetoCotizacion.desperdicio = cotizacionLateralSup.desperdicio;
        objetoCotizacion.varios = cotizacionLateralSup.varios;
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
        let objetoCotizacion = {};
        //cotizacionCabecera
        objetoCotizacion.fecha = cotizacionCabecera ? cotizacionCabecera.fecha : cotizacionActualizado.fecha;
        objetoCotizacion.cliente = cotizacionCabecera ? cotizacionCabecera.cliente : cotizacionActualizado.cliente;
        objetoCotizacion.of = cotizacionCabecera ? cotizacionCabecera.of : cotizacionActualizado.of;
        objetoCotizacion.unidades = cotizacionCabecera ? cotizacionCabecera.unidades : cotizacionActualizado.unidades;
        //cotizacionCuerpo
        objetoCotizacion.filasCuerpo = cotizacionCuerpo ? cotizacionCuerpo.filasCuerpo : cotizacionActualizado.filasCuerpo;
        objetoCotizacion.sumCuerpo = cotizacionCuerpo ? cotizacionCuerpo.sumCuerpo : cotizacionActualizado.sumCuerpo;
        //cotizacionLateralSup    
        objetoCotizacion.clavos = cotizacionLateralSup ? cotizacionLateralSup.clavos : cotizacionActualizado.clavos;
        objetoCotizacion.corte_madera = cotizacionLateralSup ? cotizacionLateralSup.corte_madera : cotizacionActualizado.corte_madera;
        objetoCotizacion.montaje = cotizacionLateralSup ? cotizacionLateralSup.montaje : cotizacionActualizado.montaje;
        objetoCotizacion.patines = cotizacionLateralSup ? cotizacionLateralSup.patines : cotizacionActualizado.patines;
        objetoCotizacion.transporte = cotizacionLateralSup ? cotizacionLateralSup.transporte : cotizacionActualizado.transporte;
        objetoCotizacion.tratamiento = cotizacionLateralSup ? cotizacionLateralSup.tratamiento : cotizacionActualizado.tratamiento;
        objetoCotizacion.desperdicio = cotizacionLateralSup ? cotizacionLateralSup.desperdicio : cotizacionActualizado.desperdicio;
        objetoCotizacion.varios = cotizacionLateralSup ? cotizacionLateralSup.varios : cotizacionActualizado.varios;
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
        dispatch(deleteCotizacion(cotizacionActualizado._id)).then(() => {
            vaciarDatos(false);
        });
    };

    if (!activoView) {
        return null
    };

    return (
        <>
            <motion.div
                className="grid grid-cols-1 md:grid-cols-1 gap-24 p-24"
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
                            <ButtonGroup disableElevation variant="contained">
                                <Button>
                                    <FuseSvgIcon size={20}>material-outline:folder</FuseSvgIcon>
                                    <span className="mx-8">Registro</span>
                                </Button>
                                <Button
                                    disabled={disabledGuardar}
                                    onClick={cotizacionActualizado ? actualizarCotizacionBtn : addCotizacionBtn}
                                >
                                    <FuseSvgIcon size={20}>material-outline:save</FuseSvgIcon>
                                    <span className="mx-8">
                                        {cotizacionActualizado ? 'Actualizar' : 'Guardar'}
                                    </span>
                                </Button>
                                <Button
                                    color="error"
                                    disabled={disabledBorrar}
                                    onClick={deleteCotizacionBtn}
                                >
                                    <FuseSvgIcon size={20}>heroicons-outline:trash</FuseSvgIcon>
                                    <span className="mx-8">Borrar</span>
                                </Button>
                            </ButtonGroup>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 md:gap-24 w-full">
                        <div className="w-full col-span-2">
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

export default Calculos2;
