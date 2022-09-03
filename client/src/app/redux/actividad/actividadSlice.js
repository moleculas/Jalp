import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice
} from '@reduxjs/toolkit';
import axios from 'axios';
import format from 'date-fns/format';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { es } from 'date-fns/locale';
import _ from "lodash";

//importación acciones
import { showMessage } from 'app/redux/fuse/messageSlice';

export const getItems = createAsyncThunk(
  'actividadPage/getItems',
  async (_, { dispatch, getState }) => {
    const user = getState().user;
    try {
      const response = await axios.get(`/actividad/${user.data.id}`);
      const data = await response.data;
      dispatch(convierteItem(data));
      return data;
    } catch (err) {
      dispatch(showMessage({ message: err.response.data.message, variant: "error" }));
      return;
    };
  });

const actividadAdapter = createEntityAdapter({});

export const {
  selectAll: selectItemsActividad,
  selectEntities: selectItemsActividadEntities,
  selectById: selectItemActividadById
} = actividadAdapter.getSelectors((state) => state.actividadPage.actividad);

const actividadSlice = createSlice({
  name: 'actividadPage',
  initialState: actividadAdapter.getInitialState({
    actividadesGestionadas: []
  }),
  reducers: {
    setActividadesGestionadas: (state, action) => {
      state.actividadesGestionadas = action.payload;
    },
  },
  extraReducers: {
    [getItems.fulfilled]: actividadAdapter.setAll,
  },
});

export const { setActividadesGestionadas } = actividadSlice.actions;

export const selectActividadesGestionadas = ({ actividadPage }) => actividadPage.actividad.actividadesGestionadas;

export const convierteItem = (actividades) => (dispatch, getState) => {
  const usuarios = getState().usuarios.usuarios;
  const user = getState().user;
  let actividadesARetornar = [];
  let objetoInicioSesion = {
    id: '001',
    icon: 'heroicons-solid:login',
    description: 'Sesión iniciada en aplicación',
    date: formatDistanceToNow(user.data.inicioSesion, { addSuffix: true, locale: es })
  };
  actividadesARetornar.push(objetoInicioSesion);
  actividades.map((actividad) => {
    let item = {};
    let dia;
    let hora;
    item.id = actividad.id;
    switch (actividad.tipo) {
      case 'event':
        item.icon = 'heroicons-solid:calendar';
        item.description = 'Creado evento <strong>' + actividad.title + '</strong> en sección Calendario';
        dia = _.capitalize(format(new Date(actividad.fecha), 'LLL dd', { locale: es }));
        hora = format(new Date(actividad.fecha), 'HH:mm a', { locale: es });
        item.date = dia + ', ' + hora;
        actividad.desc && (item.extraContent = '<span class="font-bold">Descripción: </span><span>' + actividad.desc + '</span>');
        item.linkedContent = 'Evento en el Calendario';
        item.link = '/apps/calendar';
        item.useRouter = true;
        break;
      case 'task':
        item.icon = 'heroicons-solid:check-circle';
        dia = _.capitalize(format(new Date(actividad.fecha), 'LLL dd', { locale: es }));
        hora = format(new Date(actividad.fecha), 'HH:mm a', { locale: es });
        item.date = dia + ', ' + hora;
        item.description = 'Creada tarea <strong>' + actividad.title + '</strong> en sección Tareas';
        item.linkedContent = 'Editar tarea';
        item.link = '/apps/tasks/' + actividad.id;
        item.useRouter = true;
        break;
      case 'nota':
        item.icon = 'heroicons-solid:pencil-alt';
        dia = _.capitalize(format(new Date(actividad.fecha), 'LLL dd', { locale: es }));
        hora = format(new Date(actividad.fecha), 'HH:mm a', { locale: es });
        item.date = dia + ', ' + hora;
        if (actividad.title) {
          item.description = 'Creada nota <strong>' + actividad.title + '</strong> en sección Notas';
        } else {
          item.description = 'Creada nota';
        };
        actividad.content && (item.extraContent = '<span class="font-bold">Contenido: </span><span>' + actividad.content + '</span>');
        item.linkedContent = 'Nota en la sección Notas';
        item.link = '/apps/notes/';
        item.useRouter = true;
        break;
      case 'chat':
        const usuario = usuarios.find(o => o._id === actividad.contactId);
        item.image = usuario.photoURL;
        dia = _.capitalize(format(new Date(actividad.fecha), 'LLL dd', { locale: es }));
        hora = format(new Date(actividad.fecha), 'HH:mm a', { locale: es });
        item.date = dia + ', ' + hora;
        item.description = 'Chat iniciado con <strong>' + usuario.displayName + '</strong> en sección Chat';
        item.extraContent = '<span class="font-bold">Último mensaje: </span><span>' + actividad.lastMessage + '</span>'
        item.linkedContent = 'Seguir chateando';
        item.link = '/apps/chat/';
        item.useRouter = true;
        break;
      case 'file':
        if (actividad.type === 'folder') {
          item.icon = 'heroicons-solid:folder';
          item.description = 'Creada carpeta <strong>' + actividad.name + '</strong> por <strong>' + actividad.createdBy + '</strong> en Gestor de Archivos';
          item.linkedContent = 'Carpeta en el Gestor de Archivos';
        } else {
          item.icon = 'heroicons-solid:document';
          item.description = 'Creado archivo <strong>' + actividad.name + '</strong> por <strong>' + actividad.createdBy + '</strong> en Gestor de Archivos';
          item.linkedContent = 'Archivo en el Gestor de Archivos';
        };
        dia = _.capitalize(format(new Date(actividad.fecha), 'LLL dd', { locale: es }));
        hora = format(new Date(actividad.fecha), 'HH:mm a', { locale: es });
        item.date = dia + ', ' + hora;
        if (actividad.folderId) {
          item.link = '/apps/file-manager/' + actividad.folderId;
        } else {
          item.link = '/apps/file-manager/';
        };
        item.useRouter = true;
        break;
      default:
    };
    actividadesARetornar.push(item);
  });
  dispatch(setActividadesGestionadas(actividadesARetornar));
};

export default actividadSlice.reducer;
