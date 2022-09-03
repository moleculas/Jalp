import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
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
import FuseUtils from '@fuse/utils';
import { useLocation } from 'react-router';
import history from '@history';
import Typography from '@mui/material/Typography';

//importación acciones
import {
  selectSelectedItemAEditar,
  setSelectedButton,
  setSelectedItemAEditar,
  selectPath,
  addFile,
  updateFile
} from 'app/redux/file-manager/itemsSlice';
import { selectUser } from 'app/redux/userSlice';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  name: yup.string().required('Debes introducir un nombre'),
});

function FormFileManagerFolder(props) {
  const dispatch = useDispatch();
  const path = useSelector(selectPath);
  const user = useSelector(selectUser);
  const prevLocation = useLocation().pathname;
  const selectedItemAEditar = useSelector(selectSelectedItemAEditar);
  let defaultValues;
  if (selectedItemAEditar) {
    defaultValues = {
      name: selectedItemAEditar.name,
      description: selectedItemAEditar.description
    };
  } else {
    defaultValues = {
      name: '',
      description: ''
    };
  };
  const { control, formState, handleSubmit, reset } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });
  const { isValid, dirtyFields, errors, setError } = formState;

  //useEffect 

  useEffect(() => {
    const unlisten = history.listen((location, action) => {
      if (location.pathname !== prevLocation) {
        selectedItemAEditar ? dispatch(setSelectedItemAEditar(null)) : dispatch(setSelectedButton(null));
      };
    });
    return () => {
      unlisten();
    };
  }, [location.pathname]);

  //funciones

  function onSubmit({ name, description }) {
    const objetoPath = devuelvePath();
    let objetoAretornar = {
      name: name.charAt(0).toUpperCase() + name.slice(1),
      folderId: objetoPath.folderId,
      createdBy: user.data.displayName,
      size: null,
      type: 'folder',
      description: description,
      ruta: objetoPath.ruta
    };
    reset(defaultValues);
    if (selectedItemAEditar) {
      objetoAretornar = {
        ...objetoAretornar,
        id: selectedItemAEditar.id,
        nameServer: selectedItemAEditar.nameServer,
      };
      dispatch(updateFile(objetoAretornar));
      dispatch(setSelectedItemAEditar(null));
    } else {
      objetoAretornar = {
        ...objetoAretornar,
        nameServer: _.deburr(name).replaceAll(" ", "-").toLowerCase(),
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

  return (
    <>
      <motion.div
        initial={{ y: 50, opacity: 0.8 }}
        animate={{ y: 0, opacity: 1, transition: { delay: 0.3 } }}
      >
        <div className="file-details px-24 sm:px-32">
          <Typography className="text-2xl font-extrabold tracking-tight leading-none">
            {selectedItemAEditar ? 'Actualizar carpeta' : 'Crear carpeta'}
          </Typography>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                className="mb-32 mt-32"
                label="Nombre"
                autoFocus={selectedItemAEditar ? false : true}
                type="text"
                error={!!errors.name}
                helperText={errors?.name?.message}
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
          {selectedItemAEditar ? 'Actualizar carpeta' : 'Crear carpeta'}
        </Button>
      </Box>
    </>
  );
}

export default FormFileManagerFolder;
