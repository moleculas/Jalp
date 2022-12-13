import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import PanelPedidos from '../../componentes/PanelPedidos';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

//importacion acciones
import {
    setPedido,
    getPedido,
    selectPedido
} from 'src/app/redux/produccion/pedidoSlice';
import { selectSemanasAnyo } from 'app/redux/produccion/inicioSlice';
import {
    calculoSemanasAnyo,
    calculoSemanasPeriodo,
    decMesActual,
    calculoSemanaAnyoActual,
    TabPanel
} from 'app/logica/produccion/logicaProduccion';
import {
    getProductos,
    setProductos
} from 'app/redux/produccion/productoSlice';

function Pedidos3() {
    const dispatch = useDispatch();
    const semanasAnyo = useSelector(selectSemanasAnyo);
    const datosPedido = useSelector(selectPedido);
    const container = {
        show: {
            transition: {
                staggerChildren: 0.1,
            },
        },
    };
    const item1 = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { delay: 0.1 } },
    };
    const [semanasCorrespondientesPeriodo, setSemanasCorrespondientesPeriodo] = useState(null);
    const [periodo, setPeriodo] = useState(1);
    const { mes, anyo } = dispatch(decMesActual());
    const tipo = "masova";
    const [tabValue, setTabValue] = useState({});
    const [semanaActual, setSemanaActual] = useState(dispatch(calculoSemanaAnyoActual()));
    const [datosAgrupadosMeses, setDatosAgrupadosMeses] = useState(null);
    const [pedidoProducto, setPedidoProducto] = useState(null);

    //useEffect   

    useEffect(() => {
        dispatch(setPedido(null));
        dispatch(setProductos(null));
        dispatch(getProductos({ familia: 'maderas', min: true })).then(({ payload }) => {
            const pedidoProductoArray = [];
            payload.map((pedProducto) => {
                if (pedProducto.tipoPedido.includes(tipo)) {
                    pedidoProductoArray.push({
                        producto: pedProducto.descripcion,
                        largo: pedProducto.largo,
                        ancho: pedProducto.ancho,
                        grueso: pedProducto.grueso,
                        tipo: tipo
                    });
                };
            });
            setPedidoProducto(pedidoProductoArray);
        });
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
                semana: numeroSemana,
                mes,
                anyo
            }));
            dispatch(getPedido({ periodo, anyo, tipo }));
        };
    }, [semanasCorrespondientesPeriodo]);

    useEffect(() => {
        if (datosPedido && semanasCorrespondientesPeriodo) {
            let indexSemana = semanasCorrespondientesPeriodo.findIndex(semana => semana.numeroSemana === semanaActual);
            indexSemana < 0 && (indexSemana = 0);
            const groupedObject = _.groupBy(datosPedido, dato => dato.mes);
            const arrayAgrupado = [];
            let objetoTabs = {};
            for (const key in groupedObject) {
                arrayAgrupado.push(groupedObject[key]);
                objetoTabs[key] = indexSemana;
            };
            setDatosAgrupadosMeses(arrayAgrupado);
            setTabValue(objetoTabs);
        };
    }, [datosPedido]);

    //funciones

    const handleChangeTab = (event, value, key) => {
        let objetoTabs = { ...tabValue };
        objetoTabs[key] = value;
        setTabValue(objetoTabs);
    };

    const handleChangeSelect = (e) => {
        setPeriodo(e.target.value);
        setSemanasCorrespondientesPeriodo(dispatch(calculoSemanasPeriodo(e.target.value)));
    };

    if (
        !semanasCorrespondientesPeriodo ||
        !datosAgrupadosMeses ||
        !pedidoProducto
    ) {
        return null;
    };

    return (
        (
            semanasCorrespondientesPeriodo &&
            datosAgrupadosMeses &&
            pedidoProducto
        ) && (
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
                                Tabla cálculo pedidos Masova
                            </Typography>
                            <div className="mt-2 font-medium">
                                <Typography>Variables para cálculo de pedidos mensuales.</Typography>
                            </div>
                        </div>
                        <div className="flex flex-row w-[175px]">
                            <FormControl fullWidth>
                                <InputLabel>Consulta</InputLabel>
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
                    <motion.div variants={item1} className="w-full flex flex-col">
                        {datosAgrupadosMeses.map((mes, indexMes) => {
                            return (
                                <Paper
                                    className="rounded-2xl flex grow mb-24"
                                    key={'mes' + indexMes}
                                    sx={{ minHeight: 330 }}
                                >
                                    <Tabs
                                        orientation="vertical"
                                        value={tabValue[mes[0].mes]}
                                        onChange={(event, value, key) => handleChangeTab(event, value, mes[0].mes)}
                                        className="border-r-1 pt-64"
                                        sx={{ minWidth: 130 }}
                                        textColor="inherit"
                                        classes={{ indicator: 'flex justify-center bg-transparent w-full h-full' }}
                                        TabIndicatorProps={{
                                            children: (
                                                <Box
                                                    sx={{ bgcolor: 'text.disabled' }}
                                                    className="w-full h-full opacity-20"
                                                />
                                            ),
                                        }}
                                    >
                                        {mes.map((pedido, index) => {
                                            return (
                                                <Tab
                                                    className="text-14 font-semibold flex items-start pl-24"
                                                    key={"tab" + index}
                                                    label={`Semana ${pedido.semana}`}
                                                    disableRipple
                                                />
                                            )
                                        })}
                                    </Tabs>
                                    {mes.map((pedido, index) => {
                                        const semana = semanasCorrespondientesPeriodo[semanasCorrespondientesPeriodo.findIndex(semana => semana.numeroSemana === pedido.semana)];
                                        return (
                                            <TabPanel
                                                key={"tabPanel" + index}
                                                value={tabValue[mes[0].mes]}
                                                index={index}
                                                className="w-full"
                                                sx={{ minHeight: 330 }}
                                            >
                                                <PanelPedidos
                                                    datosPedido={pedido}
                                                    semana={semana}
                                                    anyo={anyo}
                                                    productos={pedidoProducto}
                                                />
                                            </TabPanel>
                                        )
                                    })}
                                </Paper>
                            )
                        })}
                    </motion.div>
                </div>
            </motion.div>
        )
    );
}

export default Pedidos3;
