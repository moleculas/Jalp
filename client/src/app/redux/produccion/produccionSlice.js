import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

//importacion acciones
import { showMessage } from 'app/redux/fuse/messageSlice';

export const getProduccionInicial = createAsyncThunk(
  'produccionSeccion/produccion/getProduccionInicial',
  async (datos, { getState, dispatch }) => {
    try {
      const formData = new FormData();
      const losDatos = datos;
      formData.append("datos", JSON.stringify(losDatos));
      const response = await axios.post('/produccion/inicial', formData);
      const data = await response.data;
      dispatch(clasificaProductos(data, "mes"));
    } catch (err) {
      dispatch(showMessage({ message: err.response.data.message, variant: "error" }));
      return;
    };
  });

export const getProduccionInicialMesAnterior = createAsyncThunk(
  'produccionSeccion/produccion/getProduccionInicialMesAnterior',
  async (datos, { getState, dispatch }) => {
    try {
      const formData = new FormData();
      const losDatos = datos;
      formData.append("datos", JSON.stringify(losDatos));
      const response = await axios.post('/produccion/inicial', formData);
      const data = await response.data;
      dispatch(clasificaProductos(data, "mesAnterior"));
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

export const updateProduccionInicial = createAsyncThunk(
  'produccionSeccion/produccion/updateProduccionInicial',
  async (datos, { getState, dispatch }) => {
    try {
      const formData = new FormData();
      const losDatos = datos;
      formData.append("datos", JSON.stringify(losDatos));
      const response = await axios.post('/produccion/actualizarInicial', formData);
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
  datosProduccionInicial: null,
  datosProduccionTabla: null,
  datosProduccionPalet: null,
  datosProduccionSaldo: null,
  datosProduccionInicialProductos: null,
  datosProduccionInicialProductosMesAnterior: null,
  cambioPeriodo: false
};

const produccionSlice = createSlice({
  name: 'produccionSeccion/produccion',
  initialState,
  reducers: {    
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
    setDatosProduccionInicialProductos: (state, action) => {
      state.datosProduccionInicialProductos = action.payload;
    },
    setDatosProduccionInicialProductosMesAnterior: (state, action) => {
      state.datosProduccionInicialProductosMesAnterior = action.payload;
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
  setDatosProduccionTabla,
  setDatosProduccionInicial,
  setDatosProduccionPalet,
  setDatosProduccionSaldo,
  setDatosProduccionInicialProductos,
  setDatosProduccionInicialProductosMesAnterior, 
} = produccionSlice.actions;

export const selectDatosProduccionInicial = ({ produccionSeccion }) => produccionSeccion.produccion.datosProduccionInicial;
export const selectDatosProduccionTabla = ({ produccionSeccion }) => produccionSeccion.produccion.datosProduccionTabla;
export const selectDatosProduccionPalet = ({ produccionSeccion }) => produccionSeccion.produccion.datosProduccionPalet;
export const selectDatosProduccionSaldo = ({ produccionSeccion }) => produccionSeccion.produccion.datosProduccionSaldo;
export const selectDatosProduccionInicialProductos = ({ produccionSeccion }) => produccionSeccion.produccion.datosProduccionInicialProductos;
export const selectDatosProduccionInicialProductosMesAnterior = ({ produccionSeccion }) => produccionSeccion.produccion.datosProduccionInicialProductosMesAnterior;

const clasificaProductos = (data, periodo) => (dispatch, getState) => {
  const objetoClasificados = {
    palet: { inicial: [], saldo: [] },
    taco: { inicial: [], saldo: [] },
    patin: { inicial: [], saldo: [] }
  };
  data.inicial.forEach((producto) => {
    switch (producto.familia) {
      case "palet":
        objetoClasificados.palet.inicial.push(producto);
        break;
      case "taco":
        objetoClasificados.taco.inicial.push(producto);
        break;
      case "patin":
        objetoClasificados.patin.inicial.push(producto);
        break;
      default:
    };
  });
  data.saldo.forEach((producto) => {
    switch (producto.familia) {
      case "palet":
        objetoClasificados.palet.saldo.push(producto);
        break;
      case "taco":
        objetoClasificados.taco.saldo.push(producto);
        break;
      case "patin":
        objetoClasificados.patin.saldo.push(producto);
        break;
      default:
    };
  });
  if (periodo === "mes") {
    dispatch(setDatosProduccionInicialProductos(objetoClasificados));
  } else {
    dispatch(setDatosProduccionInicialProductosMesAnterior(objetoClasificados));
  };
};

export default produccionSlice.reducer;
