import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { lighten } from '@mui/material/styles';
import { Box } from '@mui/system';
import Button from '@mui/material/Button';
import { selectItemById } from 'app/redux/file-manager/itemsSlice';
import ItemIcon from './ItemIcon';
import format from 'date-fns/format';
import { es } from 'date-fns/locale';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { closeDialog, openDialog } from 'app/redux/fuse/dialogSlice';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';

//constantes
import { RUTA_SERVER } from "constantes";

//importaciones acciones
import { downloadFile } from 'app/logica/gestionArchivos';
import {
    setSelectedItem,
    setSelectedItemAEditar,
    removeFile
} from 'app/redux/file-manager/itemsSlice';

function DetailSidebarContentFile(props) {
    const dispatch = useDispatch();
    const item = useSelector((state) =>
        selectItemById(state, state.fileManagerApp.items.selectedItemId)
    );

    if (!item) {
        return null;
    };

    //funciones

    const descargarArchivo = () => {
        const ruta = RUTA_SERVER + item.ruta;
        dispatch(downloadFile(ruta, item.nameServer));
    };

    const actualizarArchivo = () => {
        dispatch(setSelectedItem(null));
        dispatch(setSelectedItemAEditar(item));
    };

    const borrarArchivo = () => {
        if (item.type === 'folder') {
            dispatch(
                openDialog({
                    children: (
                        <>
                            <DialogTitle id="alert-dialog-title">¿Estás seguro?</DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    Todos los elementos (archivos y carpetas) contenidos serán borrados.
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => dispatch(closeDialog())} color="primary">
                                    No
                                </Button>
                                <Button
                                    onClick={() => {
                                        dispatch(removeFile(item.id));
                                        dispatch(closeDialog());
                                        dispatch(setSelectedItem(null));
                                    }}
                                    color="primary"
                                    autoFocus
                                >
                                    Sí
                                </Button>
                            </DialogActions>
                        </>
                    ),
                })
            );
        } else {
            dispatch(setSelectedItem(null));
            dispatch(removeFile(item.id));
        };
    };

    return (
        <motion.div
            initial={{ y: 50, opacity: 0.8 }}
            animate={{ y: 0, opacity: 1, transition: { delay: 0.3 } }}
        >
            <div className="file-details p-24 sm:p-32">
                <Box
                    className=" w-full rounded-8 border preview h-128 sm:h-256 file-icon flex items-center justify-center my-32"
                    sx={{
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'light'
                                ? lighten(theme.palette.background.default, 0.4)
                                : lighten(theme.palette.background.default, 0.02),
                    }}
                >
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1, transition: { delay: 0.3 } }}>
                        <ItemIcon className="" type={item.type} />
                    </motion.div>
                </Box>
                <Typography className="text-18 font-medium">{item.name}</Typography>
                <div className="text-16 font-medium mt-32">Información</div>
                <div className="flex flex-col mt-16 border-t border-b divide-y font-medium">
                    <div className="flex items-center justify-between py-12">
                        <Typography color="text.secondary">Creado por</Typography>
                        <Typography>{item.createdBy}</Typography>
                    </div>
                    <div className="flex items-center justify-between py-12">
                        <Typography color="text.secondary">Creado el</Typography>
                        <Typography>{format(new Date(item.createdAt), 'dd/MM/yyyy, h:mm a', { locale: es })}</Typography>
                    </div>
                    <div className="flex items-center justify-between py-12">
                        <Typography color="text.secondary">Actualizado el</Typography>
                        <Typography>{format(new Date(item.updatedAt), 'dd/MM/yyyy, h:mm a', { locale: es })}</Typography>
                    </div>
                    {item.type !== 'folder' && (
                        <div className="flex items-center justify-between py-12">
                            <Typography color="text.secondary">Tamaño</Typography>
                            <Typography>{item.size}</Typography>
                        </div>
                    )}
                    {item.type !== 'folder' && (
                        <div className="flex items-center justify-between py-12">
                            <Typography color="text.secondary">Descargar archivo</Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                startIcon={<FuseSvgIcon size={20}>heroicons-outline:cloud-download</FuseSvgIcon>}
                                onClick={descargarArchivo}
                            >
                                Descargar
                            </Button>
                        </div>
                    )}
                </div>
                {item.description && (
                    <>
                        <div className="text-16 font-medium mt-32 pb-16 border-b">Descripción</div>
                        <Typography className="py-12">{item.description}</Typography>
                    </>
                )}
                <div className="grid grid-cols-2 gap-16 w-full mt-32">
                    <Button
                        className="flex-auto"
                        color="secondary"
                        variant="contained"
                        onClick={actualizarArchivo}
                    >
                        Actualizar
                    </Button>
                    <Button
                        className="flex-auto"
                        onClick={borrarArchivo}
                    >
                        Borrar
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}

export default DetailSidebarContentFile;
