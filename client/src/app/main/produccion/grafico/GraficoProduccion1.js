import { useTheme } from '@mui/material/styles';
import ReactApexChart from 'react-apexcharts';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Box from '@mui/material/Box';
import { useState, useEffect } from 'react';
import _ from '@lodash';
import clsx from 'clsx';

function GraficoProduccion1(props) {
    const { datosTabla, datosPalet, producto, semanas, objetivos } = props;
    const theme = useTheme();
    const [tabValue, setTabValue] = useState(0);
    let titleTabs;
    if (producto.familia === "palet") {
        titleTabs = ["Saldo", "Palets"];
    };
    const [datosGrafico, setDatosGrafico] = useState(null);

    //useEffect     

    useEffect(() => {
        if (datosTabla && datosPalet) {
            generaDatosGrafico();
        };
    }, [datosTabla, datosPalet]);

    const generaDatosGrafico = () => {
        const objetoDatosGrafico = { series: [], amount: [], labels: [], chartOptions: [], proporcion: [] };
        for (let i = 0; i < 2; i++) {
            const array = [{ name: titleTabs[i], data: [] }];
            const arrayLabels = [];
            let sumatorioPalets = 0;
            let sumatorioSaldo = 0;
            let objetoProporcion;
            datosTabla.map((semana, index) => {
                if (i === 0) {
                    if (semana.saldo) {
                        array[0].data.push(semana.saldo);
                        sumatorioSaldo = semana.saldo;
                        objetoDatosGrafico.amount[i] = sumatorioSaldo;
                    } else {
                        array[0].data.push(0);
                        sumatorioSaldo += 0;
                        objetoDatosGrafico.amount[i] = sumatorioSaldo;
                    };
                    const etiqueta = semanas.find(o => o.numeroSemana === semana.semana);
                    arrayLabels.push(etiqueta.nombre);
                };
                if (i === 1) {
                    if (datosPalet[index].palets) {
                        array[0].data.push(datosPalet[index].palets);
                        sumatorioPalets += datosPalet[index].palets;
                        objetoDatosGrafico.amount[i] = sumatorioPalets;
                    } else {
                        array[0].data.push(0);
                        sumatorioPalets += 0;
                        objetoDatosGrafico.amount[i] = sumatorioPalets;
                    };
                    const etiqueta = semanas.find(o => o.numeroSemana === semana.semana);
                    arrayLabels.push(etiqueta.nombre);
                };
            });
            objetoDatosGrafico.series[i] = array;
            objetoDatosGrafico.labels[i] = arrayLabels;
            objetoDatosGrafico.chartOptions[i] = {
                chart: {
                    animations: {
                        enabled: false,
                    },
                    fontFamily: 'inherit',
                    foreColor: 'inherit',
                    height: '100%',
                    type: 'area',
                    sparkline: {
                        enabled: true,
                    },
                },
                colors: i === 0 ? [theme.palette.secondary.main] : [theme.palette.success.main],
                fill: {
                    colors: i === 0 ? [theme.palette.secondary.light] : [theme.palette.success.light],
                    opacity: 0.5,
                },
                stroke: {
                    curve: 'smooth',
                },
                tooltip: {
                    followCursor: true,
                    theme: 'dark',
                },
                xaxis: {
                    type: 'category',
                    categories: objetoDatosGrafico.labels[i],
                },
            };
            let cantidad;
            if (i === 0) {
                cantidad = (100 - ((objetoDatosGrafico.amount[i] * 100) / objetivos.saldo));
                if (objetoDatosGrafico.amount[i] >= objetivos.saldo) {
                    objetoProporcion = {
                        estado: 'mayor',
                        texto: 'por encima del objetivo',
                        proporcion: _.round(cantidad, 1)
                    };
                } else {
                    objetoProporcion = {
                        estado: 'menor',
                        texto: 'por debajo del objetivo',
                        proporcion: _.round(cantidad, 1)
                    };
                };
                objetoDatosGrafico.proporcion[i] = objetoProporcion;
            };
            if (i === 1) {
                cantidad = (100 - ((objetoDatosGrafico.amount[i] * 100) / objetivos.palets));
                if (objetoDatosGrafico.amount[i] >= objetivos.palets) {
                    objetoProporcion = {
                        estado: 'mayor',
                        texto: 'por encima del objetivo',
                        proporcion: _.round(cantidad, 1)
                    };
                } else {
                    objetoProporcion = {
                        estado: 'menor',
                        texto: 'por debajo del objetivo',
                        proporcion: _.round(cantidad, 1)
                    };
                };
                objetoDatosGrafico.proporcion[i] = objetoProporcion;
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
                <div className="flex items-start justify-between mx-24 mt-16 mb-0">
                    <Typography className="text-lg font-medium tracking-tight leading-6 truncate">
                        Gráfico producción
                    </Typography>
                    <div className="ml-8 -mb-4">
                        {/* <Chip size="small" className="font-medium text-sm px-6" label=" 1 mes" /> */}
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
                <div className="flex flex-col lg:flex-row lg:items-center mx-24 mt-12">
                    <Typography className="text-6xl font-bold tracking-tighter leading-tight">
                        {datosGrafico.amount[tabValue]}
                    </Typography>
                    <div className="flex lg:flex-col lg:ml-12">
                        <FuseSvgIcon
                            size={20}
                            className={clsx(
                                datosGrafico.proporcion[tabValue].estado === 'mayor' ? "text-green-500" : "text-red-500"
                            )}
                        >
                            {datosGrafico.proporcion[tabValue].estado === 'mayor' ? "heroicons-solid:trending-up" : "heroicons-solid:trending-down"}

                        </FuseSvgIcon>
                        <Typography
                            className="flex items-center ml-4 lg:ml-0 lg:mt-2 text-md leading-none whitespace-nowrap"
                            color="text.secondary"
                        >
                            <span
                                className={clsx(
                                    "font-medium",
                                    datosGrafico.proporcion[tabValue].estado === 'mayor' ? "text-green-500" : "text-red-500"
                                )}
                            >
                                {`${datosGrafico.proporcion[tabValue].proporcion}%`}
                            </span>
                            <span className="ml-4">{datosGrafico.proporcion[tabValue].texto}</span>
                        </Typography>
                    </div>
                </div>
                <div className="flex flex-col flex-auto h-80">
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

export default GraficoProduccion1;
