import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Box } from '@mui/system';
import Button from '@mui/material/Button';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import _ from '@lodash';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router';
import history from '@history';
import Card from '@mui/material/Card';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

//importación acciones
import {
    selectSelectedItemAEditar,
    setSelectedButton,
    setSelectedItemAEditar,
    selectPath,
    addFile,
    updateFile,
    fileAActualizar,
    setFileAActualizar
} from 'app/redux/file-manager/itemsSlice';
import { selectUser } from 'app/redux/userSlice';
import { getFile } from 'app/logica/gestionArchivos';

//constantes
import { SUPPORTED_FORMATS, RUTA_SERVER } from 'constantes';
const FILE_SIZE = 50000000; //50MB

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
    nameFile: yup.string().required('Debes introducir un nombre'),
    file: yup
        .mixed()
        .required("Se requiere un archivo")
        .test(
            "fileSize",
            "Archivo demasiado pesado",
            value => value && value.size <= FILE_SIZE
        )
        .test(
            "fileFormat",
            "Formato no soportado",
            value => value && SUPPORTED_FORMATS.includes(value.type)
        )
});

function FormFileManagerFile(props) {
    const dispatch = useDispatch();
    const path = useSelector(selectPath);
    const user = useSelector(selectUser);
    const prevLocation = useLocation().pathname;
    const selectedItemAEditar = useSelector(selectSelectedItemAEditar);
    const elFileAActualizar = useSelector(fileAActualizar);
    let defaultValues;
    if (selectedItemAEditar) {
        defaultValues = {
            nameFile: selectedItemAEditar.name,
            description: selectedItemAEditar.description,
            file: null
        };
    } else {
        defaultValues = {
            nameFile: '',
            description: '',
            file: null
        };
    };
    const { control, formState, handleSubmit, reset, setValue, setError } = useForm({
        mode: 'onChange',
        defaultValues,
        resolver: yupResolver(schema),
    });
    const { isValid, dirtyFields, errors } = formState;
    const [formOpen, setFormOpen] = useState(selectedItemAEditar ? true : false);
    const [elFile, setElFile] = useState(null);
    const [cambiadoFileEdicion, setCambiadoFileEdicion] = useState(false);

    //useEffect

    useEffect(() => {
        const unlisten = history.listen((location, action) => {
            if (location.pathname !== prevLocation) {
                dispatch(setSelectedButton(null))
            };
        });
        return () => {
            unlisten();
        };
    }, [location.pathname]);

    useEffect(() => {
        if (selectedItemAEditar) {
            const ruta = RUTA_SERVER + selectedItemAEditar.ruta;
            dispatch(getFile(ruta, selectedItemAEditar.nameServer));
        };
    }, []);

    useEffect(() => {
        if (elFileAActualizar) {
            setValue('file', elFileAActualizar, { shouldDirty: true });
            dispatch(setFileAActualizar(null));
        };
    }, [elFileAActualizar]);

    //funciones

    function onSubmit({ nameFile, description, file }) {
        const objetoPath = devuelvePath();
        let objetoAretornar = {
            name: nameFile.charAt(0).toUpperCase() + nameFile.slice(1),
            folderId: objetoPath.folderId,
            createdBy: user.data.displayName,
            description: description,
            ruta: objetoPath.ruta
        };
        reset(defaultValues);
        if (selectedItemAEditar) {
            if (elFile) {
                objetoAretornar = {
                    ...objetoAretornar,
                    id: selectedItemAEditar.id,
                    nameServer: elFile.name,
                    size: (elFile.size / 1024).toFixed(1) + " KB",
                    type: retornaFileType(),
                    file: elFile
                };
            } else {
                objetoAretornar = {
                    ...objetoAretornar,
                    id: selectedItemAEditar.id,
                    nameServer: selectedItemAEditar.nameServer,
                    size: selectedItemAEditar.size,
                    type: selectedItemAEditar.type
                };
            };
            dispatch(updateFile(objetoAretornar));
            dispatch(setSelectedItemAEditar(null));
        } else {
            objetoAretornar = {
                ...objetoAretornar,
                nameServer: elFile.name,
                size: (elFile.size / 1024).toFixed(1) + " KB",
                type: retornaFileType(),
                file: elFile
            };
            dispatch(addFile(objetoAretornar));
            dispatch(setSelectedButton(null));
        };
    };

    const devuelvePath = () => {
        let objetoDevuelto = {};
        let arrayRuta = [];
        let elFolderId;
        if (path.length > 0) {
            path.forEach((objeto, index) => {
                arrayRuta.push(objeto.nameServer);
            });
            elFolderId = path[path.length - 1].id;
            const stringRuta = arrayRuta.join('/');
            objetoDevuelto = { ruta: stringRuta, folderId: elFolderId };
        } else {
            objetoDevuelto = { ruta: null, folderId: null };
        };
        return objetoDevuelto
    };

    const retornaFileType = () => {
        switch (elFile.type) {
            case "image/jpg":
            case "image/jpeg":
                return "JPG"
                break;
            case "image/gif":
                return "GIF"
                break;
            case "application/pdf":
                return "PDF"
                break;
            case "image/png":
                return "PNG"
                break;
            case "application/msword":
            case "application/vnd.oasis.opendocument.text":
            case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            case "application/rtf":
                return "DOC"
                break;
            case "video/mp4":
                return "MP4"
                break;
            case "application/vnd.ms-excel":
            case "application/vnd.oasis.opendocument.spreadsheet":
            case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                return "XLS"
                break;
            case "application/vnd.ms-powerpoint":
            case "application/vnd.oasis.opendocument.presentation":
            case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
                return "PPT"
                break;
            case "text/plain":
                return "TXT"
                break;
            case "application/zip":
            case "application/vnd.rar":
                return "ZIP"
                break;
            default:
        };
    };

    function handleOpenForm(ev) {
        ev.stopPropagation();
        setFormOpen(true);
    };

    function handleCloseForm() {
        setFormOpen(false);
    };

    const retornaValorInputFile = () => {
        elFile && elFile.name ? elFile.name : ""
        if (selectedItemAEditar) {
            if (elFile) {
                return elFile.name
            } else {
                if (cambiadoFileEdicion) {
                    return ""
                } else {
                    return selectedItemAEditar.nameServer
                };
            };
        } else {
            if (elFile) {
                return elFile.name
            } else {
                return ""
            };
        };
    };

    return (
        <>
            <motion.div
                initial={{ y: 50, opacity: 0.8 }}
                animate={{ y: 0, opacity: 1, transition: { delay: 0.3 } }}
            >
                <div className="file-details px-24 sm:px-32">
                    <Typography className="text-2xl font-extrabold tracking-tight leading-none">
                        {selectedItemAEditar ? 'Actualizar archivo' : 'Subir archivo'}
                    </Typography>
                    <Controller
                        name="nameFile"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                className="mb-32 mt-32"
                                label="Nombre"
                                id="nameFile"
                                autoFocus={selectedItemAEditar ? false : true}
                                type="text"
                                error={!!errors.nameFile}
                                helperText={errors?.nameFile?.message}
                                variant="outlined"
                                required
                                fullWidth
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="description"
                        render={({ field }) => (
                            <TextField
                                className="mb-32"
                                {...field}
                                label="Descripción"
                                placeholder="Descripción"
                                id="description"
                                error={!!errors.description}
                                helperText={errors?.description?.message}
                                variant="outlined"
                                fullWidth
                                multiline
                                minRows={4}
                                InputProps={{
                                    className: 'max-h-min h-min items-start',
                                    startAdornment: (
                                        <InputAdornment className="mt-16" position="start">
                                            <FuseSvgIcon size={20}>heroicons-solid:menu-alt-2</FuseSvgIcon>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        )}
                    />
                    <Card
                        className="w-full rounded-md shadow-0 !border-black/[.25] border-1 hover:border-black"
                        square
                    >
                        {formOpen ? (
                            <ClickAwayListener onClickAway={handleCloseForm}>
                                <div className="p-12">
                                    <Controller
                                        name="inputGhost"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                className="mb-16"
                                                fullWidth
                                                variant="filled"
                                                label="Archivo"
                                                autoFocus
                                                disabled
                                                value={retornaValorInputFile()}
                                                error={!!errors.file}
                                                helperText={errors?.file?.message}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                onClick={() => {
                                                                    handleCloseForm(),
                                                                        setElFile(null),
                                                                        //setError('file', '')
                                                                        reset({
                                                                            nameFile: nameFile.value,
                                                                            description: description.value,
                                                                            file: null
                                                                        });
                                                                    selectedItemAEditar && (setCambiadoFileEdicion(true));
                                                                }}
                                                                size="large">
                                                                <FuseSvgIcon size={18}>heroicons-outline:x</FuseSvgIcon>
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        )}
                                    />
                                    <div className="flex justify-between items-center">
                                        <label htmlFor="file">
                                            <input
                                                //accept=".gif,.jpg,.jpeg,.png,.doc,.docx,.pdf,.txt"
                                                name="file"
                                                className="hidden"
                                                id="file"
                                                type="file"
                                                onChange={async (e) => {
                                                    function readFileAsync() {
                                                        return new Promise((resolve, reject) => {
                                                            const preFile = e.target.files[0];
                                                            const file = new File(
                                                                [preFile], 
                                                                _.deburr(preFile.name).replaceAll(" ", "-").toLowerCase(), 
                                                                { type: preFile.type }
                                                                );
                                                            if (!file) {
                                                                return;
                                                            }
                                                            const reader = new FileReader();
                                                            reader.onload = () => {
                                                                resolve(file);
                                                                setElFile(file);
                                                            };
                                                            reader.onerror = reject;
                                                            reader.readAsDataURL(file);
                                                        });
                                                    };
                                                    const newFile = await readFileAsync();
                                                    setValue('file', newFile, { shouldDirty: true, shouldValidate: true });
                                                    selectedItemAEditar && (setCambiadoFileEdicion(true));
                                                }}
                                            />
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                disabled={false}
                                                size="small"
                                                component="span"
                                            >
                                                Añadir archivo
                                            </Button>
                                        </label>
                                    </div>
                                </div>
                            </ClickAwayListener>
                        ) : (
                            <Button
                                onClick={handleOpenForm}
                                classes={{
                                    root: 'font-medium w-full rounded-lg p-24 justify-start',
                                }}
                                startIcon={<FuseSvgIcon>heroicons-outline:plus-circle</FuseSvgIcon>}
                                sx={{ color: 'text.secondary' }}
                            >
                                Añadir archivo
                            </Button>
                        )}
                    </Card>
                </div>
            </motion.div>
            <Box
                className="flex items-center mt-40 py-14 pr-16 pl-4 sm:pr-48 sm:pl-36 border-t absolute bottom-0 w-full"
                sx={{ backgroundColor: 'background.default' }}
            >
                <Button className="ml-auto"
                    onClick={() => selectedItemAEditar ? dispatch(setSelectedItemAEditar(null)) : dispatch(setSelectedButton(null))}
                >
                    Cancelar
                </Button>
                <Button
                    className="ml-8"
                    variant="contained"
                    color="secondary"
                    disabled={_.isEmpty(dirtyFields) || !isValid}
                    onClick={handleSubmit(onSubmit)}
                >
                    {selectedItemAEditar ? 'Actualizar archivo' : 'Subir archivo'}
                </Button>
            </Box>
            {/* {console.log(elFile)} */}
        </>
    );
}

export default FormFileManagerFile;
