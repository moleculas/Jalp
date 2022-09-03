import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import _ from '@lodash';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import ListItem from '@mui/material/ListItem';
import clsx from 'clsx';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { createLabel } from 'app/redux/notes/labelsSlice';
import LabelModel from '../../model/LabelModel';

const defaultValues = {
  title: '',
};

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  title: yup.string().required('Debes ingresar un título de etiqueta'),
});

function NewLabelForm(props) {
  const dispatch = useDispatch();

  const { control, formState, handleSubmit, reset } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  //funciones

  function onSubmit(data) {
    const newLabel = LabelModel(data);
    dispatch(createLabel(newLabel));
    reset(defaultValues);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ListItem className="p-0 mb-16" dense>
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              className={clsx('flex flex-1')}
              error={!!errors.title}
              helperText={errors?.title?.message}
              placeholder="Crear etiqueta nueva"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FuseSvgIcon color="action">heroicons-outline:tag</FuseSvgIcon>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      className="w-32 h-32 p-0"
                      aria-label="Delete"
                      disabled={_.isEmpty(dirtyFields) || !isValid}
                      type="submit"
                      size="large"
                    >
                      <FuseSvgIcon color="action" size={20}>
                        heroicons-outline:check
                      </FuseSvgIcon>
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
      </ListItem>
    </form>
  );
}

export default NewLabelForm;
