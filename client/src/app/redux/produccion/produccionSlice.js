import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

//importacion acciones
import { showMessage } from 'app/redux/fuse/messageSlice';

export const getProduccionLX = createAsyncThunk(
  'produccionSeccion/produccion/getProduccionLX',
  async (datos, { getState, dispatch }) => {
    try {
      const formData = new FormData();
      const losDatos = datos;
      formData.append("datos", JSON.stringify(losDatos));
      const response = await axios.post('/produccion/lx', formData);
      const data = await response.data;
      dispatch(clasificaProduccionLX(data, datos.periodo, "mes"));
    } catch (err) {
      dispatch(showMessage({ message: err.response.data.message, variant: "error" }));
      return;
    };
  });

export const getProduccionLXMesAnterior = createAsyncThunk(
  'produccionSeccion/produccion/getProduccionLXMesAnterior',
  async (datos, { getState, dispatch }) => {
    try {
      const formData = new FormData();
      const losDatos = datos;
      formData.append("datos", JSON.stringify(losDatos));
      const response = await axios.post('/produccion/lx', formData);
      const data = await response.data;
      dispatch(clasificaProduccionLX(data, datos.periodo, "mesAnterior"));
    } catch (err) {
      dispatch(showMessage({ message: err.response.data.message, variant: "error" }));
      return;
    };
  });

export const updateProduccionLX = createAsyncThunk(
  'produccionSeccion/produccion/updateProduccionLX',
  async (datos, { getState, dispatch }) => {
    try {
      const formData = new FormData();
      const losDatos = datos;
      formData.append("datos", JSON.stringify(losDatos));
      const response = await axios.post('/produccion/actualizarlx', formData);
      const data = await response.data;
      if (datos.mensaje) {
        dispatch(showMessage({ message: "Datos actualizados con éxito.", variant: "success" }));
      };
      return data;
    } catch (err) {
      dispatch(showMessage({ message: err.response.data.message, variant: "error" }));
      return;
    };
  });

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

export const updateProduccionTabla = createAsyncThunk(
  'produccionSeccion/produccion/updateProduccionTabla',
  async (datos, { getState, dispatch }) => {
    try {
      const formData = new FormData();
      const losDatos = datos;
      formData.append("datos", JSON.stringify(losDatos));
      const response = await axios.post('/produccion/actualizarTabla', formData);
      const data = await response.data;
      if (datos.mensaje) {
        dispatch(showMessage({ message: "Datos actualizados con éxito.", variant: "success" }));
      };
      return data;
    } catch (err) {
      dispatch(showMessage({ message: err.response.data.message, variant: "error" }));
      return;
    };
  });

const initialState = {
  datosProduccionLX: null,
  datosProduccionLXMesAnterior: null,
  datosProduccionTabla: null,
  datosProduccionPalet: null,
  datosProduccionSaldo: null,
  cambioPeriodo: false
};

const produccionSlice = createSlice({
  name: 'produccionSeccion/produccion',
  initialState,
  reducers: {
    setDatosProduccionLX: (state, action) => {
      state.datosProduccionLX = action.payload;
    },
    setDatosProduccionLXMesAnterior: (state, action) => {
      state.datosProduccionLXMesAnterior = action.payload;
    },
    setDatosProduccionTabla: (state, action) => {
      state.datosProduccionTabla = action.payload;
    },
    setDatosProduccionPalet: (state, action) => {
      state.datosProduccionPalet = action.payload;
    },
    setDatosProduccionSaldo: (state, action) => {
      state.datosProduccionSaldo = action.payload;
    },
  },
  extraReducers: {
    [updateProduccionLX.fulfilled]: (state, action) => {
      const arrayProduccionLX = [...state.datosProduccionLX];
      arrayProduccionLX[arrayProduccionLX.findIndex(item => item._id === action.payload._id)] = action.payload;
      state.datosProduccionLX = arrayProduccionLX;
    },
    [getProduccion.fulfilled]: (state, action) => {
      state.datosProduccionInicial = action.payload.inicial;
      state.datosProduccionTabla = action.payload.tabla;
      state.datosProduccionPalet = action.payload.palet;
      state.datosProduccionSaldo = action.payload.saldo;
    },
    [updateProduccionTabla.fulfilled]: (state, action) => {
      state.datosProduccionTabla = action.payload.tabla;
      state.datosProduccionPalet = action.payload.palet;
    },
  },
});

export const {
  setDatosProduccionLX,
  setDatosProduccionLXMesAnterior,
  setDatosProduccionTabla,
  setDatosProduccionPalet,
  setDatosProduccionSaldo,
} = produccionSlice.actions;

export const selectDatosProduccionLX = ({ produccionSeccion }) => produccionSeccion.produccion.datosProduccionLX;
export const selectDatosProduccionLXMesAnterior = ({ produccionSeccion }) => produccionSeccion.produccion.datosProduccionLXMesAnterior;
export const selectDatosProduccionTabla = ({ produccionSeccion }) => produccionSeccion.produccion.datosProduccionTabla;
export const selectDatosProduccionPalet = ({ produccionSeccion }) => produccionSeccion.produccion.datosProduccionPalet;
export const selectDatosProduccionSaldo = ({ produccionSeccion }) => produccionSeccion.produccion.datosProduccionSaldo;

const clasificaProduccionLX = (data, periodo, mes) => (dispatch, getState) => {
  const arrayProduccion = [];
  periodo.map((semana) => {
    arrayProduccion.push([{ semana }, data.filter(item => item.semana === Number(semana.semana))]);
  });
  if (mes === "mes") {
    dispatch(setDatosProduccionLX(arrayProduccion));
  } else {
    dispatch(setDatosProduccionLXMesAnterior(arrayProduccion));
  };
};

export default produccionSlice.reducer;
