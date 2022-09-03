import FuseScrollbars from '@fuse/core/FuseScrollbars';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import withReducer from 'app/redux/withReducer';
import { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import reducer from 'app/redux/userPanel';

//importación acciones
import {
    closeUserPanel,
    setPanelFormActivo,
    setPanelPassActivo
} from 'app/redux/userPanel/userPanelSlice';

//componentes
import UserView from './UserView';
import UserForm from './UserForm';
import UserPass from './UserPass';

const StyledSwipeableDrawer = styled(SwipeableDrawer)(({ theme }) => ({
    '& .MuiDrawer-paper': {
        backgroundColor: theme.palette.background,
        width: 640,
        height: 'calc(100% - 64px)',
        top: 64,
        borderLeft: '1px solid rgb(226, 232, 240)',
        borderTop: '1px solid rgb(226, 232, 240)',
    },
}));

function UserPanel(props) {
    const dispatch = useDispatch();
    const {
        panelActivo,
        panelFormActivo,
        panelPassActivo
    } = useSelector((state) => state.userPanelSlice.userPanelSlice);

    //useEffect

    //funciones

    const handleClose = () => {
        dispatch(closeUserPanel());
        dispatch(setPanelFormActivo(false));
        dispatch(setPanelPassActivo(false));
    };

    const retornaPanel = () => {
        if (panelFormActivo) {
            return <UserForm />
        } else if (panelPassActivo) {
            return <UserPass />
        } else {
            return <UserView />
        };
    };

    return (
        <StyledSwipeableDrawer
            open={panelActivo}
            anchor="right"
            onOpen={(ev) => { }}
            onClose={handleClose}
            disableSwipeToOpen
            BackdropProps={{ invisible: true }}
            elevation={0}
        >
            <IconButton className="m-4 absolute top-0 right-0 z-999" onClick={handleClose} size="large">
                <FuseSvgIcon color="action">heroicons-outline:x</FuseSvgIcon>
            </IconButton>
            <FuseScrollbars>
                {retornaPanel()}
            </FuseScrollbars>
        </StyledSwipeableDrawer>
    );
}

export default withReducer('userPanelSlice', reducer)(memo(UserPanel));
