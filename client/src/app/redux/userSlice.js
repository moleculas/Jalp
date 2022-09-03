/* eslint import/no-extraneous-dependencies: off */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import _ from '@lodash';
import settingsConfig from 'app/configs/settingsConfig';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

//importación acciones
import { setInitialSettings } from 'app/redux/fuse/settingsSlice';
import { showMessage } from 'app/redux/fuse/messageSlice';
import { obtenerUsuarios } from 'app/redux/usuariosSlice';

export const setUser = createAsyncThunk(
  'user/setUser',
  async (user, { dispatch, getState }) => {
    /*
      Se puede aplicar redireccionamiento por rol
      */

    if (user.loginRedirectUrl) {
      settingsConfig.loginRedirectUrl = user.loginRedirectUrl; // por ejemplo 'apps/calendar'
    };
    const newUser = {
      role: user.role,
      data: {
        id: user._id,
        displayName: user.displayName,
        photoURL: user.photoURL,
        email: user.email,
        shortcuts: user.shortcuts,
        telefono: user.telefono ? user.telefono : null,
        direccion: user.direccion ? user.direccion : '',
        fechaNacimiento: user.fechaNacimiento ? user.fechaNacimiento : null,
        descripcion: user.descripcion ? user.descripcion : '',
        inicioSesion: new Date()
      }
    };
    return newUser;
  });

export const updateUserShortcuts = createAsyncThunk(
  'user/updateShortucts',
  async (shortcuts, { dispatch, getState }) => {
    const { user } = getState();
    const losDatos = {
      id: user.data.id,
      displayName: user.data.displayName,
      email: user.data.email,
      telefono: user.data.telefono,
      direccion: user.data.direccion,
      fechaNacimiento: user.data.fechaNacimiento,
      descripcion: user.data.descripcion,
      shortcuts: shortcuts
    };
    const formData = new FormData();
    formData.append("datos", JSON.stringify(losDatos));
    try {
      const response = await axios.post('/usuarios/actualizar', formData);
      const data = await response.data;
      dispatch(setUser(data.usuario));
      dispatch(showMessage({ message: "Atajos actualizados con éxito.", variant: "success" }));
    } catch (err) {
      dispatch(showMessage({ message: err.response.data.message, variant: "error" }));
      return;
    };
  }
);

export const logoutUser = () => async (dispatch, getState) => {
  const { user } = getState();
  if (!user.role || user.role.length === 0) {
    // is guest
    return null;
  };
  window.location.assign('/');
  // history.push({
  //   pathname: '/',
  // });
  dispatch(setInitialSettings());
  return dispatch(userLoggedOut());
};

const initialState = {
  role: [], // guest
  data: {
    id: '',
    displayName: '',
    photoURL: '',
    email: '',
    shortcuts: [],
  }
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userLoggedOut: (state, action) => initialState,
  },
  extraReducers: {
    [updateUserShortcuts.fulfilled]: (state, action) => action.payload,
    [setUser.fulfilled]: (state, action) => action.payload,
  },
});

export const { userLoggedOut } = userSlice.actions;

export const selectUser = ({ user }) => user;

export const selectUserShortcuts = ({ user }) => user.data.shortcuts;

export const actualizarUsuario = (data, file) => async (dispatch, getState) => {
  const formData = new FormData();
  const losDatos = data;
  formData.append("datos", JSON.stringify(losDatos));
  if (file) {
    formData.append("file", file);
  };
  try {
    const response = await axios.post('/usuarios/actualizar', formData);
    const data = await response.data;
    dispatch(setUser(data.usuario));
    dispatch(showMessage({ message: "Usuario actualizado con éxito.", variant: "success" }));
  } catch (err) {
    dispatch(showMessage({ message: err.response.data.message, variant: "error" }));
    return;
  };
};

export const eliminarUsuario = (id) => async (dispatch, getState) => {
  try {
    const response = await axios.delete('/usuarios/' + id);
    const data = await response.data;
    dispatch(showMessage({ message: data.message, variant: "success" }));
    dispatch(obtenerUsuarios(true));
  } catch (err) {
    dispatch(showMessage({ message: err.response.data.message, variant: "error" }));
    return;
  };
};

export const resetPassword = (email, password) => async (dispatch, getState) => {
  const formData = new FormData();
  formData.append("email", email);
  formData.append("password", password);
  try {
    const response = await axios.post('/auth/reset-password', formData);
    const data = await response.data;
    dispatch(showMessage({ message: data.message, variant: "success" }));
    return;
  } catch (err) {
    dispatch(showMessage({ message: err.response.data.message, variant: "error" }));
    return;
  };
};

export const isAResetPasswordTokenValid = (access_token) => async (dispatch, getState) => {
  if (!access_token) {
    return false;
  };
  const decoded = jwtDecode(access_token);
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    console.warn('access token expired');
    return false;
  };
  return decoded.user.email;
};

export default userSlice.reducer;
