import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { getChats, removeChats } from './chatsSlice';
import { getChatsInicio } from 'app/redux/produccion/inicioSlice';

//importacion acciones
import { showMessage } from 'app/redux/fuse/messageSlice';

export const getChat = createAsyncThunk(
  'chatApp/chat/getChat',
  async (contactId, { dispatch, getState }) => {
    dispatch(removeChats());
    const user = getState().user;
    const formData = new FormData();
    const losDatos = {
      usuario: user.data.id,
      usuarioChatContacto: contactId
    };
    formData.append("datos", JSON.stringify(losDatos));
    try {
      const response = await axios.post('/chat/chat', formData);
      const data = await response.data;
      dispatch(getChats()).then(() => {
        dispatch(getChatsInicio());
      });
      return data;
    } catch (err) {
      dispatch(showMessage({ message: err.response.data.message, variant: "error" }));
      return;
    };
  });

export const getActualizacionChat = createAsyncThunk(
  'chatApp/chat/getActualizacionChat',
  async (chatId, { dispatch, getState }) => {
    const formData = new FormData();
    const losDatos = {
      chatId: chatId
    };
    formData.append("datos", JSON.stringify(losDatos));
    try {
      const response = await axios.post('/chat/chat/refresh', formData);
      const data = await response.data;
      return data;
    } catch (err) {
      dispatch(showMessage({ message: err.response.data.message, variant: "error" }));
      return;
    };
  });

export const sendMessage = createAsyncThunk(
  'chatApp/chat/sendMessage',
  async ({ messageText, chatId, contactId, estadoUsuarioChat }, { dispatch, getState }) => {
    const formData = new FormData();
    const losDatos = {
      messageText: messageText,
      chatId: chatId,
      contactId: contactId,
      timeStamp: Date.now(),
      estadoUsuarioChat: estadoUsuarioChat
    };
    formData.append("datos", JSON.stringify(losDatos));
    try {
      const response = await axios.post('/chat/chats/message', formData);
      const data = await response.data;
      dispatch(getChats());
      return data;
    } catch (err) {
      dispatch(showMessage({ message: err.response.data.message, variant: "error" }));
      return;
    };
  });

export const actualizarChat = createAsyncThunk(
  'chatApp/chat/actualizarChat',
  async ({ chatId, muted, estadoUsuarioChat }, { dispatch, getState }) => {
    const formData = new FormData();
    const losDatos = {
      chatId: chatId,
      muted: muted,
      estadoUsuarioChat: estadoUsuarioChat
    };
    formData.append("datos", JSON.stringify(losDatos));
    try {
      const response = await axios.post('/chat/chat/actualizar', formData);
      const data = await response.data;
      dispatch(getChats());
      return data;
    } catch (err) {
      dispatch(showMessage({ message: err.response.data.message, variant: "error" }));
      return;
    };
  });

const initialState = {
  chat: [],
  temporizadorOn: false,
  datosChatEnUso: {
    id: null,
    mutedUsuario: false,
    mutedContactId: false
  },
  estadoUsuarioChat: ''
};

const chatSlice = createSlice({
  name: 'chatApp/chat',
  initialState,
  reducers: {
    removeChat: (state, action) => {
      state.chat = [];
    },
    setTemporizadorOn: (state, action) => {
      state.temporizadorOn = action.payload;
    },
    setEstadoUsuarioChat: (state, action) => {
      state.estadoUsuarioChat = action.payload;
    }
  },
  extraReducers: {
    [getChat.fulfilled]: (state, action) => {
      state.chat = action.payload.mensajes;
      state.datosChatEnUso = {
        id: action.payload.datos.id,
        mutedUsuario: action.payload.datos.mutedUsuario,
        mutedContactId: action.payload.datos.mutedContactId
      };
      state.estadoUsuarioChat = '';
    },
    [sendMessage.fulfilled]: (state, action) => {
      state.chat = [...state.chat, action.payload]
    },
    [actualizarChat.fulfilled]: (state, action) => {
      state.datosChatEnUso = {
        id: action.payload.id,
        mutedUsuario: action.payload.mutedUsuario,
        mutedContactId: action.payload.mutedContactId
      };
    },
    [getActualizacionChat.fulfilled]: (state, action) => {
      state.chat = action.payload;
    },
  },
});

export const {
  setTemporizadorOn,
  removeChat,
  setEstadoUsuarioChat
} = chatSlice.actions;

export const selectChat = ({ chatApp }) => chatApp.chat.chat;
export const selectTemporizadorOn = ({ chatApp }) => chatApp.chat.temporizadorOn;
export const selectDatosChatEnUso = ({ chatApp }) => chatApp.chat.datosChatEnUso;
export const selectEstadoUsuarioChat = ({ chatApp }) => chatApp.chat.estadoUsuarioChat;

export default chatSlice.reducer;
