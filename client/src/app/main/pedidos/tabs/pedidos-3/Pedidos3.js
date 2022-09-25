import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import PanelPedidos from '../../panel/PanelPedidos';

//importacion acciones
import {
    setPedido,
    getPedido,
    selectPedido,
    selectPedidoProducto,
    getPedidoProducto,
    setPedidoProducto
} from 'src/app/redux/produccion/pedidoSlice';
import { selectSemanasAnyo } from 'app/redux/produccion/inicioSlice';
import {
    calculoSemanasAnyo,
    calculoSemanasPeriodo,
    decMesActual
} from 'app/logica/produccion/logicaProduccion';

function Pedidos3() {
    const dispatch = useDispatch();
    const semanasAnyo = useSelector(selectSemanasAnyo);
    const datosPedido = useSelector(selectPedido);
    const pedidoProducto = useSelector(selectPedidoProducto);
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

    //useEffect   

    useEffect(() => {
        dispatch(setPedidoProducto(null));
        dispatch(setPedido(null));
    }, []);

    useEffect(() => {
        if (!pedidoProducto) {
            dispatch(getPedidoProducto(tipo));
        };
    }, [pedidoProducto]);

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

    //funciones

    const handleChangeSelect = (e) => {
        setPeriodo(e.target.value);
        setSemanasCorrespondientesPeriodo(dispatch(calculoSemanasPeriodo(e.target.value)));
    };

    if (
        !semanasCorrespondientesPeriodo ||
        !datosPedido ||
        !pedidoProducto
    ) {
        return null;
    };

    return (
        (
            semanasCorrespondientesPeriodo &&
            datosPedido &&
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
                        {datosPedido.map((pedido, index) => (
                            <div className="mb-24" key={"pedidoDiv" + index}>
                                <PanelPedidos
                                    datosPedido={pedido}
                                    semana={semanasCorrespondientesPeriodo[index]}
                                    productos={pedidoProducto}
                                />
                            </div>
                        ))}
                    </motion.div>
                </div>
            </motion.div>
        )
    );
}

export default Pedidos3;
