import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import Typography from '@mui/material/Typography';
import _ from '@lodash';
import PanelDatosInicialesProduccion from '../../componentes/PanelDatosInicialesProduccion';
import GraficoDatosInicialesProduccion from '../../grafico/GraficoDatosInicialesProduccion';

//constantes
import { PRODUCTOS } from 'constantes';

//importacion acciones
import {
    selectDatosProduccionInicialProductos,
    getProduccionInicial,
    setDatosProduccionInicialProductos
} from 'app/redux/produccion/produccionSlice';
import { decMesActual } from 'app/logica/produccion/logicaProduccion';
import { selectObjSocket } from 'app/redux/socketSlice';
import { showMessage } from 'app/redux/fuse/messageSlice';

function Produccion0() {
    const dispatch = useDispatch();
    const socket = useSelector(selectObjSocket);
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
    const item3 = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { delay: 0.7 } },
    };
    const item4 = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { delay: 0.9 } },
    };
    const datosProduccionInicialProductos = useSelector(selectDatosProduccionInicialProductos);
    const { mes, anyo, mesNumero } = dispatch(decMesActual());

    //useEffect    

    useEffect(() => {
        vaciarDatos();
    }, []);

    useEffect(() => {
        //comunicación socket
        const receiveComunicacion = (comunicacion) => {
            if ((socket.id.slice(8) !== comunicacion.from) && (
                (
                    comunicacion.body.tabla === "updateProduccionInicial"
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
        if (mes) {
            iniciarPantalla();
        };
    }, [mes]);

    //funciones 

    const vaciarDatos = () => {
        return new Promise((resolve, reject) => {
            dispatch(setDatosProduccionInicialProductos(null));
            resolve({ payload: true });
            reject(new Error('Algo salió mal'));
        });
    };

    const iniciarPantalla = () => {
        dispatch(getProduccionInicial({ mes, anyo, productos: PRODUCTOS }));
    };

    return (
        <motion.div
            className="grid grid-cols-1 md:grid-cols-3 md:gap-24 p-24"
            variants={container}
            initial="hidden"
            animate="show"
        >
            <div className="w-full p-12 md:pl-12 md:pr-0 col-span-2">
                <div className="flex flex-col sm:flex-row flex-1 items-start px-12 justify-between mb-24">
                    <div>
                        <Typography className="text-2xl font-extrabold tracking-tight leading-tight">
                            Inicio datos producción
                        </Typography>
                        <div className="mt-2 font-medium">
                            <Typography>Datos iniciales mensuales para cálculos de producción según modelos para el mes de {`${_.upperFirst(mes)} ${anyo}`}.</Typography>
                        </div>
                    </div>
                </div>
                {datosProduccionInicialProductos && (
                    <>
                        <motion.div variants={item1} className="w-full flex flex-col">
                            <PanelDatosInicialesProduccion
                                datos={datosProduccionInicialProductos.palet}
                                familia={"palet"}
                                productos={PRODUCTOS}
                                mes={mes}
                                anyo={anyo}
                            />
                        </motion.div>
                        <motion.div variants={item3} className="w-full flex flex-col mt-24">
                            <PanelDatosInicialesProduccion
                                datos={datosProduccionInicialProductos.taco}
                                familia={"taco"}
                                productos={PRODUCTOS}
                                mes={mes}
                                anyo={anyo}
                            />
                        </motion.div>
                        <motion.div variants={item4} className="w-full flex flex-col mt-24">
                            <PanelDatosInicialesProduccion
                                datos={datosProduccionInicialProductos.patin}
                                familia={"patin"}
                                productos={PRODUCTOS}
                                mes={mes}
                                anyo={anyo}
                            />
                        </motion.div>
                    </>
                )}
            </div>
            <div className="w-full p-12 md:pr-12 md:pl-0">
                <div className="flex flex-col sm:flex-row flex-1 items-start px-12 justify-between mb-24">
                    <div>
                        <Typography className="text-2xl font-extrabold tracking-tight leading-tight">
                            Gráfico datos producción
                        </Typography>
                        <div className="mt-2 font-medium">
                            <Typography>Gráfico datos iniciales mensuales.</Typography>
                        </div>
                    </div>
                </div>
                {datosProduccionInicialProductos && (
                    <motion.div variants={item2} className="w-full">
                        <GraficoDatosInicialesProduccion
                            datos={datosProduccionInicialProductos}
                            mesNumero={mesNumero}
                            anyo={anyo}
                            productos={PRODUCTOS}
                        />
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}

export default Produccion0;