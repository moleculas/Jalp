import FuseScrollbars from '@fuse/core/FuseScrollbars';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import _ from '@lodash';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import withRouter from '@fuse/core/withRouter';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import * as yup from 'yup';
import format from 'date-fns/format';
import { es } from 'date-fns/locale';
import NoteFormList from './tasks/NoteFormList';
import NoteFormLabelMenu from './NoteFormLabelMenu';
import NoteFormReminder from './NoteFormReminder';
import NoteModel from '../model/NoteModel';
import NoteReminderLabel from '../NoteReminderLabel';
import NoteLabel from '../NoteLabel';
import { useDispatch } from 'react-redux';

//importacion acciones
import {
  removeNote,
  updateNote,
  getNotes,
} from 'app/redux/notes/notesSlice';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  title: yup.string(),
  content: yup.string(),
  //image: yup.string(),
  tasks: yup.array(),
  oneOfThemRequired: yup.bool().when(['title', 'content', 'tasks'], {
    is: (a, b, c, d) => (!a && !b && !c && !d) || (!!a && !!b && !!c && !!d),
    then: yup.bool().required(''),
    otherwise: yup.bool(),
  }),
});

function NoteForm(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showList, setShowList] = useState(false);
  const routeParams = useParams();
  const defaultValues = _.merge(
    {},
    NoteModel(),
    props.note,
    routeParams.labelId ? { labels: [routeParams.labelId] } : null,
    routeParams.id === 'archive' ? { archived: true } : null
  );
  const { formState, handleSubmit, getValues, reset, watch, setValue, control } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });
  const { isValid, dirtyFields, errors } = formState;
  const noteForm = watch();
  const [elFile, setElFile] = useState(null);
  const [estadoImagen, setEstadoImagen] = useState(null);

  //funciones

  function handleRemoveLabel(id) {
    setValue(
      `labels`,
      noteForm.labels.filter((_id) => _id !== id)
    );
  };

  const handleOnRemove = () => {
    dispatch(removeNote(noteForm?.id)).then(() => {
      dispatch(getNotes(routeParams));
    });
  };

  const handleActualizar = () => {
    const losDatos = {};
    losDatos['id'] = noteForm.id;
    losDatos['title'] = noteForm.title;
    losDatos['content'] = noteForm.content;
    noteForm.tasks && (losDatos['tasks'] = noteForm.tasks);
    losDatos['reminder'] = noteForm.reminder;
    noteForm.labels && (losDatos['labels'] = noteForm.labels);
    noteForm.archived && (losDatos['archived'] = noteForm.archived);
    losDatos['image'] = estadoImagen;
    elFile && (losDatos['file'] = elFile);
    dispatch(updateNote(losDatos));
    props.onClose();
  };

  /**
   * Create New Note
   */
  function onCreate(data) {
    if (!props.onCreate) {
      return;
    };
    const losDatos = {};
    data.title && (losDatos['title'] = data.title);
    data.content && (losDatos['content'] = data.content);
    data.tasks && (losDatos['tasks'] = data.tasks);
    data.reminder && (losDatos['reminder'] = data.reminder);
    data.labels && (losDatos['labels'] = data.labels);
    data.archived && (losDatos['archived'] = data.archived);
    losDatos['image'] = estadoImagen;
    elFile && (losDatos['file'] = elFile);
    props.onCreate(losDatos);
    navigate(`/apps/notes/`);
  };

  return (
    <div className="flex flex-col w-full">
      <FuseScrollbars className="flex flex-auto w-full max-h-640">
        <div className="w-full">
          <Controller
            name="image"
            control={control}
            defaultValue=""
            render={({ field: { onChange, value } }) => {
              if (!value || value === '') {
                return null;
              }
              return (
                <div className="relative">
                  <img src={value} className="w-full block" alt="note" />
                  <Fab
                    className="absolute right-0 bottom-0 m-8"
                    variant="extended"
                    size="small"
                    color="secondary"
                    aria-label="Delete Image"
                    type="button"
                    onClick={() => { onChange(''); setElFile(null); setEstadoImagen('borrada') }}
                  >
                    <FuseSvgIcon size={20}>heroicons-outline:trash</FuseSvgIcon>
                  </Fab>
                </div>
              );
            }}
          />
          <div className="px-20 my-16">
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  className="font-semibold text-14"
                  placeholder="Título"
                  type="text"
                  disableUnderline
                  fullWidth
                />
              )}
            />
          </div>
          <div className="px-20 my-16">
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Descripción"
                  multiline
                  rows="4"
                  disableUnderline
                  fullWidth
                />
              )}
            />
          </div>
          <Controller
            name="tasks"
            control={control}
            defaultValue={[]}
            render={({ field: { onChange, value } }) => {
              if ((value?.length === 0 && !showList) || (!value && !showList)) {
                return null;
              }
              return (
                <div className="px-16">
                  <NoteFormList tasks={value || []} onCheckListChange={(val) => onChange(val)} />
                </div>
              );
            }}
          />
          {(noteForm.labels || noteForm.reminder || noteForm.createdAt) && (
            <div className="flex flex-wrap w-full px-20 my-16 -mx-4">
              {noteForm.reminder && (
                <NoteReminderLabel
                  className="mt-4 mx-4"
                  date={noteForm.reminder}
                  onDelete={() => {
                    setValue('reminder', null);
                  }}
                />
              )}

              <Controller
                name="labels"
                control={control}
                defaultValue={[]}
                render={({ field: { onChange, value } }) => {
                  if (!value) {
                    return null;
                  }
                  return value.map((id) => (
                    <NoteLabel
                      id={id}
                      key={id}
                      className="mt-4 mx-4"
                      onDelete={() => onChange(value.filter((_id) => _id !== id))}
                    />
                  ));
                }}
              />
              {noteForm.createdAt && (
                <Typography color="text.secondary" className="text-12 mt-8 mx-4">
                  Editado: {format(new Date(noteForm.createdAt), "d 'de' MMMM 'de' y", { locale: es })}
                </Typography>
              )}
            </div>
          )}
        </div>
      </FuseScrollbars>
      <div className="flex flex-auto justify-between items-center px-16 pb-12">
        <div className="flex items-center">
          <Tooltip title="Recordatorio" placement="top">
            <div>
              <Controller
                name="reminder"
                control={control}
                defaultValue={[]}
                render={({ field: { onChange, value } }) => (
                  <NoteFormReminder reminder={value} onChange={(val) => onChange(val)} />
                )}
              />
            </div>
          </Tooltip>
          <Tooltip title="Añadir imagen" placement="top">
            <div>
              <label htmlFor="button-file">
                <input
                  accept="image/*"
                  className="hidden"
                  id="button-file"
                  type="file"
                  onChange={async (e) => {
                    function readFileAsync() {
                      return new Promise((resolve, reject) => {
                        const file = e.target.files[0];
                        if (!file) {
                          return;
                        }
                        const reader = new FileReader();
                        reader.onload = () => {
                          resolve(URL.createObjectURL(file));
                          setElFile(file);
                        };
                        reader.onerror = reject;
                        reader.readAsDataURL(file);
                      });
                    };
                    const newImage = await readFileAsync();
                    setValue('image', newImage, { shouldDirty: true, shouldValidate: true })
                  }}
                />
                <IconButton className="w-32 h-32 mx-4 p-0" component="span" size="large">
                  <FuseSvgIcon size={20}>heroicons-outline:photograph</FuseSvgIcon>
                </IconButton>
              </label>
            </div>
          </Tooltip>
          <Tooltip title="Añadir tareas" placement="top">
            <IconButton
              className="w-32 h-32 mx-4 p-0"
              onClick={() => setShowList(!showList)}
              size="large"
            >
              <FuseSvgIcon size={20}>heroicons-outline:pencil-alt</FuseSvgIcon>
            </IconButton>
          </Tooltip>
          <Tooltip title="Cambiar etiquetas" placement="top">
            <div>
              <NoteFormLabelMenu
                note={noteForm}
                onChange={(labels) => setValue('labels', labels)}
              />
            </div>
          </Tooltip>
          <Controller
            name="archived"
            control={control}
            defaultValue={false}
            render={({ field: { onChange, value } }) => (
              <Tooltip title={value ? 'Desarchivar' : 'Archivar'} placement="top">
                <div>
                  <IconButton
                    className="w-32 h-32 mx-4 p-0"
                    // disabled={newFormButtonDisabled()}
                    onClick={() => {
                      onChange(!value);
                      // if (props.variant === 'new') {
                      //   setTimeout(() => onCreate(getValues()));
                      // }
                    }}
                    size="large"
                  >
                    <FuseSvgIcon size={20}>
                      {value ? 'heroicons-solid:archive' : 'heroicons-outline:archive'}
                    </FuseSvgIcon>
                  </IconButton>
                </div>
              </Tooltip>
            )}
          />
        </div>
        <div className="flex items-center">
          {props.variant === 'new' ? (
            <Button
              className="m-4 p-8"
              type="submit"
              variant="contained"
              color="secondary"
              size="small"
              onClick={handleSubmit(onCreate)}
              disabled={_.isEmpty(dirtyFields) || !isValid}
            >
              Crear
            </Button>
          ) : (
            <>
              <Tooltip title="Borrar nota" placement="bottom">
                <IconButton className="w-32 h-32 mx-4 p-0" onClick={handleOnRemove} size="large">
                  <FuseSvgIcon size={20}>heroicons-outline:trash</FuseSvgIcon>
                </IconButton>
              </Tooltip>
              <Button className="m-4" onClick={props.onClose} variant="default" size="small">
                Cerrar
              </Button>
              <Button
                className="m-4"
                onClick={handleActualizar}
                variant="contained"
                color="secondary"
                size="small"
              >
                Actualizar
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default withRouter(NoteForm);
