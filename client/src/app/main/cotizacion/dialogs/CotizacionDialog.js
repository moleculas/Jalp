import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import { forwardRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MermaCuerpoCotDialog from './MermaCuerpoCotDialog';
import ClavosCotDialog from './ClavosCotDialog';

//importacion acciones
import {
    closeNoteDialog,
    selectNoteDialogId,
    selectMermaIndex
} from 'app/redux/produccion/cotizacionSlice';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function CotizacionDialog(props) {
    const dispatch = useDispatch();
    const noteDialogId = useSelector(selectNoteDialogId);
    const mermaIndex = useSelector(selectMermaIndex);

    //funciones

    const retornaDialog = () => {
        switch (noteDialogId) {
            case 'mermaCuerpo':
                return (<MermaCuerpoCotDialog index={mermaIndex} />)
                break;
            case 'clavos':
                return (<ClavosCotDialog />)
                break;
            case 'corte_madera':

                break;
            case 'montaje':

                break;
            case 'patines':

                break;
            case 'transporte':

                break;
            case 'tratamiento':

                break;
            case 'merma':

                break;
            default:
        };
    };

    if (!noteDialogId) {
        return null;
    };

    return (
        <Dialog
            classes={{
                paper: 'w-full m-24',
            }}
            fullWidth={true}
            maxWidth={
                (
                    noteDialogId === "mermaCuerpo" ||
                    noteDialogId === "clavos"
                )
                    ? 'md' : 'sm'}
            TransitionComponent={Transition}
            onClose={(ev) => dispatch(closeNoteDialog())}
            open={Boolean(noteDialogId)}
        >
            {retornaDialog()}
        </Dialog>
    );
}

export default CotizacionDialog;
