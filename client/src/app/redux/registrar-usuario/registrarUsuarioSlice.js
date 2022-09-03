import {
  createSlice,
} from '@reduxjs/toolkit';
import axios from 'axios';

//importación acciones
import { obtenerUsuarios } from 'app/redux/usuariosSlice';
import { showMessage } from 'app/redux/fuse/messageSlice';

const initialState = {
  usuario: {},
};

const registrarUsuarioSlice = createSlice({
  name: 'registrarUsuario',
  initialState,
  reducers: {
    setUsuarioRegistrado: (state, action) => {
      state.usuario = action.payload;
    },
  },
});

export const { setUsuarioRegistrado } = registrarUsuarioSlice.actions;

export const registrarUsuario = (displayName, password, email, rol) => async (dispatch, getState) => {
  const formData = new FormData();
  const losDatos = {
      displayName,
      email,
      password,
      photoURL: "assets/images/avatars/no-user.png",
      shortcuts: ["apps.calendar", "apps.tasks"],
      role: rol,
      aplicacion: "Gestión Integral de Producción"
  };
  formData.append("datos", JSON.stringify(losDatos));
  try {
      const response = await axios.post('/usuarios/registrar', formData);
      const data = await response.data;
      dispatch(setUsuarioRegistrado(data.usuario));
      dispatch(obtenerUsuarios(true));
  } catch (err) {
      dispatch(showMessage({ message: err.response.data.message, variant: "error" }));
      return;
  };
};

// Reducer
export default registrarUsuarioSlice.reducer;
