import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

//importacion acciones
import { showMessage } from 'app/redux/fuse/messageSlice';

export const getObjetivos = createAsyncThunk(
    'produccionSeccion/objetivos/getObjetivos',
    async (_, { getState, dispatch }) => {
        try {
            const response = await axios.get('/objetivos');
            const data = await response.data;
            return data;
        } catch (err) {
            dispatch(showMessage({ message: err.response.data.message, variant: "error" }));
            return;
        };
    });

export const updateObjetivos = createAsyncThunk(
    'produccionSeccion/objetivos/updateObjetivos',
    async (objetivos, { getState, dispatch }) => {
        const formData = new FormData();
        const losDatos = {
            objetivos
        };
        formData.append("datos", JSON.stringify(losDatos));
        try {
            const response = await axios.post('/objetivos/actualizar', formData);
            const data = await response.data;            
            dispatch(showMessage({ message: data.message, variant: "success" }));
        } catch (err) {
            dispatch(showMessage({ message: err.response.data.message, variant: "error" }));
            return;
        };
    });

const initialState = {
    objetivos: null,
};

const objetivosSlice = createSlice({
    name: 'produccionSeccion/objetivos',
    initialState,
    reducers: {
        setObjetivos: (state, action) => {
            state.objetivos = action.payload;
        },
    },
    extraReducers: {
        [getObjetivos.fulfilled]: (state, action) => {
            state.objetivos = action.payload;
        },
    },
});

export const { setObjetivos } = objetivosSlice.actions;

export const selectObjetivos = ({ produccionSeccion }) => produccionSeccion.objetivos.objetivos;

export default objetivosSlice.reducer;
