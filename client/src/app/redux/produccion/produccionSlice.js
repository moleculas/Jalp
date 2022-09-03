import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

//importacion acciones
import { showMessage } from 'app/redux/fuse/messageSlice';

export const getEscandallo = createAsyncThunk(
  'produccionSeccion/produccion/getEscandallo',
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
    'produccionSeccion/produccion/updateEscandallo',
    async (escandallo, { getState, dispatch }) => {
      dispatch(setEscandallo(null));
      const formData = new FormData();
      const losDatos = {
        escandallo
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
  openFormEscandallo: false
};

const produccionSlice = createSlice({
  name: 'produccionSeccion/produccion',
  initialState,
  reducers: {
    setEscandallo: (state, action) => {
      state.escandallo = action.payload;
    },
    setOpenFormEscandallo: (state, action) => {
      state.openFormEscandallo = action.payload;
    },
  },
  extraReducers: {   
  },
});

export const { setEscandallo, setOpenFormEscandallo } = produccionSlice.actions;

export const selectEscandallo = ({ produccionSeccion }) => produccionSeccion.produccion.escandallo;
export const selectOpenFormEscandallo = ({ produccionSeccion }) => produccionSeccion.produccion.openFormEscandallo;

export const calculoEscandallo = (escandallo) => (dispatch, getState) => {
  const arrayPatines = escandallo.filter(item => item.familia === 'patin' && !item.subFamilia);
  const arrayPatinDerecho = escandallo.filter(item => item.familia === 'patin' && item.subFamilia === 'patin derecho');
  let varPatinDerecho = 0;
  arrayPatinDerecho.map((patin) => {
    varPatinDerecho += patin.cubico;
  });
  const arrayPatinIzquierdo = escandallo.filter(item => item.familia === 'patin' && item.subFamilia === 'patin izquierdo');
  let varPatinIzquierdo = 0;
  arrayPatinIzquierdo.map((patin) => {
    varPatinIzquierdo += patin.cubico;
  });
  const arrayPatinCentral = escandallo.filter(item => item.familia === 'patin' && item.subFamilia === 'patin central');
  let varPatinCentral = 0;
  arrayPatinCentral.map((patin) => {
    varPatinCentral += patin.cubico;
  });
  const arrayPalets = escandallo.filter(item => item.familia === 'palet' && !item.subFamilia);
  const objetoEscandallo = {
    arrayPatines,
    arrayPatinDerecho,
    varPatinDerecho,
    arrayPatinIzquierdo,
    varPatinIzquierdo,
    arrayPatinCentral,
    varPatinCentral,
    arrayPalets
  };
  dispatch(setEscandallo(objetoEscandallo));
};

export default produccionSlice.reducer;
