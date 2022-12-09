import Typography from '@mui/material/Typography';
import { IconButton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import _ from '@lodash';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { motion } from 'framer-motion';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import PanelProduccion1 from '../../componentes/PanelProduccion1';
import GraficoProduccion1 from '../../grafico/GraficoProduccion1';
import PanelInicialProduccion1 from '../../componentes/PanelInicialProduccion1';

//constantes
import { PRODUCTOS } from 'constantes';

//importacion acciones
import {
    getProduccion,
    selectDatosProduccionInicial,
    selectDatosProduccionTabla,
    selectDatosProduccionPalet,
    selectDatosProduccionSaldo,
    setDatosProduccionTabla,
    setDatosProduccionInicial,
    setDatosProduccionPalet,
    setDatosProduccionSaldo
} from 'app/redux/produccion/produccionSlice';
import { selectMesActual, selectSemanasAnyo } from 'app/redux/produccion/inicioSlice';
import {
    calculoSemanasAnyo,
    calculoSemanasPeriodo,
    decMesActual
} from 'app/logica/produccion/logicaProduccion';
import {
    selectObjetivos,
    getObjetivos
} from 'app/redux/produccion/objetivosSlice';

function Produccion1Mod2(props) {
    const { leftSidebarToggle } = props;
    const dispatch = useDispatch();
    const semanasAnyo = useSelector(selectSemanasAnyo);
    const mesActual = useSelector(selectMesActual);
    const datosProduccionInicial = useSelector(selectDatosProduccionInicial);
    const datosProduccionTabla = useSelector(selectDatosProduccionTabla);
    const datosProduccionPalet = useSelector(selectDatosProduccionPalet);
    const datosProduccionSaldo = useSelector(selectDatosProduccionSaldo);
    const objetivos = useSelector(selectObjetivos);
    const container = {
        show: {
            transition: {
                staggerChildren: 0.01,
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
    const item3 = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { delay: 0.7 } },
    };
    const [semanasCorrespondientesPeriodo, setSemanasCorrespondientesPeriodo] = useState(null);
    const [periodo, setPeriodo] = useState(1);
    const [objetivosProducto, setObjetivosProducto] = useState(null);
    const referencia = 1;
    const producto = {
        producto: PRODUCTOS[referencia].producto,
        familia: PRODUCTOS[referencia].familia,
        unidades: PRODUCTOS[referencia].unidades
    };
    const { mes, anyo } = dispatch(decMesActual());

    //useEffect   

    useEffect(() => {
        dispatch(setDatosProduccionTabla(null));
        dispatch(setDatosProduccionInicial(null));
        dispatch(setDatosProduccionPalet(null));
        dispatch(setDatosProduccionSaldo(null));
    }, []);

    useEffect(() => {
        if (!semanasAnyo) {
            setSemanasCorrespondientesPeriodo(null);
            dispatch(calculoSemanasAnyo());
        };
    }, [semanasAnyo]);

    useEffect(() => {
        if (!semanasCorrespondientesPeriodo) {
            setSemanasCorrespondientesPeriodo(dispatch(calculoSemanasPeriodo(1)));
        } else {
            const periodo = semanasCorrespondientesPeriodo.map(({ numeroSemana, mes }) => ({
                producto: producto.producto,
                familia: producto.familia,
                semana: numeroSemana,
                mes,
                anyo
            }));
            dispatch(getProduccion({ periodo, mes, anyo, producto: producto.producto }));
        };
    }, [semanasCorrespondientesPeriodo]);

    useEffect(() => {
        if (!objetivos) {
            dispatch(getObjetivos());
        } else {
            const arrayObjetivosProducto = objetivos.filter(objetivo => objetivo.producto === producto.producto);
            const objObjetivosProducto = { palets: arrayObjetivosProducto[0].palets, saldo: arrayObjetivosProducto[0].saldo };
            setObjetivosProducto(objObjetivosProducto);
        };
    }, [objetivos]);

    //funciones

    const handleChangeSelect = (e) => {
        setPeriodo(e.target.value);
        setSemanasCorrespondientesPeriodo(dispatch(calculoSemanasPeriodo(e.target.value)));
    };

    if (
        !semanasCorrespondientesPeriodo ||
        !datosProduccionInicial ||
        !datosProduccionTabla ||
        !datosProduccionPalet ||
        !datosProduccionSaldo ||
        !objetivosProducto
    ) {
        return null;
    };

    return (
        (
            semanasCorrespondientesPeriodo &&
            datosProduccionInicial &&
            datosProduccionTabla &&
            datosProduccionPalet &&
            datosProduccionSaldo &&
            objetivosProducto
        ) && (
            <motion.div
                className="p-24 w-full"
                variants={container}
                initial="hidden"
                animate="show"
            >
                <div className="flex flex-wrap w-full p-12">
                    <div className="flex flex-col sm:flex-row flex-1 items-center px-12 justify-between mb-24 space-y-16 sm:space-y-0">
                        <div className="flex items-center w-full">
                            {leftSidebarToggle && (
                                <div className="flex shrink-0 items-center mr-16 -m-12">
                                    <IconButton onClick={leftSidebarToggle}>
                                        <FuseSvgIcon>heroicons-outline:menu</FuseSvgIcon>
                                    </IconButton>
                                </div>
                            )}
                            <div>
                                <Typography className="text-2xl font-extrabold tracking-tight leading-tight">
                                    {`Producción palets ${producto.producto}`}
                                </Typography>
                                <div className="mt-2 font-medium">
                                    <Typography>Datos según producción.</Typography>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-row w-200">
                            <FormControl fullWidth>
                                <InputLabel htmlFor="max-width">Consulta</InputLabel>
                                <Select
                                    label="Consulta"
                                    value={periodo}
                                    onChange={handleChangeSelect}
                                >
                                    <MenuItem value={1}>Mensual</MenuItem>
                                    <MenuItem value={3}>Trimestral</MenuItem>
                                    <MenuItem value={6}>Semestral</MenuItem>
                                    <MenuItem value={12}>Anual</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                    </div>
                    <div className="w-full flex flex-col">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
                            <motion.div variants={item1}>
                                <GraficoProduccion1
                                    datosTabla={datosProduccionTabla}
                                    datosPalet={datosProduccionPalet}
                                    producto={producto}
                                    semanas={semanasCorrespondientesPeriodo}
                                    objetivos={objetivosProducto}
                                    mes={mes}
                                />
                            </motion.div>
                            <motion.div variants={item2}>
                                <PanelInicialProduccion1
                                    mesActualLetra={mesActual.letra}
                                    datosInicial={datosProduccionInicial}
                                    datosSaldo={datosProduccionSaldo}
                                    producto={producto}
                                />
                            </motion.div>
                        </div>
                    </div>
                    <div className="w-full flex flex-col mt-24">
                        <motion.div variants={item3}>
                            <PanelProduccion1
                                columnas={[
                                    { nombre: 'Periodo', tipo: 'texto' },
                                    { nombre: 'Serfocat', tipo: 'input' },
                                    { nombre: 'Masova', tipo: 'input' },
                                    { nombre: 'Milieu', tipo: 'input' },
                                    { nombre: 'Sala', tipo: 'input' },
                                    { nombre: 'MP U.F', tipo: 'texto' },
                                    { nombre: 'Palets', tipo: 'texto' },//primero input
                                    { nombre: 'Saldo', tipo: 'texto' },
                                ]}
                                semanas={semanasCorrespondientesPeriodo}
                                datosTabla={datosProduccionTabla}
                                datosPalet={datosProduccionPalet}
                                producto={producto}
                                mes={mes}
                            />
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        )
    );
}

export default Produccion1Mod2;
