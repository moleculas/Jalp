import IconButton from '@mui/material/IconButton';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { styled } from '@mui/material/styles';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { useDispatch, useSelector } from 'react-redux';
import ListadoCotizacion from './ListadoCotizacion';

//importación acciones
import {
    setOpenFormCotizacion,
    selectOpenFormCotizacion,
    setCotizaciones
} from 'app/redux/produccion/cotizacionSlice';


const StyledSwipeableDrawer = styled(SwipeableDrawer)(({ theme }) => ({
    '& .MuiDrawer-paper': {
        backgroundColor: theme.palette.background,
        borderLeft: '1px solid rgb(226, 232, 240)',
    },
}));

function CotizacionSidebarContenedor(props) {
    const dispatch = useDispatch();
    const openFormCotizacion = useSelector(selectOpenFormCotizacion);

    //funciones

    const cerrarSwipe = () => {
        dispatch(setOpenFormCotizacion(false));
        dispatch(setCotizaciones(null));
    };

    return (
        <>
            <StyledSwipeableDrawer
                open={openFormCotizacion ? true : false}
                anchor="right"
                onOpen={(ev) => { }}
                onClose={cerrarSwipe}
                disableSwipeToOpen
                BackdropProps={{ invisible: true }}
                elevation={0}
                sx={{
                    '& .MuiDrawer-paper': {
                        height: {
                            sm: '100%',
                            md: 'calc(100% - 165px)'
                        },
                        top: {
                            sm: 0,
                            md: 165
                        },
                        width: {
                            sm: '100%',
                            md: 640
                        }
                    },
                }}
            >
                <div className="flex items-center justify-end w-full border-b-1 mb-32">
                    <IconButton className="mb-11 mt-11 mr-16" size="large"
                        onClick={cerrarSwipe}>
                        <FuseSvgIcon>heroicons-outline:x</FuseSvgIcon>
                    </IconButton>
                </div>
                <ListadoCotizacion />
            </StyledSwipeableDrawer>
        </>
    );
}

export default CotizacionSidebarContenedor;