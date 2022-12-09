import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import _ from '@lodash';

//constantes
import { REDONDEADO } from 'constantes';

//importacion acciones
import { showMessage } from 'app/redux/fuse/messageSlice';

export const getEscandallo = createAsyncThunk(
  'produccionSeccion/escandallo/getEscandallo',
  async (_, { getState, dispatch }) => {
    try {
      const response = await axios.get('/escandallo');
      const data = await response.data;
      dispatch(calculoEscandallo(data));
    } catch (err) {
      dispatch(showMessage({ message: err.response.data.message, variant: "error" }));
      return;
    };
  });

export const updateEscandallo = createAsyncThunk(
  'produccionSeccion/escandallo/updateEscandallo',
  async (objetoEscandallo, { getState, dispatch }) => {
    const formData = new FormData();
    const losDatos = {
      objetoEscandallo
    };
    formData.append("datos", JSON.stringify(losDatos));
    try {
      const response = await axios.post('/escandallo/actualizar', formData);
      const data = await response.data;
      dispatch(calculoEscandallo(data));
      dispatch(showMessage({ message: 'Escandallo actualizado con éxito.', variant: "success" }));
    } catch (err) {
      dispatch(showMessage({ message: err.response.data.message, variant: "error" }));
      return;
    };
  });

const initialState = {
  escandallo: null,
  openFormEscandallo: false,
};

const escandalloSlice = createSlice({
  name: 'produccionSeccion/escandallo',
  initialState,
  reducers: {
    setEscandallo: (state, action) => {
      state.escandallo = action.payload;
    },
    setOpenFormEscandallo: (state, action) => {
      state.openFormEscandallo = action.payload;
    }
  },
  extraReducers: {
  },
});

export const {
  setEscandallo,
  setOpenFormEscandallo,
} = escandalloSlice.actions;

export const selectEscandallo = ({ produccionSeccion }) => produccionSeccion.escandallo.escandallo;
export const selectOpenFormEscandallo = ({ produccionSeccion }) => produccionSeccion.escandallo.openFormEscandallo;

export const calculoEscandallo = (escandallo) => (dispatch, getState) => {
  const arrayPatines = escandallo.escandallo.filter(item => item.familia === 'patin' && !item.subFamilia);
  const arrayPatinDerecho = escandallo.escandallo.filter(item => item.familia === 'patin' && item.subFamilia === 'patin derecho');
  let varPatinDerecho = 0;
  arrayPatinDerecho.map((patin) => {
    varPatinDerecho += patin.cubico;
  });
  const arrayPatinIzquierdo = escandallo.escandallo.filter(item => item.familia === 'patin' && item.subFamilia === 'patin izquierdo');
  let varPatinIzquierdo = 0;
  arrayPatinIzquierdo.map((patin) => {
    varPatinIzquierdo += patin.cubico;
  });
  const arrayPatinCentral = escandallo.escandallo.filter(item => item.familia === 'patin' && item.subFamilia === 'patin central');
  let varPatinCentral = 0;
  arrayPatinCentral.map((patin) => {
    varPatinCentral += patin.cubico;
  });
  const arrayPalets = escandallo.escandallo.filter(item => item.familia === 'palet' && !item.subFamilia);
  const arrayMermaPatinDerecho = escandallo.merma.filter(item => item.familia === 'patin' && item.subFamilia === 'patin derecho');
  const arrayMermaPatinIzquierdo = escandallo.merma.filter(item => item.familia === 'patin' && item.subFamilia === 'patin izquierdo');
  const arrayMermaPatinCentral = escandallo.merma.filter(item => item.familia === 'patin' && item.subFamilia === 'patin central');
  const objetoEscandallo = {
    arrayPatines,
    arrayPatinDerecho,
    varPatinDerecho: _.round(varPatinDerecho + arrayMermaPatinDerecho[0].cubico, REDONDEADO),
    arrayPatinIzquierdo,
    varPatinIzquierdo: _.round(varPatinIzquierdo + arrayMermaPatinIzquierdo[0].cubico, REDONDEADO),
    arrayPatinCentral,
    varPatinCentral: _.round(varPatinCentral + arrayMermaPatinCentral[0].cubico, REDONDEADO),
    arrayPalets,
    mermaPatinDerecho: arrayMermaPatinDerecho[0],
    mermaPatinIzquierdo: arrayMermaPatinIzquierdo[0],
    mermaPatinCentral: arrayMermaPatinCentral[0]
  };
  dispatch(setEscandallo(objetoEscandallo));
};

export default escandalloSlice.reducer;
