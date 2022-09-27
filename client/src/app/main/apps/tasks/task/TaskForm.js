import Button from '@mui/material/Button';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import FuseLoading from '@fuse/core/FuseLoading';
import _ from '@lodash';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import Box from '@mui/system/Box';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Autocomplete from '@mui/material/Autocomplete/Autocomplete';
import Checkbox from '@mui/material/Checkbox/Checkbox';
import DateTimePicker from '@mui/lab/DateTimePicker';
import IconButton from '@mui/material/IconButton';
import TaskPrioritySelector from './TaskPrioritySelector';
import FormActionsMenu from './FormActionsMenu';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

//importaciones acciones
import {
  addTask,
  getTask,
  newTask,
  selectTask,
  updateTask,
  resetTask
} from 'app/redux/tasks/taskSlice';
import { selectTags } from 'app/redux/tasks/tagsSlice';
import { usuariosSeleccionados } from 'app/redux/usuariosSlice';
import { selectUser } from 'app/redux/userSlice';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  title: yup.string().required('Debes introducir un título'),
});

const TaskForm = (props) => {
  const task = useSelector(selectTask);
  const tags = useSelector(selectTags);
  const usuarios = useSelector(usuariosSeleccionados);
  const user = useSelector(selectUser);
  const routeParams = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { control, watch, reset, handleSubmit, formState, getValues } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });
  const { isValid, dirtyFields, errors } = formState;
  const form = watch();
  const [usuarioCreador, setUsuarioCreador] = useState(null);

  //useEffect

  useEffect(() => {
    reset({ ...task });
  }, [task, reset]);

  useEffect(() => {
    if (routeParams.id === 'new') {
      dispatch(newTask(routeParams.type));
    } else {
      dispatch(getTask(routeParams.id));
    };
  }, [dispatch, routeParams]);

  useEffect(() => {
    if (task && task.id && user) {
      if (task.creadaPor === user.data.displayName) {
        setUsuarioCreador({
          displayName: user.data.displayName,
          photoURL: user.data.photoURL,
          email: user.data.email,
          role: user.role.toString()
        });
      } else {
        const usuarioCreadorUsuarios = usuarios[usuarios.findIndex(usuario => usuario.displayName === task.creadaPor)];
        setUsuarioCreador({
          displayName: usuarioCreadorUsuarios.displayName,
          photoURL: usuarioCreadorUsuarios.photoURL,
          email: usuarioCreadorUsuarios.email,
          role: usuarioCreadorUsuarios.role.toString()
        });
      }
    };
  }, [task]);

  //funciones

  function onSubmit(data) {
    dispatch(updateTask(data)).then(({ payload }) => {
      dispatch(resetTask());
      navigate(`/apps/tasks/`);
    });
  };

  function onSubmitNew(data) {
    const datos = { ...data };
    datos.creadaPor = user.data.displayName;
    dispatch(addTask(datos)).then(({ payload }) => {
      dispatch(resetTask());
      navigate(`/apps/tasks/`);
    });
  };

  if (_.isEmpty(form) || !task) {
    return <FuseLoading />;
  };

  return (
    <>
      <div className="relative flex flex-col flex-auto items-center px-24 sm:px-48">
        <div className="flex items-center justify-between border-b-1 w-full py-24 mt-16 mb-32">
          {form.type === 'task' ? (
            <Controller
              control={control}
              name="completed"
              render={({ field: { value, onChange } }) => (
                <Button className="font-semibold" onClick={() => onChange(!value)}>
                  <Box sx={{ color: value ? 'secondary.main' : 'text.disabled' }}>
                    <FuseSvgIcon>heroicons-outline:check-circle</FuseSvgIcon>
                  </Box>
                  <span className="mx-8">
                    {task.completed ? 'MARCAR COMO NO REALIZADA' : 'MARCAR COMO REALIZADA'}
                  </span>
                </Button>
              )}
            />
          ) : (
            <div></div>
          )}
          <div className="flex items-center">
            {routeParams.id !== 'new' && <FormActionsMenu taskId={task.id} />}
            <IconButton className="" component={NavLinkAdapter} to="/apps/tasks" size="large" onClick={() => dispatch(resetTask())}>
              <FuseSvgIcon>heroicons-outline:x</FuseSvgIcon>
            </IconButton>
          </div>
        </div>
        <Controller
          control={control}
          name="title"
          render={({ field }) => (
            <TextField
              className="mt-32 max-h-auto"
              {...field}
              //label={`${_.upperFirst(form.type)} title`}
              label={form.type === 'task' ? 'Título tarea' : 'Título sección'}
              placeholder="Título"
              id="title"
              error={!!errors.title}
              helperText={errors?.title?.message}
              variant="outlined"
              fullWidth
              multiline
              minRows={3}
              maxRows={10}
            />
          )}
        />
        {form.type === 'task' && (
          <>
            {usuarios.length > 0 && (
              <Controller
                control={control}
                name="asignadaA"
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    multiple
                    id="asignadaA"
                    className="mt-32"
                    options={usuarios}
                    disableCloseOnSelect
                    getOptionLabel={(option) => option.displayName}
                    renderOption={(_props, option, { selected }) => (
                      <li {..._props}>
                        <Checkbox style={{ marginRight: 8 }} checked={selected} />
                        {option.displayName}
                      </li>
                    )}
                    value={value ? value.map((_id) => _.find(usuarios, { _id })) : []}
                    onChange={(event, newValue) => {
                      onChange(newValue.map((item) => item._id));
                    }}
                    fullWidth
                    renderInput={(params) => <TextField {...params} label="Asignada" placeholder="Asignada" />}
                  />
                )}
              />
            )}
            <div className="flex w-full space-x-16 mt-32 mb-16 items-center">
              <Controller
                control={control}
                name="priority"
                render={({ field }) => <TaskPrioritySelector {...field} />}
              />
              <Controller
                control={control}
                name="dueDate"
                render={({ field }) => (
                  <DateTimePicker
                    {...field}
                    className="w-full"
                    clearable
                    showTodayButton
                    renderInput={(_props) => (
                      <TextField
                        className=""
                        id="due-date"
                        label="Fecha de vencimiento"
                        type="date"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        variant="outlined"
                        fullWidth
                        {..._props}
                      />
                    )}
                  />
                )}
              />
            </div>
            <Controller
              control={control}
              name="notes"
              render={({ field }) => (
                <TextField
                  className="mt-32"
                  {...field}
                  label="Notas"
                  placeholder="Notas"
                  id="notes"
                  error={!!errors.notes}
                  helperText={errors?.notes?.message}
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
          </>
        )}
        {(routeParams.id !== 'new' && usuarioCreador) && (
          <div className="flex w-full mt-32 mb-16 items-start">
            <Paper className="flex flex-col flex-auto shadow rounded-2xl px-20">
              <List>
                <ListItem className="px-0 -mx-8">
                  <Avatar
                    alt={usuarioCreador.displayName}
                    src={usuarioCreador.photoURL}
                    className="mx-8"
                  />
                  <ListItemText
                    className="px-4"
                    primary={
                      <div className="flex items-center space-x-8">
                        <Typography
                          className="font-normal"
                          paragraph={false}
                        >
                          Creada por:
                        </Typography>
                        <Typography
                          className="font-normal"
                          color="secondary"
                          paragraph={false}
                        >
                          {usuarioCreador.displayName}
                        </Typography>
                      </div>
                    }
                    secondary={
                      <span className="flex items-center space-x-8">
                        <Typography
                          paragraph={false}
                          component="span"
                          className="mb-0"
                        >
                          {usuarioCreador.email}
                        </Typography>
                        <Typography paragraph={false} className="capitalize" component="span" variant="caption">{usuarioCreador.role}</Typography>
                      </span>
                    }
                  />
                </ListItem>
              </List>
            </Paper>
          </div>
        )}
      </div>
      <Box
        className="flex items-center mt-40 py-14 pr-16 pl-4 sm:pr-48 sm:pl-36 border-t"
        sx={{ backgroundColor: 'background.default' }}
      >
        <Button className="ml-auto" component={NavLinkAdapter} to={-1} onClick={() => dispatch(resetTask())}>
          Cancelar
        </Button>
        <Button
          className="ml-8"
          variant="contained"
          color="secondary"
          disabled={routeParams.id === 'new' ? (_.isEmpty(dirtyFields) || !isValid) : (!isValid || _.isEmpty(form) || _.isEqual(task, form))}
          onClick={routeParams.id === 'new' ? (handleSubmit(onSubmitNew)) : (handleSubmit(onSubmit))}
        >
          {routeParams.id === 'new' ? 'Crear' : 'Actualizar'}
        </Button>
      </Box>
    </>
  );
};

export default TaskForm;
