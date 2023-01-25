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
    setDatosProduccionSaldo,  
    setDatosColumnasVisibilidad,
    selectMesSeleccionadoIniciales,
    setMesSeleccionadoIniciales
} from 'app/redux/produccion/produccionSlice';
import { selectSemanasAnyo } from 'app/redux/produccion/inicioSlice';
import {
    calculoSemanasAnyo,
    calculoSemanasPeriodo,
    decMesActual
} from 'app/logica/produccion/logicaProduccion';
import {
    getProducto,
    getProductosPayload
} from 'app/redux/produccion/productoSlice';
import { selectObjSocket } from 'app/redux/socketSlice';
import { showMessage } from 'app/redux/fuse/messageSlice';

function Produccion1Mod1(props) {
    const { leftSidebarToggle } = props;
    const dispatch = useDispatch();
    const socket = useSelector(selectObjSocket);
    const semanasAnyo = useSelector(selectSemanasAnyo);
    const datosProduccionInicial = useSelector(selectDatosProduccionInicial);
    const datosProduccionTabla = useSelector(selectDatosProduccionTabla);
    const datosProduccionPalet = useSelector(selectDatosProduccionPalet);
    const datosProduccionSaldo = useSelector(selectDatosProduccionSaldo);
    const mesSeleccionadoIniciales = useSelector(selectMesSeleccionadoIniciales);
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
    const [periodoSelect, setPeriodoSelect] = useState(1);
    const [objetivosProducto, setObjetivosProducto] = useState(null);
    const referencia = 0;
    const producto = {
        producto: PRODUCTOS[referencia].producto,
        familia: PRODUCTOS[referencia].familia,
        unidades: PRODUCTOS[referencia].unidades
    };
    const { mes, anyo } = dispatch(decMesActual());
    const [datosColumnasConfig, setDatosColumnasConfig] = useState(null);
    const [medidas, setMedidas] = useState(null);
    const [datosAgrupadosMeses, setDatosAgrupadosMeses] = useState(null);
    const [datosVisibilidad, setDatosVisibilidad] = useState(null);

    //useEffect   

    useEffect(() => {
        vaciarDatos().then(({ payload }) => {
            if (payload) {
                iniciarPantalla();
            };
        });
    }, []);

    useEffect(() => {
        //comunicación socket
        const receiveComunicacion = (comunicacion) => {
            if ((socket.id.slice(8) !== comunicacion.from) && (
                (
                    comunicacion.body.tabla === "updateProduccionTabla" &&
                    comunicacion.body.item === "palets"
                ) ||
                (
                    comunicacion.body.tabla === "updateProduccionTabla" &&
                    comunicacion.body.item !== "palets" &&
                    comunicacion.body.pantalla === producto.producto
                ) ||
                (
                    comunicacion.body.tabla === "updateProduccionInicial" &&
                    comunicacion.body.item === "saldoInicial"
                ) ||
                (
                    comunicacion.body.tabla === "updateProduccionInicial" &&
                    comunicacion.body.item === "stockInicial" &&
                    comunicacion.body.pantalla === producto.producto
                )
            )) {
                vaciarDatos().then(({ payload }) => {
                    if (payload) {
                        iniciarPantalla();
                        dispatch(showMessage({ message: "Datos actualizados con éxito.", variant: "success" }));
                    };
                });
            };
        };
        socket.on("comunicacion", receiveComunicacion);
        return () => {
            socket.off("comunicacion", receiveComunicacion);
        };
    }, []);

    useEffect(() => {
        if (!semanasAnyo) {           
            dispatch(setMesSeleccionadoIniciales(mes));
            setDatosAgrupadosMeses(null);
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
        if (
            datosProduccionInicial &&
            datosProduccionTabla &&
            datosProduccionPalet &&
            datosProduccionSaldo &&
            semanasCorrespondientesPeriodo
        ) {
            const groupInicial = datosProduccionInicial.reduce((acc, curr) => {
                (acc[curr.mes] = acc[curr.mes] || []).push(curr);
                return acc;
            }, {});
            const groupTabla = datosProduccionTabla.reduce((acc, curr) => {
                (acc[curr.mes] = acc[curr.mes] || []).push(curr);
                return acc;
            }, {});
            const groupPalet = datosProduccionPalet.reduce((acc, curr) => {
                (acc[curr.mes] = acc[curr.mes] || []).push(curr);
                return acc;
            }, {});
            const groupSaldo = datosProduccionSaldo.reduce((acc, curr) => {
                (acc[curr.mes] = acc[curr.mes] || []).push(curr);
                return acc;
            }, {});
            const groupSemanas = semanasCorrespondientesPeriodo.reduce((acc, curr) => {
                (acc[curr.mes] = acc[curr.mes] || []).push(curr);
                return acc;
            }, {});
            setDatosAgrupadosMeses({
                inicial: groupInicial,
                tabla: groupTabla,
                palet: groupPalet,
                saldo: groupSaldo,
                semanas: groupSemanas
            });
        };
    }, [datosProduccionInicial, datosProduccionTabla, datosProduccionPalet, datosProduccionSaldo]);

    //funciones

    const vaciarDatos = () => {
        return new Promise((resolve, reject) => {
            dispatch(setDatosProduccionTabla(null));
            dispatch(setDatosProduccionInicial(null));
            dispatch(setDatosProduccionPalet(null));
            dispatch(setDatosProduccionSaldo(null));
            dispatch(setDatosColumnasVisibilidad(null));
            setSemanasCorrespondientesPeriodo(null);
            dispatch(setMesSeleccionadoIniciales(null));
            resolve({ payload: true });
            reject(new Error('Algo salió mal'));
        });
    };

    const iniciarPantalla = () => {   
        dispatch(setMesSeleccionadoIniciales(mes));
        dispatch(getProductosPayload({ familia: 'objetivos', min: true })).then(({ payload }) => {
            const arrayObjetivosProducto = payload.filter(objetivo => objetivo.descripcion === producto.producto);
            const objObjetivosProducto = { palets: arrayObjetivosProducto[0].especialObjetivos.palets, saldo: arrayObjetivosProducto[0].especialObjetivos.saldo };
            setObjetivosProducto(objObjetivosProducto);
            dispatch(getProducto({ id: null, nombre: producto.producto, familia: "maderas" })).then(({ payload }) => {
                setMedidas({ largo: payload.largo, ancho: payload.ancho, grueso: payload.grueso });
                const proveedoresIds = payload.proveedor;
                dispatch(getProductosPayload({ familia: 'proveedores', min: true })).then(({ payload }) => {
                    const proveedores = payload.filter(proveedor => proveedoresIds.includes(proveedor._id));
                    const arrColumnas = [
                        { nombre: 'Periodo', tipo: 'texto' },
                        { nombre: 'MP U.F', tipo: 'texto' },
                        { nombre: 'Palets', tipo: 'input' },//primero input
                        { nombre: 'Saldo', tipo: 'texto' }
                    ];
                    const arrDatosVisibilidadColumnas = [];
                    proveedores.map((proveedor, index) => {
                        const objProveedor = {
                            _id: proveedor._id,
                            nombre: proveedor.codigo,
                            tipo: 'input'
                        };
                        arrDatosVisibilidadColumnas.push({ proveedor: proveedor._id, visible: true })
                        arrColumnas.splice(index + 1, 0, objProveedor);
                    });
                    setDatosVisibilidad(arrDatosVisibilidadColumnas);     
                    setDatosColumnasConfig(arrColumnas);
                });
            });
        });
    };

    const handleChangeSelect = (e) => {
        setPeriodoSelect(e.target.value);
        setSemanasCorrespondientesPeriodo(dispatch(calculoSemanasPeriodo(e.target.value)));
    };

    if (
        !datosAgrupadosMeses &&
        !objetivosProducto &&
        !datosColumnasConfig &&
        !datosVisibilidad
    ) {
        return null;
    };

    return (
        (
            datosAgrupadosMeses &&
            objetivosProducto &&
            datosColumnasConfig &&
            datosVisibilidad
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
                                    value={periodoSelect}
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
                                    datosTabla={datosAgrupadosMeses.tabla[mesSeleccionadoIniciales]}
                                    datosPalet={datosAgrupadosMeses.palet[mesSeleccionadoIniciales]}
                                    producto={producto}
                                    semanas={datosAgrupadosMeses.semanas[mesSeleccionadoIniciales]}
                                    objetivos={objetivosProducto}
                                    mes={mesSeleccionadoIniciales}
                                    anyo={anyo}
                                />
                            </motion.div>
                            <motion.div variants={item2}>
                                <PanelInicialProduccion1
                                    datosInicial={datosAgrupadosMeses.inicial[mesSeleccionadoIniciales]}
                                    datosSaldo={datosAgrupadosMeses.saldo[mesSeleccionadoIniciales]}
                                    producto={producto}
                                    mes={mesSeleccionadoIniciales}
                                    anyo={anyo}
                                />
                            </motion.div>
                        </div>
                    </div>
                    <div className="w-full flex flex-col mt-24">
                        <motion.div variants={item3}>
                            {Object.entries(datosAgrupadosMeses.tabla).map(function ([key, value]) {
                                return (
                                    <PanelProduccion1
                                        key={"panelTabla-" + key}
                                        datosColumnasConfig={datosColumnasConfig}
                                        datosVisibilidad={datosVisibilidad}
                                        semanas={datosAgrupadosMeses.semanas[key]}
                                        datosTabla={datosAgrupadosMeses.tabla[key]}
                                        datosPalet={datosAgrupadosMeses.palet[key]}
                                        producto={producto}
                                        mes={key}
                                        anyo={anyo}
                                        medidas={medidas}
                                    />
                                )
                            })}
                        </motion.div>
                    </div>
                </div>
            </motion.div>        
        )
    );
}

export default Produccion1Mod1;
