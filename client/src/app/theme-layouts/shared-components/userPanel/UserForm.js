import { useState } from 'react';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import FuseLoading from '@fuse/core/FuseLoading';
import _ from '@lodash';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import Box from '@mui/system/Box';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import DatePicker from '@mui/lab/DatePicker';

//importacion acciones
import { selectUser, actualizarUsuario } from 'app/redux/userSlice';
import { setPanelFormActivo } from 'app/redux/userPanel/userPanelSlice';

//componentes
import PhoneNumberSelector from './phone-number-selector/PhoneNumberSelector';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
    displayName: yup.string().required('Debes ingresar nombre y apellidos'),
    email: yup.string().email('Debes ingresar un correo electrónico válido').required('Debes ingresar un correo electrónico'),
});

const UserForm = (props) => {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const defaultValues = {
        displayName: user.data.displayName,
        photoURL: user.data.photoURL,
        email: user.data.email,
        telefono: user.data.telefono,
        direccion: user.data.direccion,
        fechaNacimiento: user.data.fechaNacimiento ? new Date(user.data.fechaNacimiento) : null,
        descripcion: user.data.descripcion
    };
    const { control, watch, reset, handleSubmit, formState, getValues } = useForm({
        mode: 'onChange',
        defaultValues,
        resolver: yupResolver(schema),
    });
    const { isValid, dirtyFields, errors } = formState;
    const [elFile, setElFile] = useState(null);

    //useEffect

    //funciones

    function onSubmit(data) {
        const losDatos = {
            id: user.data.id,
            displayName: data.displayName,
            email: data.email
        };
        let file = null;
        elFile && (file = elFile);
        data.telefono.length > 0 && (losDatos['telefono'] = data.telefono);
        data.direccion && (losDatos['direccion'] = data.direccion);
        data.fechaNacimiento && (losDatos['fechaNacimiento'] = data.fechaNacimiento);
        data.descripcion && (losDatos['descripcion'] = data.descripcion);
        dispatch(actualizarUsuario(losDatos, file)).then(() => {
            dispatch(setPanelFormActivo(false));
        });
    };

    if (!user) {
        return <FuseLoading />;
    };

    return (
        <>
            <Box
                className="relative w-full h-60 sm:h-92 px-32 sm:px-48"
                sx={{
                    backgroundColor: 'background.default',
                    //boxShadow: 'inset 0px 7px 3px -4px rgba(0,0,0,0.1)',
                }}
            >
            </Box>
            <div className="relative flex flex-col flex-auto items-center px-24 sm:px-48">
                <div className="w-full">
                    <div className="flex flex-auto items-end -mt-64">
                        <Controller
                            control={control}
                            name="photoURL"
                            render={({ field: { onChange, value } }) => (
                                <Box
                                    sx={{
                                        borderWidth: 4,
                                        borderStyle: 'solid',
                                        borderColor: 'background.paper',
                                    }}
                                    className="relative flex items-center justify-center w-128 h-128 rounded-full overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-black bg-opacity-50 z-10" />
                                    <div className="absolute inset-0 flex items-center justify-center z-20">
                                        <div>
                                            <label htmlFor="button-avatar" className="flex p-8 cursor-pointer">
                                                <input
                                                    accept="image/*"
                                                    className="hidden"
                                                    id="button-avatar"
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
                                                                    //resolve(`data:${file.type};base64,${btoa(reader.result)}`);
                                                                    resolve(URL.createObjectURL(file));
                                                                    setElFile(file);
                                                                };
                                                                reader.onerror = reject;
                                                                //reader.readAsBinaryString(file);
                                                                reader.readAsDataURL(file);
                                                            });
                                                        };
                                                        const newImage = await readFileAsync();
                                                        onChange(newImage);
                                                    }}
                                                />
                                                <FuseSvgIcon className="text-white">heroicons-outline:camera</FuseSvgIcon>
                                            </label>
                                        </div>
                                        <div>
                                            <IconButton
                                                onClick={() => {
                                                    onChange('');
                                                }}
                                            >
                                                <FuseSvgIcon className="text-white">heroicons-solid:trash</FuseSvgIcon>
                                            </IconButton>
                                        </div>
                                    </div>
                                    <Avatar
                                        sx={{
                                            backgroundColor: 'background.default',
                                            color: 'text.secondary',
                                        }}
                                        className="object-cover w-full h-full text-64 font-bold"
                                        src={value}
                                        alt={user.data.displayName}
                                    >
                                        {user.data.displayName.charAt(0)}
                                    </Avatar>
                                </Box>
                            )}
                        />
                    </div>
                </div>
                <Controller
                    control={control}
                    name="displayName"
                    render={({ field }) => (
                        <TextField
                            className="mt-32"
                            {...field}
                            label="Nombre y apellidos"
                            placeholder="Nombre y apellidos"
                            id="displayName"
                            error={!!errors.displayName}
                            helperText={errors?.displayName?.message}
                            variant="outlined"
                            required
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FuseSvgIcon size={20}>heroicons-solid:user-circle</FuseSvgIcon>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="email"
                    render={({ field }) => (
                        <TextField
                            className="mt-32"
                            {...field}
                            label="Email"
                            placeholder="Email"
                            id="email"
                            error={!!errors.email}
                            helperText={errors?.email?.message}
                            variant="outlined"
                            required
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FuseSvgIcon size={20}>heroicons-solid:mail</FuseSvgIcon>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="telefono"
                    render={({ field }) => <PhoneNumberSelector className="mt-32" {...field} />}
                />
                <Controller
                    control={control}
                    name="direccion"
                    render={({ field }) => (
                        <TextField
                            className="mt-32"
                            {...field}
                            label="Dirección"
                            placeholder="Dirección"
                            id="direccion"
                            error={!!errors.direccion}
                            helperText={errors?.address?.direccion}
                            variant="outlined"
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FuseSvgIcon size={20}>heroicons-solid:location-marker</FuseSvgIcon>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="fechaNacimiento"
                    render={({ field }) => (
                        <DatePicker
                            {...field}
                            className="mt-8 mb-16 w-full"
                            clearable
                            showTodayButton
                            inputFormat='dd/MM/yyyy'
                            renderInput={(_props) => (
                                <TextField
                                    {..._props}
                                    className="mt-32"
                                    id="fechaNacimiento"
                                    label="Fecha nacimiento"
                                    type="date"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    variant="outlined"
                                    fullWidth
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <FuseSvgIcon size={20}>heroicons-solid:cake</FuseSvgIcon>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            )}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="descripcion"
                    render={({ field }) => (
                        <TextField
                            className="mt-32"
                            {...field}
                            label="Notas"
                            placeholder="Notas"
                            id="descripcion"
                            error={!!errors.descripcion}
                            helperText={errors?.notes?.descripcion}
                            variant="outlined"
                            fullWidth
                            multiline
                            minRows={5}
                            maxRows={10}
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
            </div>
            <Box
                className="flex items-center mt-40 py-14 pr-16 pl-4 sm:pr-48 sm:pl-36 border-t"
                sx={{ backgroundColor: 'background.default' }}
            >
                <Button
                    className="ml-auto"
                    onClick={() => dispatch(setPanelFormActivo(false))}
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
                    Actualizar
                </Button>
            </Box>
        </>
    );
};

export default UserForm;
