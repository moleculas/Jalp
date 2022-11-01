import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import _ from '@lodash';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import PanelDatosLX from '../../panel/PanelDatosLX';
import GraficoProduccionLX from '../../grafico/GraficoProduccionLX';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

//constantes
import { PRODUCTOSLX } from 'constantes';

//importacion acciones
import {
    selectDatosProduccionLX,
    getProduccionLX,
    setDatosProduccionLX
} from 'app/redux/produccion/produccionSlice';
import { selectSemanasAnyo } from 'app/redux/produccion/inicioSlice';
import {
    calculoSemanasAnyo,
    calculoSemanasPeriodo,
    decMesActual,
    calculoSemanaAnyoActual,
    TabPanel
} from 'app/logica/produccion/logicaProduccion';

function ProduccionLX() {
    const dispatch = useDispatch();
    const semanasAnyo = useSelector(selectSemanasAnyo);
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
    const datosProduccionLX = useSelector(selectDatosProduccionLX);
    const { mes, anyo, mesNumero } = dispatch(decMesActual());
    const [periodo, setPeriodo] = useState(1);
    const [semanasCorrespondientesPeriodo, setSemanasCorrespondientesPeriodo] = useState(null);
    const [datosProduccionLXGrafico, setDatosProduccionLXGrafico] = useState(null);
    const [tabValue, setTabValue] = useState({});
    const [semanaActual, setSemanaActual] = useState(dispatch(calculoSemanaAnyoActual()));
    const [datosAgrupadosMeses, setDatosAgrupadosMeses] = useState(null);

    //useEffect    

    useEffect(() => {
        dispatch(setDatosProduccionLX(null));
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
            const periodo = semanasCorrespondientesPeriodo.map(({ numeroSemana, nombre, mes }) => ({
                semana: numeroSemana,
                nombre,
                mes,
                anyo
            }));
            dispatch(getProduccionLX({ periodo, productos: PRODUCTOSLX }));
        };
    }, [semanasCorrespondientesPeriodo]);

    useEffect(() => {
        if (datosProduccionLX && semanasCorrespondientesPeriodo) {            
            let indexSemana = semanasCorrespondientesPeriodo.findIndex(semana => semana.numeroSemana === semanaActual);
            indexSemana < 0 && (indexSemana = 0);
            const groupedObject = _.groupBy(datosProduccionLX, dato => dato[0].semana.mes);
            const arrayAgrupado = [];
            let objetoTabs = {};
            for (const key in groupedObject) {
                arrayAgrupado.push(groupedObject[key]);
                objetoTabs[key] = indexSemana;
            };
            setDatosAgrupadosMeses(arrayAgrupado);
            setTabValue(objetoTabs);
            if (datosProduccionLX.length === semanasCorrespondientesPeriodo.length) {               
                const arrayProduccionGrafico = [];
                semanasCorrespondientesPeriodo.map((semana, index) => {
                    if (semana.mes === mes) {
                        arrayProduccionGrafico.push(datosProduccionLX[index][1].filter(item => item.semana === Number(semana.numeroSemana)));
                    };
                });               
                setDatosProduccionLXGrafico(arrayProduccionGrafico);
            };
        };
    }, [datosProduccionLX]);

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
        !semanasCorrespondientesPeriodo &&
        !datosAgrupadosMeses &&
        !datosProduccionLXGrafico
    ) {
        return null;
    };

    return (
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
                            Salida palets
                        </Typography>
                        <div className="mt-2 font-medium">
                            <Typography>Datos salida palets para cálculos de producción.</Typography>
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
                <div className="grid grid-cols-1 md:grid-cols-3 md:gap-24 w-full">
                    <div className="w-full col-span-2">
                        <motion.div variants={item1} className="w-full flex flex-col">
                            {datosAgrupadosMeses && (
                                datosAgrupadosMeses.map((mes, indexMes) => {
                                    return (
                                        <Paper
                                            className="rounded-2xl flex grow mb-24"
                                            key={'mes' + indexMes}
                                            sx={{ height: 488 }}
                                        >
                                            <Tabs
                                                orientation="vertical"
                                                value={tabValue[mes[0][0].semana.mes]}
                                                onChange={(event, value, key) => handleChangeTab(event, value, mes[0][0].semana.mes)}
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
                                                {mes.map((producto, index) => {
                                                    return (
                                                        <Tab
                                                            className="text-14 font-semibold flex items-start pl-24"
                                                            key={"tab" + index}
                                                            label={`Semana ${producto[0].semana.semana}`}
                                                            disableRipple
                                                        />
                                                    )
                                                })}
                                            </Tabs>
                                            {mes.map((producto, index) => {
                                                return (
                                                    <TabPanel
                                                        key={"tabPanel" + index}
                                                        value={tabValue[mes[0][0].semana.mes]}
                                                        index={index}
                                                        className="w-full"
                                                        sx={{ height: 488 }}
                                                    >
                                                        <PanelDatosLX
                                                            datos={producto[1]}
                                                            semana={producto[0].semana}
                                                            anyo={anyo}
                                                        />
                                                    </TabPanel>
                                                )
                                            })}
                                        </Paper>
                                    )
                                })
                            )}
                        </motion.div>
                    </div>
                    {datosProduccionLXGrafico && (
                        <motion.div variants={item2} className="w-full">
                            <GraficoProduccionLX
                                datos={datosProduccionLXGrafico}
                                mesNumero={mesNumero}
                                anyo={anyo}
                                productos={PRODUCTOSLX}
                            />
                        </motion.div>
                    )}
                </div>
            </div>       
        </motion.div>
    );
}

export default ProduccionLX;
