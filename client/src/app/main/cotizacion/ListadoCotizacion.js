
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import FuseLoading from '@fuse/core/FuseLoading';
import _ from '@lodash';
import { motion } from 'framer-motion';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import format from 'date-fns/format';
import { es } from 'date-fns/locale';
import Typography from '@mui/material/Typography';

//importacion acciones
import {
    selectCotizaciones,
    getCotizaciones,
    deleteCotizacion,
    vaciarDatosGeneral,
    getCotizacion,
    setOpenFormCotizacion,
    setCotizaciones
} from 'app/redux/produccion/cotizacionSlice';
import { formateado } from 'app/logica/produccion/logicaProduccion';

const ListadoCotizacion = (props) => {
    const dispatch = useDispatch();
    const cotizaciones = useSelector(selectCotizaciones);

    //useEffect

    useEffect(() => {
        if (!cotizaciones) {
            dispatch(getCotizaciones());
        };
    }, [cotizaciones]);

    //funciones

    const borrarCotizacion = (id) => {
        dispatch(deleteCotizacion(id)).then(() => {
            dispatch(getCotizaciones());
        });
    };

    const cargarCotizacion = (id) => {
        dispatch(vaciarDatosGeneral(false));
        dispatch(getCotizacion(id)).then(() => {
            dispatch(setOpenFormCotizacion(false));
            dispatch(setCotizaciones(null));
        });
    };

    if (!cotizaciones) {
        return <FuseLoading />;
    };

    return (
        <>
            <motion.div
                initial={{ y: 50, opacity: 0.8 }}
                animate={{ y: 0, opacity: 1, transition: { delay: 0.3 } }}
            >
                {cotizaciones.length === 0 ? (
                    <div className="flex flex-1 items-center justify-center h-full">
                        <Typography color="text.secondary" variant="h5">
                            No hay registros
                        </Typography>
                    </div>
                ) : (
                    <div className="w-full px-16">
                        <List>
                            {cotizaciones.map((cotizacion, index) => {
                                return (
                                    <ListItem
                                        className="bg-gray-50 mb-4 py-16"
                                        key={index}
                                        secondaryAction={
                                            <>
                                                <Button
                                                    size='small'
                                                    className="mr-8"
                                                    color='primary'
                                                    onClick={() => cargarCotizacion(cotizacion._id)}
                                                >
                                                    <span className="text-sm">Cargar</span>
                                                </Button>
                                                <Button
                                                    size='small'
                                                    color='error'
                                                    onClick={() => borrarCotizacion(cotizacion._id)}
                                                >
                                                    <span className="text-sm">Borrar</span>
                                                </Button>
                                            </>
                                        }
                                    >
                                        <ListItemText
                                            primary={
                                                <>
                                                    <span className="font-bold">OF: </span>
                                                    {cotizacion.of} - {_.capitalize(cotizacion.cliente)} - {format(new Date(cotizacion.fecha), 'dd/MM/yyyy', { locale: es })} -
                                                    <span className="font-bold"> PV: </span>
                                                    {formateado(cotizacion.precio_venta_total)} €
                                                </>
                                            }
                                            secondary={
                                                <>
                                                    {cotizacion.descripcion}
                                                </>
                                            }
                                        />
                                    </ListItem>
                                )
                            })}
                        </List>
                    </div>
                )}
            </motion.div>
        </>
    );
};

export default ListadoCotizacion;
