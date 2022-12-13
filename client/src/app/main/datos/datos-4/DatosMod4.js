import Typography from '@mui/material/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { IconButton } from '@mui/material';
import _ from '@lodash';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { motion } from 'framer-motion';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import FilaMod4 from './FilaMod4';
import Chip from '@mui/material/Chip';

//importacion acciones
import {
    selectProductos,
    getProductos,
    addProducto,
    updateProducto,
    deleteProducto,
    setProductos
} from 'app/redux/produccion/productoSlice';
import {
    removeArrayByIndex
} from 'app/logica/produccion/logicaProduccion';

function DatosMod4(props) {
    const { leftSidebarToggle, rightSidebarToggle, rightSidebarOpen } = props;
    const dispatch = useDispatch();
    const productos = useSelector(selectProductos);
    const [productosControllers, setProductosControllers] = useState([]);
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

    //useEffect   

    useEffect(() => {
        rightSidebarOpen && (rightSidebarToggle());
        dispatch(setProductos(null));
        setProductosControllers([]);
        dispatch(getProductos({ familia: 'costeHoraTrabajador', min: false })).then(({ payload }) => {
            gestionaProductos(payload);
        });
    }, []);

    //funciones

    const gestionaProductos = (respuesta) => {
        if (respuesta.length > 0) {
            const arrayProductos = [];
            respuesta.forEach((producto, index) => {
                let objetoProducto = {
                    _id: producto._id,
                    descripcion: producto.descripcion,
                    categoria: producto.categoria[0],
                    precioUnitario: producto.precioUnitario,
                    historico: producto.historico,
                    activo: producto.activo
                };
                arrayProductos.push(objetoProducto);
            });
            setProductosControllers(arrayProductos);
        };
    };

    const anadirFila = () => {
        const arrayProductos = [...productosControllers];
        let objetoProducto = {
            _id: null,
            descripcion: "",
            categoria: "",
            precioUnitario: null,
            historico: [],
            activo: true
        };
        arrayProductos.push(objetoProducto);
        setProductosControllers(arrayProductos);
    };

    const registrarFila = (productoRetornado) => {
        const objeto = {
            descripcion: productoRetornado.descripcion,
            categoria: [productoRetornado.categoria],
            precioUnitario: productoRetornado.precioUnitario,
            activo: productoRetornado.activo
        };
        let arrayHistorico = [...productoRetornado.historico];
        arrayHistorico.push({
            precioUnitario: productoRetornado.precioUnitario,
            activo: productoRetornado.activo,
            fecha: new Date()
        });
        objeto.historico = arrayHistorico;
        objeto.familia = "costeHoraTrabajador";
        if (!productoRetornado._id) {
            dispatch(addProducto(objeto)).then(({ payload }) => {
                dispatch(getProductos({ familia: 'costeHoraTrabajador', min: false })).then(({ payload }) => {
                    gestionaProductos(payload);
                });
            });
        } else {
            const datosActualizar = {
                id: productoRetornado._id,
                producto: objeto
            };
            dispatch(updateProducto(datosActualizar)).then(({ payload }) => {
                dispatch(getProductos({ familia: 'costeHoraTrabajador', min: false })).then(({ payload }) => {
                    gestionaProductos(payload);
                });
            });
        };
    };

    const borrarFila = (id, index) => {
        if (id) {
            dispatch(deleteProducto(id)).then(({ payload }) => {
                dispatch(getProductos({ familia: 'costeHoraTrabajador', min: false })).then(({ payload }) => {
                    gestionaProductos(payload);
                });
            });
        };
        const myArray = removeArrayByIndex(productosControllers, index);
        setProductosControllers(myArray);
    };

    if (!productos) {
        return null
    };

    return (
        <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-24 p-24"
            variants={container}
            initial="hidden"
            animate="show"
        >
            <div className="col-span-3 w-full p-12">
                <div className="flex flex-col sm:flex-row flex-1 px-12 justify-between mb-24 space-y-16 sm:space-y-0">
                    <div className="flex items-center w-full justify-between">
                        <div className="flex items-center">
                            {leftSidebarToggle && (
                                <div className="flex shrink-0 items-center mr-16 -m-12">
                                    <IconButton onClick={leftSidebarToggle}>
                                        <FuseSvgIcon>heroicons-outline:menu</FuseSvgIcon>
                                    </IconButton>
                                </div>
                            )}
                            <div>
                                <Typography className="text-2xl font-extrabold tracking-tight leading-tight">
                                    Concepto: Coste horas operario servicio
                                </Typography>
                                <div className="mt-2 font-medium">
                                    <Typography>Registro en base de datos para cálculos.</Typography>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center">
                            {rightSidebarToggle && (
                                <div className="flex shrink-0 items-center -m-12">
                                    <Chip
                                        label={
                                            <Typography className="ml-8">
                                                Histórico concepto
                                            </Typography>
                                        }
                                        onClick={rightSidebarToggle}
                                        icon={<FuseSvgIcon size={20}>{rightSidebarOpen ? 'feather:eye-off' : 'feather:eye'}</FuseSvgIcon>}
                                        className="px-12"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <motion.div variants={item1} className="w-full">
                    <Paper className="flex flex-col shadow rounded-2xl overflow-hidden pl-24 pr-24 sm:pr-8 pt-24 pb-4">
                        <div className="flex justify-end">
                            <Button
                                onClick={anadirFila}
                                color="primary"
                                variant="outlained"
                                startIcon={<FuseSvgIcon size={20}>heroicons-outline:plus-circle</FuseSvgIcon>}
                                size="small"
                                className="-mt-8 mr-8 px-16 mb-16"
                            >
                                Añadir fila
                            </Button>
                        </div>
                        {productosControllers.length === 0 ? (
                            <div className="flex flex-1 items-center justify-center h-full pb-20">
                                <Typography color="text.secondary" variant="h5">
                                    No hay registros
                                </Typography>
                            </div>
                        ) : (
                            productosControllers.map((producto, index) => {
                                return (
                                    <FilaMod4
                                        key={'prod' + index}
                                        index={index}
                                        producto={producto}
                                        registrarFila={(productoRetornado) => {
                                            registrarFila(productoRetornado)
                                        }}
                                        borrarFila={(id, index) => {
                                            borrarFila(id, index)
                                        }}
                                    />
                                )
                            })
                        )}
                    </Paper>
                </motion.div>
            </div>
        </motion.div>
    )
}

export default DatosMod4;
