import IconButton from '@mui/material/IconButton';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { styled } from '@mui/material/styles';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import EscandalloForm from './tabs/cubicaje-tacos/EscandalloForm';
import { useDispatch, useSelector } from 'react-redux';

//importación acciones
import {
    setOpenFormEscandallo,
    selectOpenFormEscandallo
} from 'app/redux/produccion/produccionSlice';

const StyledSwipeableDrawer = styled(SwipeableDrawer)(({ theme }) => ({
    '& .MuiDrawer-paper': {
        backgroundColor: theme.palette.background,
        width: 640,
        height: 'calc(100% - 165px)',
        top: 165,
        borderLeft: '1px solid rgb(226, 232, 240)',
    },
}));

function ProduccionSidebarContenedor(props) {
    const dispatch = useDispatch();
    const openFormEscandallo = useSelector(selectOpenFormEscandallo);

    return (
        <>
            <StyledSwipeableDrawer
                open={openFormEscandallo ? true : false}
                anchor="right"
                onOpen={(ev) => { }}
                onClose={() => dispatch(setOpenFormEscandallo(false))}
                disableSwipeToOpen
                BackdropProps={{ invisible: true }}
                elevation={0}
            >
                <div className="flex items-center justify-end w-full border-b-1 mb-32">
                    <IconButton className="mb-11 mt-11 mr-16" size="large"
                        onClick={() => dispatch(setOpenFormEscandallo(false))}>
                        <FuseSvgIcon>heroicons-outline:x</FuseSvgIcon>
                    </IconButton>
                </div>
                <EscandalloForm />
            </StyledSwipeableDrawer>
        </>
    );
}

export default ProduccionSidebarContenedor;