import { useTheme } from '@mui/material/styles';
import ReactApexChart from 'react-apexcharts';
import Paper from '@mui/material/Paper';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Box from '@mui/material/Box';
import { useState, useEffect } from 'react';
import _ from '@lodash';
import { useDispatch, useSelector } from 'react-redux';
import Typography from '@mui/material/Typography';

//importacion acciones
import {
    obtenerMesAnterior,
    calculoSemanasPeriodoMesConcreto,
    formateado
} from 'app/logica/produccion/logicaProduccion';
import {
    selectDatosProduccionLXMesAnterior,
    getProduccionLXMesAnterior
} from 'app/redux/produccion/produccionSlice';

function GraficoProduccionLX(props) {
    const { datos, mesNumero, anyo, productos } = props;
    const dispatch = useDispatch();
    const theme = useTheme();
    const [tabValue, setTabValue] = useState(0);
    const [datosGrafico, setDatosGrafico] = useState(null);
    const [datosPieGrafico, setDatosPieGrafico] = useState(null);
    const datosProduccionLXMesAnterior = useSelector(selectDatosProduccionLXMesAnterior);
    const titleTabs = ["Este mes", "Mes pasado"];
    const [semanasCorrespondientesPeriodoMesAnterior, setSemanasCorrespondientesPeriodoMesAnterior] = useState(null);
    const [datosMesAnterior, setDatosMesAnterior] = useState(null);

    //useEffect    

    useEffect(() => {
        if (datos) {
            setSemanasCorrespondientesPeriodoMesAnterior(null);
        };
    }, [datos]);

    useEffect(() => {
        if (!semanasCorrespondientesPeriodoMesAnterior) {
            const { mesAnterior } = dispatch(obtenerMesAnterior(mesNumero, anyo));
            setSemanasCorrespondientesPeriodoMesAnterior(dispatch(calculoSemanasPeriodoMesConcreto(mesAnterior)));
        } else {
            const periodo = semanasCorrespondientesPeriodoMesAnterior.map(({ numeroSemana, mes }) => ({
                semana: numeroSemana,
                mes,
                anyo
            }));
            dispatch(getProduccionLXMesAnterior({ periodo, productos }));
        };
    }, [semanasCorrespondientesPeriodoMesAnterior]);

    useEffect(() => {
        if (datosProduccionLXMesAnterior) {
            const arrayProduccionGraficoMesanterior = [];
            datosProduccionLXMesAnterior.map((semana, index) => {
                arrayProduccionGraficoMesanterior.push(datosProduccionLXMesAnterior[index][1]);
            });
            setDatosMesAnterior(arrayProduccionGraficoMesanterior);
        };
    }, [datosProduccionLXMesAnterior]);

    useEffect(() => {
        if (datosMesAnterior && datos) {
            generaDatosGrafico();
        };
    }, [datosMesAnterior]);

    const generaDatosGrafico = () => {
        const objetoDatosGrafico = { series: [], labels: [], chartOptions: [] };
        const objetoDatosPieGrafico = { labels: [], cantidad: [], cargas: [] };
        for (let i = 0; i < 2; i++) {
            const arraySeriesCantidad = [];
            let objetoSeriesCantidad;
            const arraySeriesCargas = [];
            let objetoSeriesCargas;
            const arrayLabels = [];
            let sumatorioCantidadSemana,
                sumatorioCargasSemana,
                sumatorioCantidadLX3,
                sumatorioCantidadTopLayer,
                sumatorioCargasLX3,
                sumatorioCargasTopLayer,
                cantidad,
                cargas;
            if (i === 0) {
                objetoSeriesCantidad = { name: "Cantidad", data: [] };
                objetoSeriesCargas = { name: "Cargas", data: [] };
                sumatorioCantidadLX3 = 0;
                sumatorioCantidadTopLayer = 0;
                sumatorioCargasLX3 = 0;
                sumatorioCargasTopLayer = 0;
                productos.forEach((producto) => {
                    arrayLabels.push(producto.producto);
                    sumatorioCantidadSemana = 0;
                    sumatorioCargasSemana = 0;
                    datos.forEach((semana) => {
                        cantidad = semana[semana.findIndex(prod => prod.producto === producto.producto)].cantidad;
                        sumatorioCantidadSemana += cantidad;
                        cargas = semana[semana.findIndex(prod => prod.producto === producto.producto)].cargas;
                        sumatorioCargasSemana += cargas;
                    });
                    objetoSeriesCantidad.data.push(sumatorioCantidadSemana);
                    objetoSeriesCargas.data.push(sumatorioCargasSemana);
                    if (producto.producto.includes("LX3")) {
                        sumatorioCantidadLX3 += sumatorioCantidadSemana;
                        sumatorioCargasLX3 += sumatorioCargasSemana;
                    };
                    if (producto.producto.includes("TOPLAYER")) {
                        sumatorioCantidadTopLayer += sumatorioCantidadSemana;
                        sumatorioCargasTopLayer += sumatorioCargasSemana;
                    };
                });
                arrayLabels.push("TOTAL LX", "TOTAL TL");
                objetoSeriesCantidad.data.push(sumatorioCantidadLX3, sumatorioCantidadTopLayer);
                objetoSeriesCargas.data.push(sumatorioCargasLX3, sumatorioCargasTopLayer);
                arraySeriesCantidad.push(objetoSeriesCantidad);
                arraySeriesCargas.push(objetoSeriesCargas);
                objetoDatosGrafico.labels[i] = arrayLabels;
                objetoDatosGrafico.series[i] = arraySeriesCantidad;
                objetoDatosPieGrafico.labels[i] = arrayLabels;
                objetoDatosPieGrafico.cantidad[i] = arraySeriesCantidad;
                objetoDatosPieGrafico.cargas[i] = arraySeriesCargas;
            };
            if (i === 1) {
                objetoSeriesCantidad = { name: "Cantidad", data: [] };
                objetoSeriesCargas = { name: "Cargas", data: [] };
                sumatorioCantidadLX3 = 0;
                sumatorioCantidadTopLayer = 0;
                sumatorioCargasLX3 = 0;
                sumatorioCargasTopLayer = 0;
                productos.forEach((producto) => {
                    arrayLabels.push(producto.producto);
                    sumatorioCantidadSemana = 0;
                    sumatorioCargasSemana = 0;
                    datosMesAnterior.forEach((semana) => {
                        cantidad = semana[semana.findIndex(prod => prod.producto === producto.producto)].cantidad;
                        sumatorioCantidadSemana += cantidad;
                        cargas = semana[semana.findIndex(prod => prod.producto === producto.producto)].cargas;
                        sumatorioCargasSemana += cargas;
                    });
                    objetoSeriesCantidad.data.push(sumatorioCantidadSemana);
                    objetoSeriesCargas.data.push(sumatorioCargasSemana);
                    if (producto.producto.includes("LX3")) {
                        sumatorioCantidadLX3 += sumatorioCantidadSemana;
                        sumatorioCargasLX3 += sumatorioCargasSemana;
                    };
                    if (producto.producto.includes("TOPLAYER")) {
                        sumatorioCantidadTopLayer += sumatorioCantidadSemana;
                        sumatorioCargasTopLayer += sumatorioCargasSemana;
                    };
                });
                arrayLabels.push("TOTAL LX", "TOTAL TL");
                objetoSeriesCantidad.data.push(sumatorioCantidadLX3, sumatorioCantidadTopLayer);
                objetoSeriesCargas.data.push(sumatorioCargasLX3, sumatorioCargasTopLayer);
                arraySeriesCantidad.push(objetoSeriesCantidad);
                arraySeriesCargas.push(objetoSeriesCargas);
                objetoDatosGrafico.labels[i] = arrayLabels;
                objetoDatosGrafico.series[i] = arraySeriesCantidad;
                objetoDatosPieGrafico.labels[i] = arrayLabels;
                objetoDatosPieGrafico.cantidad[i] = arraySeriesCantidad;
                objetoDatosPieGrafico.cargas[i] = arraySeriesCargas;
            };
            objetoDatosGrafico.chartOptions[i] = {
                chart: {
                    animations: {
                        enabled: true,
                    },
                    fontFamily: 'inherit',
                    foreColor: 'inherit',
                    height: 300,
                    type: 'bar',
                    toolbar: {
                        show: false,
                    },
                },
                colors: [function ({ dataPointIndex }) {
                    if ((objetoDatosGrafico.labels[i][dataPointIndex].toString() === "LX3FR") || (objetoDatosGrafico.labels[i][dataPointIndex].toString() === "TOPLAYERFR")) {
                        return theme.palette.secondary.main
                    };
                    if ((objetoDatosGrafico.labels[i][dataPointIndex].toString() === "LX3DE")) {
                        return "#000000"
                    };
                    if ((objetoDatosGrafico.labels[i][dataPointIndex].toString() === "LX3ES") || (objetoDatosGrafico.labels[i][dataPointIndex].toString() === "TOPLAYERES")) {
                        return "#ffd966"
                    };
                    if ((objetoDatosGrafico.labels[i][dataPointIndex].toString() === "TOTAL LX") || (objetoDatosGrafico.labels[i][dataPointIndex].toString() === "TOTAL TL")) {
                        return "#92d050"
                    };
                }],
                grid: {
                    borderColor: theme.palette.divider,
                },
                legend: {
                    show: false,
                },
                plotOptions: {
                    bar: {
                        horizontal: true,
                        dataLabels: {
                            position: 'top',
                        },
                    }
                },
                dataLabels: {
                    enabled: true,
                    offsetX: -12,
                    style: {
                        fontSize: '12px',
                        colors: [function ({ dataPointIndex }) {
                            if ((objetoDatosGrafico.labels[i][dataPointIndex].toString() === "LX3ES") ||
                                (objetoDatosGrafico.labels[i][dataPointIndex].toString() === "TOPLAYERES") ||
                                (objetoDatosGrafico.labels[i][dataPointIndex].toString() === "TOTAL LX") ||
                                (objetoDatosGrafico.labels[i][dataPointIndex].toString() === "TOTAL TL")) {
                                return "#000000"
                            } else {
                                return "#fff"
                            };
                        }],
                    },
                    formatter: function (value) {
                        if (value > 0) {
                            return formateado(value)
                        };
                    }
                },
                states: {
                    hover: {
                        filter: {
                            type: 'darken',
                            value: 0.75,
                        },
                    },
                },
                tooltip: {
                    followCursor: true,
                    theme: 'dark',
                    y: {
                        formatter: function (value) {
                            return formateado(value)
                        }
                    }
                },
                xaxis: {
                    type: 'category',
                    categories: objetoDatosGrafico.labels[i],
                    axisTicks: {
                        color: theme.palette.divider,
                    },
                    labels: {
                        show: false,
                    },
                },
                yaxis: {
                    labels: {
                        align: 'left',
                        style: {
                            colors: theme.palette.text.secondary,
                        },
                    },
                },
            };
        };
        setDatosGrafico(objetoDatosGrafico);
        setDatosPieGrafico(objetoDatosPieGrafico);
    };

    if (!datosGrafico) {
        return null
    };

    return (
        datosGrafico && (
            <Paper className="flex flex-col flex-auto shadow rounded-2xl overflow-hidden">
                <div className="flex items-start justify-between mx-24 mt-16">
                    <div>
                        <Typography className="text-lg font-medium tracking-tight leading-6 truncate">
                            Gráfico datos salida palets
                        </Typography>
                        <Typography
                            className="text-sm leading-none"
                            color="text.secondary"
                        >
                            Cantidades mensuales
                        </Typography>
                    </div>
                    <div className="ml-8 -mb-4">
                        <Tabs
                            value={tabValue}
                            onChange={(ev, value) => setTabValue(value)}
                            indicatorColor="secondary"
                            textColor="inherit"
                            variant="scrollable"
                            scrollButtons={false}
                            className="-mx-4 min-h-10 py-4"
                            classes={{ indicator: 'flex justify-center bg-transparent w-full h-full' }}
                            TabIndicatorProps={{
                                children: (
                                    <Box
                                        sx={{ bgcolor: 'text.disabled' }}
                                        className="w-full h-full rounded-full opacity-20"
                                    />
                                ),
                            }}
                        >
                            <Tab
                                className="font-medium text-sm min-w-64 min-h-10 py-4"
                                disableRipple
                                label={titleTabs[0]}
                            />
                            <Tab
                                className="font-medium text-sm min-w-64 min-h-10 py-4"
                                disableRipple
                                label={titleTabs[1]}
                            />
                        </Tabs>
                    </div>
                </div>
                <div className="flex flex-col flex-auto h-full px-8">
                    <ReactApexChart
                        options={datosGrafico.chartOptions[tabValue]}
                        series={datosGrafico.series[tabValue]}
                        type={datosGrafico.chartOptions[tabValue].chart.type}
                        height={datosGrafico.chartOptions[tabValue].chart.height}
                    />
                </div>
                <div className="mx-24 mb-24">
                    <div className="-my-12 divide-y">
                        <div className="grid grid-cols-3 py-8">
                            <Typography className="ml-12 truncate font-medium text-sm">Producto</Typography>
                            <Typography className="text-right text-sm" color="text.secondary">Cargas</Typography>
                            <Typography className="font-medium text-right text-sm">Cantidad</Typography>
                        </div>
                        {datosPieGrafico.labels[tabValue].map((label, index) => (
                            <div className="grid grid-cols-3 py-8" key={index}>
                                <div className="flex items-center">
                                    <Box
                                        className="flex-0 w-8 h-8"
                                        sx={{
                                            backgroundColor:
                                                label.includes("FR") ? theme.palette.secondary.main :
                                                    label.includes("DE") ? '#000000' :
                                                        label.includes("ES") ? '#ffd966' :
                                                            '#92d050',
                                        }}
                                    />
                                    <Typography className="ml-12 truncate font-medium text-sm">{label}</Typography>
                                </div>
                                <Typography className="text-right text-sm" color="text.secondary">
                                    {formateado(datosPieGrafico.cargas[tabValue][0].data[index])}
                                </Typography>
                                <Typography className="font-medium text-right text-sm">
                                    {formateado(datosPieGrafico.cantidad[tabValue][0].data[index])}
                                </Typography>
                            </div>
                        ))}
                    </div>
                </div>
            </Paper>
        )
    );
}

export default GraficoProduccionLX;
