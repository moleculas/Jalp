import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import { forwardRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MermaCuerpoCotDialog from './MermaCuerpoCotDialog';
import ClavosCotDialog from './ClavosCotDialog';
import CorteMaderaCotDialog from './CorteMaderaCotDialog';
import MontajeCotDialog from './MontajeCotDialog';
import PatinesCotDialog from './PatinesCotDialog';
import ProveedoresCuerpoCotDialog from './ProveedoresCuerpoCotDialog';
import TransporteCotDialog from './TransporteCotDialog';
import MedidasCuerpoCotDialog from './MedidasCuerpoCotDialog';

//importacion acciones
import {
    closeNoteDialog,
    selectNoteDialogId,
    selectDialogIndex
} from 'app/redux/produccion/cotizacionSlice';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function CotizacionDialog(props) {
    const dispatch = useDispatch();
    const noteDialogId = useSelector(selectNoteDialogId);
    const dialogIndex = useSelector(selectDialogIndex);

    //funciones

    const retornaDialog = () => {       
        switch (noteDialogId) {
            case 'mermaCuerpo':
                return (<MermaCuerpoCotDialog index={dialogIndex} />)
                break;
            case 'clavos':
                return (<ClavosCotDialog />)
                break;
            case 'corte_madera':
                return (<CorteMaderaCotDialog />)
                break;
            case 'montaje':
                return (<MontajeCotDialog />)
                break;
            case 'patines':
                return (<PatinesCotDialog />)
                break;
            case 'transporte':
                return (<TransporteCotDialog />)
                break;           
            case 'proveedores':
                return (<ProveedoresCuerpoCotDialog index={dialogIndex} />)
                break;
            case 'medidas':
                return (<MedidasCuerpoCotDialog index={dialogIndex} />)
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
                    noteDialogId === "clavos" ||
                    noteDialogId === "corte_madera" ||
                    noteDialogId === "montaje" ||
                    noteDialogId === "patines"
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
