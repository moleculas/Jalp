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
import PanelProduccion1 from '../../panel/PanelProduccion1';
import GraficoProduccion1 from '../../grafico/GraficoProduccion1';
import PanelInicialProduccion1 from '../../panel/PanelInicialProduccion1';

//importacion acciones
import {
    selectSemanasAnyo,
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
import { selectMesActual } from 'app/redux/produccion/inicioSlice';
import {
    calculoSemanasAnyo,
    calculoSemanasPeriodo,
    decMesActual
} from 'app/logica/produccion/logicaProduccion';
import {
    selectObjetivos,
    getObjetivos
} from 'app/redux/produccion/objetivosSlice';

function Produccion1Mod3(props) {
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
    const producto = { producto: "1003x98x21", familia: "palet", unidades: 4, posicion: 3, serie: ["1070x90x21", "1140x90x21", "1003x98x21"] };

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
            const { mes, anyo } = dispatch(decMesActual());
            const periodo = semanasCorrespondientesPeriodo.map(({ numeroSemana, mes }) => ({
                producto: producto.producto,
                familia: producto.familia,
                semana: numeroSemana,
                mes,
                anyo
            }));
            dispatch(getProduccion({ periodo, mes, anyo, producto: producto.producto, serie: producto.serie }));
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
                                />
                            </motion.div>
                            <motion.div variants={item2}>
                                <PanelInicialProduccion1
                                    mesActual={mesActual}
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
                                    { nombre: 'Arias', tipo: 'input' },
                                    { nombre: 'Masova', tipo: 'input' },
                                    { nombre: 'Faucher', tipo: 'input' },
                                    { nombre: 'Losan', tipo: 'input' },
                                    { nombre: 'MP U.F', tipo: 'texto' },
                                    { nombre: 'Palets', tipo: 'input' },//primero input
                                    { nombre: 'Saldo', tipo: 'texto' },
                                ]}
                                semanas={semanasCorrespondientesPeriodo}
                                mesActual={mesActual}
                                datosTabla={datosProduccionTabla}
                                datosPalet={datosProduccionPalet}
                                producto={producto}
                            />
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        )
    );
}

export default Produccion1Mod3;
