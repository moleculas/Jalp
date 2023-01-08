import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import { forwardRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import PdfCotizacion from '../cotizacion/PdfCotizacion';

//importacion acciones
import {
    closeDialogPdf,
    selectDialogPdfId
} from 'app/redux/fuse/pdfSlice';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function DialogPdf(props) {
    const dispatch = useDispatch();
    const dialogPdfId = useSelector(selectDialogPdfId);

    //funciones    

    const retornaPdf = (tipo) => {
        let componente, titulo;
        switch (dialogPdfId) {
            case 'cotizacion':
                componente = <PdfCotizacion />;
                titulo = "Cotización";
                break;
            default:
        };
        if (tipo === "titulo") {
            return titulo
        };
        if (tipo === "componente") {
            return componente
        };
    };

    if (!dialogPdfId) {
        return null;
    };

    return (
        <Dialog
            classes={{
                paper: 'rounded-none',
            }}
            fullScreen
            TransitionComponent={Transition}
            onClose={(ev) => dispatch(closeDialogPdf())}
            open={Boolean(dialogPdfId)}
        >
            <AppBar sx={{ position: 'relative' }} color="secondary">
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={(ev) => dispatch(closeDialogPdf())}
                    >
                        <FuseSvgIcon>heroicons-outline:x</FuseSvgIcon>
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        {retornaPdf("titulo")}
                    </Typography>
                    <Button autoFocus color="inherit" onClick={(ev) => dispatch(closeDialogPdf())}>
                        Cerrar
                    </Button>
                </Toolbar>
            </AppBar>
            {retornaPdf("componente")}
        </Dialog>
    );
}

export default DialogPdf;
