import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

//importacion acciones
import { showMessage } from 'app/redux/fuse/messageSlice';

export const getProduccion = createAsyncThunk(
  'produccionSeccion/produccion/getProduccion',
  async (datos, { getState, dispatch }) => {
    try {
      const formData = new FormData();
      const losDatos = datos;
      formData.append("datos", JSON.stringify(losDatos));
      const response = await axios.post('/produccion/producto', formData);
      const data = await response.data;
      return data;
    } catch (err) {
      dispatch(showMessage({ message: err.response.data.message, variant: "error" }));
      return;
    };
  });

export const updateProduccionInicial = createAsyncThunk(
  'produccionSeccion/produccion/updateProduccionInicial',
  async (datos, { getState, dispatch }) => {
    try {
      const formData = new FormData();
      const losDatos = datos;
      formData.append("datos", JSON.stringify(losDatos));
      const response = await axios.post('/produccion/actualizarInicial', formData);
      const data = await response.data;
      return data;
    } catch (err) {
      dispatch(showMessage({ message: err.response.data.message, variant: "error" }));
      return;
    };
  });

export const updateProduccionTabla = createAsyncThunk(
  'produccionSeccion/produccion/updateProduccionTabla',
  async (datos, { getState, dispatch }) => {
    try {
      const formData = new FormData();
      const losDatos = datos;
      formData.append("datos", JSON.stringify(losDatos));
      const response = await axios.post('/produccion/actualizarTabla', formData);
      const data = await response.data;
      dispatch(showMessage({ message: "Datos actualizados con éxito.", variant: "success" }));
      return data;
    } catch (err) {
      dispatch(showMessage({ message: err.response.data.message, variant: "error" }));
      return;
    };
  });

const initialState = {
  semanasAnyo: null,
  datosProduccionInicial: null,
  datosProduccionTabla: null,
  datosProduccionPalet: null,
  datosProduccionSaldo: null,
};

const produccionSlice = createSlice({
  name: 'produccionSeccion/produccion',
  initialState,
  reducers: {
    setSemanasAnyo: (state, action) => {
      state.semanasAnyo = action.payload;
    },
    setDatosProduccionTabla: (state, action) => {
      state.datosProduccionTabla = action.payload;
    },
    setDatosProduccionInicial: (state, action) => {
      state.datosProduccionInicial = action.payload;
    },
    setDatosProduccionPalet: (state, action) => {
      state.datosProduccionPalet = action.payload;
    },
    setDatosProduccionSaldo: (state, action) => {
      state.datosProduccionSaldo = action.payload;
    },
  },
  extraReducers: {
    [getProduccion.fulfilled]: (state, action) => {
      state.datosProduccionInicial = action.payload.inicial;
      state.datosProduccionTabla = action.payload.tabla;
      state.datosProduccionPalet = action.payload.palet;
      state.datosProduccionSaldo = action.payload.saldo;
    },
    [updateProduccionInicial.fulfilled]: (state, action) => {
      state.datosProduccionInicial = action.payload.inicial;
      state.datosProduccionSaldo = action.payload.saldo;
    },
    [updateProduccionTabla.fulfilled]: (state, action) => {
      state.datosProduccionTabla = action.payload.tabla;
      state.datosProduccionPalet = action.payload.palet;
    },
  },
});

export const {
  setSemanasAnyo,
  setDatosProduccionTabla,
  setDatosProduccionInicial,
  setDatosProduccionPalet,
  setDatosProduccionSaldo
} = produccionSlice.actions;

export const selectSemanasAnyo = ({ produccionSeccion }) => produccionSeccion.produccion.semanasAnyo;
export const selectDatosProduccionInicial = ({ produccionSeccion }) => produccionSeccion.produccion.datosProduccionInicial;
export const selectDatosProduccionTabla = ({ produccionSeccion }) => produccionSeccion.produccion.datosProduccionTabla;
export const selectDatosProduccionPalet = ({ produccionSeccion }) => produccionSeccion.produccion.datosProduccionPalet;
export const selectDatosProduccionSaldo = ({ produccionSeccion }) => produccionSeccion.produccion.datosProduccionSaldo;

export default produccionSlice.reducer;
