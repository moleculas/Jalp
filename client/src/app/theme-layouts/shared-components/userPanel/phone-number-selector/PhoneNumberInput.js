import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import * as yup from 'yup';
import IconButton from '@mui/material/IconButton';
import { useEffect } from 'react';

const schema = yup.object().shape({
  telefono: yup.string(),
  etiqueta: yup.string(),
});

const defaultValues = {
  telefono: '',
  etiqueta: '',
};

function PhoneNumberInput(props) {
  const { value, hideRemove } = props;

  const { control, formState, handleSubmit, reset } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  useEffect(() => {
    reset(value);
  }, [reset, value]);

  function onSubmit(data) {
    props.onChange(data);
  }

  return (
    <form className="flex space-x-16 mb-16" onChange={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="telefono"
        render={({ field }) => (
          <TextField
            {...field}
            label="Teléfono"
            placeholder="Teléfono"
            variant="outlined"
            fullWidth
            error={!!errors.telefono}
            helperText={errors?.telefono?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FuseSvgIcon size={20}>heroicons-solid:phone</FuseSvgIcon>
                </InputAdornment>
              )
            }}
          />
        )}
      />
      <Controller
        control={control}
        name="etiqueta"
        render={({ field }) => (
          <TextField
            {...field}
            className=""
            label="Etiqueta"
            placeholder="Etiqueta"
            variant="outlined"
            fullWidth
            error={!!errors.tipo}
            helperText={errors?.tipo?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FuseSvgIcon size={20}>heroicons-solid:tag</FuseSvgIcon>
                </InputAdornment>
              ),
            }}
          />
        )}
      />
      {!hideRemove && (
        <IconButton
          onClick={(ev) => {
            ev.stopPropagation();
            props.onRemove();
          }}
        >
          <FuseSvgIcon size={20}>heroicons-solid:trash</FuseSvgIcon>
        </IconButton>
      )}
    </form>
  );
}

export default PhoneNumberInput;
