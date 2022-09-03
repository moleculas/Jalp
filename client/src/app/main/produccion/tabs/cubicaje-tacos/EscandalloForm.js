import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import FuseLoading from '@fuse/core/FuseLoading';
import _ from '@lodash';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import Box from '@mui/system/Box';
import TextField from '@mui/material/TextField';
import { motion } from 'framer-motion';
import Typography from '@mui/material/Typography';

//importacion acciones
import {
  selectEscandallo,
  setOpenFormEscandallo,
  updateEscandallo
} from 'app/redux/produccion/produccionSlice';

/**
 * Form Validation Schema
 */
const schema = yup.lazy((value) => {
  const shapes = {};
  const keys = Object.keys(value);
  keys.forEach(((parameter) => {
    shapes[parameter] = yup.number().typeError('Debes introducir un valor numérico');
  }));
  return yup.object().shape(shapes);
});

const EscandalloForm = (props) => {
  const dispatch = useDispatch();
  const escandallo = useSelector(selectEscandallo);
  const [escandalloControllers, setEscandalloControllers] = useState([]);
  const { control, watch, reset, handleSubmit, formState, getValues, setValue } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });
  const { isValid, dirtyFields, errors } = formState;
  const form = watch();

  //useEffect

  useEffect(() => {
    if (escandallo) {
      const arrayEscandallo = [];
      escandallo.arrayPatines.forEach((patin) => {
        arrayEscandallo.push({ ...patin, modificado: false });
        setValue(`unidades-${patin.nombre}`, patin.unidades, { shouldDirty: true });
        setValue(`cubico-${patin.nombre}`, patin.cubico, { shouldDirty: true });
      });
      escandallo.arrayPatinDerecho.forEach((patin) => {
        arrayEscandallo.push({ ...patin, modificado: false });
        setValue(`unidades-${patin.nombre}`, patin.unidades, { shouldDirty: true });
        setValue(`cubico-${patin.nombre}`, patin.cubico, { shouldDirty: true });
      });
      escandallo.arrayPatinIzquierdo.forEach((patin) => {
        arrayEscandallo.push({ ...patin, modificado: false });
        setValue(`unidades-${patin.nombre}`, patin.unidades, { shouldDirty: true });
        setValue(`cubico-${patin.nombre}`, patin.cubico, { shouldDirty: true });
      });
      escandallo.arrayPatinCentral.forEach((patin) => {
        arrayEscandallo.push({ ...patin, modificado: false });
        setValue(`unidades-${patin.nombre}`, patin.unidades, { shouldDirty: true });
        setValue(`cubico-${patin.nombre}`, patin.cubico, { shouldDirty: true });
      });
      escandallo.arrayPalets.forEach((palet) => {
        arrayEscandallo.push({ ...palet, modificado: false });
        setValue(`unidades-${palet.nombre}`, palet.unidades, { shouldDirty: true });
        setValue(`cubico-${palet.nombre}`, palet.cubico, { shouldDirty: true });
      });
      setEscandalloControllers(arrayEscandallo);
    };
  }, [escandallo]);

  //funciones

  const onChangeFirst = (e) => {
    const arrayEscandallo = [...escandalloControllers];
    const string = e.target.name;
    let stringModificado;
    if (string.includes("unidades-")) {
      stringModificado = string.replace("unidades-", "");
    } else {
      stringModificado = string.replace("cubico-", "");
    };
    arrayEscandallo[arrayEscandallo.findIndex(el => el.nombre === stringModificado)].modificado = true;
    setEscandalloControllers(arrayEscandallo);
    consultaModificado()
  };

  const consultaModificado = () => {
    const existeModificado = escandalloControllers.some(el => el.modificado === true);
    return existeModificado
  };

  function onSubmit(data) {
    const modificados = escandalloControllers.filter(el => el.modificado === true);
    let modificadosActualizar = [...modificados];
    modificadosActualizar.map((item, index) => {
      for (const clave in data) {
        let incluido = false;
        if (clave.includes("unidades-") && clave.includes(item.nombre)) {
          incluido = true;
          item.unidades = data[clave];
        };
        if (clave.includes("cubico-") && clave.includes(item.nombre)) {
          incluido = true;
          item.cubico = data[clave];
        };
        incluido && (modificadosActualizar[index] = item);
      };
    });
    dispatch(updateEscandallo(modificadosActualizar)).then(({ payload }) => {
      dispatch(setOpenFormEscandallo(false))
    });
  };

  if (_.isEmpty(form) || !escandallo || escandalloControllers.length === 0) {
    return <FuseLoading />;
  };

  return (
    <>
      <motion.div
        initial={{ y: 50, opacity: 0.8 }}
        animate={{ y: 0, opacity: 1, transition: { delay: 0.3 } }}
      >
        <div className="flex flex-col flex-auto items-center px-24 sm:px-48">
          {escandalloControllers.map((item, index) => {
            return (
              <div className="flex items-center justify-between py-12 w-full" key={`item-${index}`}>
                <Typography color="text.primary">{item.nombre}</Typography>
                <div className="flex space-x-16 w-2/3">
                  <Controller
                    control={control}
                    name={`unidades-${item.nombre}`}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className="w-2/3"
                        label='Unidades'
                        placeholder="Unidades"
                        id={`unidades-${item.nombre}`}
                        error={!!errors[`unidades-${item.nombre}`]}
                        helperText={errors[`unidades-${item.nombre}`]?.message}
                        variant="outlined"
                        fullWidth
                        onChange={e => {
                          onChangeFirst(e);
                          field.onChange(e);
                        }}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name={`cubico-${item.nombre}`}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className="w-2/3"
                        label='Cúbico'
                        placeholder="Cúbico"
                        id={`cubico-${item.nombre}`}
                        error={!!errors[`cubico-${item.nombre}`]}
                        helperText={errors[`cubico-${item.nombre}`]?.message}
                        variant="outlined"
                        fullWidth
                        onChange={e => {
                          onChangeFirst(e);
                          field.onChange(e);
                        }}
                      />
                    )}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>
      <Box
        className="flex items-center mt-40 py-14 pr-16 pl-4 sm:pr-48 sm:pl-36 border-t w-full"
        sx={{ backgroundColor: 'background.default' }}
      >
        <Button
          className="ml-auto"
          onClick={() => dispatch(setOpenFormEscandallo(false))}
        >
          Cancelar
        </Button>
        <Button
          className="ml-8"
          variant="contained"
          color="secondary"
          disabled={!isValid || _.isEmpty(form) || !consultaModificado()}
          onClick={handleSubmit(onSubmit)}
        >
          Actualizar
        </Button>
      </Box>
    </>
  );
};

export default EscandalloForm;
