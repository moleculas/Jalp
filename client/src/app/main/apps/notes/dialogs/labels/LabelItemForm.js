import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import ListItem from '@mui/material/ListItem';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useEffect } from 'react';
import { useDebounce } from '@fuse/hooks';
import _ from '@lodash';

//importación acciones
import {
  removeLabel,
  updateLabel,
  getLabels,
  selectLabels
} from 'app/redux/notes/labelsSlice';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  title: yup.string().required('Debes ingresar un título de etiqueta'),
});

function NewLabelForm(props) {
  const { label } = props;
  const dispatch = useDispatch();
  const { control, formState, handleSubmit, reset, watch } = useForm({
    mode: 'onChange',
    defaultValues: label,
    resolver: yupResolver(schema),
  });
  const { isValid, dirtyFields, errors } = formState;
  const form = watch();
  const labels = useSelector(selectLabels);

  const handleOnChange = useDebounce((_label, _form) => {
    if (!_label) {
      return;
    };
    if (form && !_.isEqual(_form, _label)) {
      dispatch(updateLabel(_form));
    };
  }, 300);

  //useEffect

  useEffect(() => {
    reset(label);
  }, [label, reset]);

  useEffect(() => {
    handleOnChange(label, form);
  }, [handleOnChange, label, form]);

  //funciones 

  function handleOnRemove() {
    dispatch(removeLabel(label.id)).then(() => {
      dispatch(getLabels());
    });
  };

  return (
    <>
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
                  labels.length > 1 && (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleOnRemove}
                        className="w-32 h-32 p-0"
                        aria-label="Delete"
                        size="large"
                      >
                        <FuseSvgIcon color="action" size={20}>
                          heroicons-outline:trash
                        </FuseSvgIcon>
                      </IconButton>
                    </InputAdornment>
                  )
                ),
              }}
            />
          )}
        />
      </ListItem>
    </>
  );
}

export default NewLabelForm;
