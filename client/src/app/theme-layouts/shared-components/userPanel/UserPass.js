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
import Typography from '@mui/material/Typography';

//importacion acciones
import { selectUser, resetPassword } from 'app/redux/userSlice';
import { setPanelPassActivo } from 'app/redux/userPanel/userPanelSlice';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
    password: yup
        .string()
        .required('Por favor ingresa una contraseña')
        .min(8, 'La contraseña es demasiado corta; debe tener un mínimo de 8 caracteres'),
    passwordConfirm: yup.string().oneOf([yup.ref('password'), null], 'Las contraseñas deben coincidir'),
});

const defaultValues = {
    password: '',
    passwordConfirm: '',
};

const UserPass = (props) => {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const { control, watch, reset, handleSubmit, formState, getValues } = useForm({
        mode: 'onChange',
        defaultValues,
        resolver: yupResolver(schema),
    });
    const { isValid, dirtyFields, errors } = formState;
    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);

    //useEffect

    //funciones

    function onSubmit(data) {
        dispatch(resetPassword(user.data.email, data.password)).then(() => {
            dispatch(setPanelPassActivo(false));
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
                        <Avatar
                            sx={{
                                borderWidth: 4,
                                borderStyle: 'solid',
                                borderColor: 'background.paper',
                                backgroundColor: 'background.default',
                                color: 'text.secondary',
                            }}
                            className="w-128 h-128 text-64 font-bold"
                            src={user.data.photoURL}
                            alt={user.data.displayName}
                        >
                            {user.data.displayName.charAt(0)}
                        </Avatar>
                    </div>
                </div>
                <div className="w-full mt-36">
                    <Typography className="text-2xl font-extrabold tracking-tight leading-none mb-24">
                        Cambiar contraseña de acceso
                    </Typography>
                    <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                className="mb-24"
                                label="Nueva contraseña"
                                type={showPassword1 ? 'text' : 'password'}
                                error={!!errors.password}
                                helperText={errors?.password?.message}
                                variant="outlined"
                                required
                                fullWidth
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword1(!showPassword1)} edge="end">
                                                <FuseSvgIcon>{showPassword1 ? 'feather:eye' : 'feather:eye-off'}</FuseSvgIcon>
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        )}
                    />
                    <Controller
                        name="passwordConfirm"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                className="mb-24"
                                label="Contraseña (Confirma)"
                                type={showPassword2 ? 'text' : 'password'}
                                error={!!errors.passwordConfirm}
                                helperText={errors?.passwordConfirm?.message}
                                variant="outlined"
                                required
                                fullWidth
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword2(!showPassword2)} edge="end">
                                                <FuseSvgIcon>{showPassword2 ? 'feather:eye' : 'feather:eye-off'}</FuseSvgIcon>
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        )}
                    />
                </div>
            </div>
            <Box
                className="flex items-center mt-40 py-14 pr-16 pl-4 sm:pr-48 sm:pl-36 border-t absolute bottom-0 w-full"
                sx={{ backgroundColor: 'background.default' }}
            >
                <Button
                    className="ml-auto"
                    onClick={() => dispatch(setPanelPassActivo(false))}
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
                    Cambiar contraseña
                </Button>
            </Box>
        </>
    );
};

export default UserPass;
