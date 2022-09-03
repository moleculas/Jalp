import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import * as yup from 'yup';
import _ from '@lodash';
import Checkbox from '@mui/material/Checkbox/Checkbox';
import IconButton from '@mui/material/IconButton';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import InputAdornment from '@mui/material/InputAdornment';
import Autocomplete from '@mui/material/Autocomplete/Autocomplete';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import { motion } from 'framer-motion';

//constantes
import { usuarioRoles } from 'app/auth/authRoles';

//importaciones acciones
import { registrarUsuario } from 'app/redux/registrar-usuario/registrarUsuarioSlice';
import { setUsuarioRegistrado } from 'app/redux/registrar-usuario/registrarUsuarioSlice';
import { closeDialog, openDialog } from 'app/redux/fuse/dialogSlice';


/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  displayName: yup.string().required('Debes ingresar nombre y apellidos'),
  email: yup.string().email('Debes ingresar un correo electrónico válido').required('Debes ingresar un correo electrónico'),
  password: yup
    .string()
    .required('Por favor, introduce la contraseña')
    .min(8, 'La contraseña es demasiado corta; debe tener al menos 8 caracteres'),
  passwordConfirm: yup.string().oneOf([yup.ref('password'), null], 'Las contraseñas deben coincidir'),
  rol: yup.array().min(1, "at least 1").required('Debes seleccionar un rol'),
});

const defaultValues = {
  displayName: '',
  email: '',
  password: '',
  passwordConfirm: '',
};

function RegistrarUsuarioTab() {
  const dispatch = useDispatch();
  const { usuario } = useSelector((state) => state.registrarUsuario.registrarUsuario);
  const { control, formState, handleSubmit, reset } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });
  const { isValid, dirtyFields, errors, setError } = formState;
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const container = {
    show: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0 },
  };

  //useEffect

  useEffect(() => {
    if (usuario.displayName) {
      dialogRespuesta(usuario);
      dispatch(setUsuarioRegistrado({}));
    };
  }, [usuario]);

  //funciones

  function onSubmit({ displayName, password, email, rol }) {
    reset(defaultValues);
    dispatch(registrarUsuario(displayName, password, email, rol));
  };

  const dialogRespuesta = (usuario) => {
    dispatch(
      openDialog({
        children: (
          <>
            <DialogTitle>Usuario registrado</DialogTitle>
            <DialogContent>
              <DialogContentText>
                <span>Se ha registrado un usuario en la aplicación con los siguientes datos: </span><br /><br />
                <span><b>Nombre: </b>{usuario.displayName}</span><br />
                <span><b>Email: </b>{usuario.email}</span><br />
                <span><b>Rol: </b>{usuario.role.join(', ')}</span>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  dispatch(closeDialog());
                }}
                color="primary"
                autoFocus
              >
                De acuerdo
              </Button>
            </DialogActions>
          </>
        ),
      })
    );
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="container">
      <motion.div className="p-10 sm:p-10" variants={item}>
        <div className="grid grid-cols-1">
          <Typography className="text-2xl font-extrabold tracking-tight leading-tight">
            Formulario de registro
          </Typography>
          <div className="mt-2 mb-40 font-medium">
            <Typography>Registro de nuevos usuarios. Introduce los datos a continuación.</Typography>
          </div>
        </div>
        <div className="grid grid-cols1 sm:grid-cols-2">
          <form
            name="registerForm"
            noValidate
            className="w-full"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Controller
              name="displayName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-32"
                  label="Nombre y apellidos"
                  autoFocus
                  type="name"
                  error={!!errors.displayName}
                  helperText={errors?.displayName?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-32"
                  label="Email"
                  type="email"
                  error={!!errors.email}
                  helperText={errors?.email?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-32"
                  label="Contraseña"
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
                  className="mb-32"
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
            <Controller
              control={control}
              name="rol"
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  multiple
                  id="rol"
                  className="mb-32"
                  options={usuarioRoles}
                  disableCloseOnSelect
                  getOptionLabel={(option) => option.label}
                  renderOption={(_props, option, { selected }) => (
                    <li {..._props}>
                      <Checkbox style={{ marginRight: 8 }} checked={selected} />
                      {option.label}
                    </li>
                  )}
                  value={value ? value.map((valor) => _.find(usuarioRoles, { valor })) : []}
                  onChange={(event, newValue) => {
                    onChange(newValue.map((item) => item.valor));
                  }}
                  fullWidth
                  renderInput={(params) => <TextField {...params} label="Rol" placeholder="Rol" />}
                />
              )}
            />
            <Button
              variant="contained"
              color="secondary"
              className="w-full mt-12"
              disabled={_.isEmpty(dirtyFields) || !isValid}
              type="submit"
              size="large"
            >
              Registrar usuario
            </Button>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RegistrarUsuarioTab;
