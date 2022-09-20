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
import { obtenermesAnterior } from 'app/logica/produccion/logicaProduccion';
//importacion acciones
import {
    selectDatosProduccionInicialProductosMesAnterior,
    getProduccionInicialMesAnterior
} from 'app/redux/produccion/produccionSlice';

function GraficoDatosInicialesProduccion(props) {
    const { datos, mes, anyo, productos } = props;
    const dispatch = useDispatch();
    const theme = useTheme();
    const [tabValue, setTabValue] = useState(0);
    const [datosGrafico, setDatosGrafico] = useState(null);
    const datosProduccionInicialProductosMesAnterior = useSelector(selectDatosProduccionInicialProductosMesAnterior);
    const titleTabs = ["Este mes", "Mes pasado"];

    //useEffect     

    useEffect(() => {
        if (datos) {
            if (!datosProduccionInicialProductosMesAnterior) {
                const { mesAnterior, anyoAnterior } = dispatch(obtenermesAnterior(mes, anyo));
                dispatch(getProduccionInicialMesAnterior({ mes: mesAnterior, anyo: anyoAnterior, productos }));
            } else {
                generaDatosGrafico();
            };
        };
    }, [datos, datosProduccionInicialProductosMesAnterior]);

    const generaDatosGrafico = () => {
        const objetoDatosGrafico = { series: [], labels: [], chartOptions: [] };
        for (let i = 0; i < 2; i++) {
            const arraySeries = [];
            let objetoSeries1, objetoSeries2;
            const arrayLabels = [];
            if (i === 0) {
                objetoSeries1 = { name: "Stock", data: [] };
                objetoSeries2 = { name: "Saldo", data: [] };
                datos.palet.inicial.forEach((dato) => {
                    arrayLabels.push(dato.producto);
                    const unidades = productos[productos.findIndex(prod => prod.producto === dato.producto)].unidades;
                    objetoSeries1.data.push(dato.stockInicial / unidades);
                    objetoSeries2.data.push(datos.palet.saldo[0].saldoInicial * 1.5);
                });
                datos.patin.inicial.forEach((dato) => {
                    arrayLabels.push(dato.producto);
                    const unidades = productos[productos.findIndex(prod => prod.producto === dato.producto)].unidades;
                    objetoSeries1.data.push(dato.stockInicial / unidades);
                    objetoSeries2.data.push(datos.patin.saldo[0].saldoInicial * 1.5);
                });
                datos.taco.inicial.forEach((dato) => {
                    arrayLabels.push(dato.producto);
                    const unidades = productos[productos.findIndex(prod => prod.producto === dato.producto)].unidades;
                    objetoSeries1.data.push(dato.stockInicial / unidades);
                    objetoSeries2.data.push(datos.taco.saldo[0].saldoInicial * 1.5);
                });
                arraySeries.push(objetoSeries1);
                arraySeries.push(objetoSeries2);
                objetoDatosGrafico.labels[i] = arrayLabels;
                objetoDatosGrafico.series[i] = arraySeries;
            };
            if (i === 1) {
                objetoSeries1 = { name: "Stock", data: [] };
                objetoSeries2 = { name: "Saldo", data: [] };
                datosProduccionInicialProductosMesAnterior.palet.inicial.forEach((dato) => {
                    arrayLabels.push(dato.producto);
                    const unidades = productos[productos.findIndex(prod => prod.producto === dato.producto)].unidades;
                    objetoSeries1.data.push(dato.stockInicial / unidades);
                    objetoSeries2.data.push(datosProduccionInicialProductosMesAnterior.palet.saldo[0].saldoInicial * 1.5);
                });
                datosProduccionInicialProductosMesAnterior.patin.inicial.forEach((dato) => {
                    arrayLabels.push(dato.producto);
                    const unidades = productos[productos.findIndex(prod => prod.producto === dato.producto)].unidades;
                    objetoSeries1.data.push(dato.stockInicial / unidades);
                    objetoSeries2.data.push(datosProduccionInicialProductosMesAnterior.patin.saldo[0].saldoInicial * 1.5);
                });
                datosProduccionInicialProductosMesAnterior.taco.inicial.forEach((dato) => {
                    arrayLabels.push(dato.producto);
                    const unidades = productos[productos.findIndex(prod => prod.producto === dato.producto)].unidades;
                    objetoSeries1.data.push(dato.stockInicial / unidades);
                    objetoSeries2.data.push(datosProduccionInicialProductosMesAnterior.taco.saldo[0].saldoInicial * 1.5);
                });
                arraySeries.push(objetoSeries1);
                arraySeries.push(objetoSeries2);
                objetoDatosGrafico.labels[i] = arrayLabels;
                objetoDatosGrafico.series[i] = arraySeries;
            };
            objetoDatosGrafico.chartOptions[i] = {
                chart: {
                    animations: {
                        enabled: true,
                    },
                    fontFamily: 'inherit',
                    foreColor: 'inherit',
                    height: 500,
                    type: 'bar',
                    toolbar: {
                        show: false,
                    },
                },
                //colors: [theme.palette.secondary.main, theme.palette.success.light],               
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
                    offsetX: -6,
                    style: {
                        fontSize: '12px',
                        colors: ['#fff'],
                    },
                    formatter: function (value, { seriesIndex, dataPointIndex, w }) {
                        if (seriesIndex === 1) {
                            return value / 1.5
                        } else {
                            return value
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
                        formatter: function (value, { series, seriesIndex, dataPointIndex, w }) {
                            if (seriesIndex === 1) {
                                return value / 1.5
                            } else {
                                return value
                            };
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
    };

    if (!datosGrafico) {
        return null
    };

    return (
        datosGrafico && (
            <Paper className="flex flex-col flex-auto shadow rounded-2xl overflow-hidden">
                <div className="flex items-start justify-between mx-24 mt-16">
                    <Typography className="text-lg font-medium tracking-tight leading-6 truncate">
                        Gráfico Stock y Saldo
                    </Typography>
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
                <div className="flex flex-col flex-auto h-full pr-12">
                    <ReactApexChart
                        options={datosGrafico.chartOptions[tabValue]}
                        series={datosGrafico.series[tabValue]}
                        type={datosGrafico.chartOptions[tabValue].chart.type}
                        height={datosGrafico.chartOptions[tabValue].chart.height}
                    />
                </div>
            </Paper>
        )
    );
}

export default GraficoDatosInicialesProduccion;
