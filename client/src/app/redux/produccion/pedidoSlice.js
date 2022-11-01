import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

//importacion acciones
import { showMessage } from 'app/redux/fuse/messageSlice';

export const getPedido = createAsyncThunk(
    'produccionSeccion/pedido/getPedido',
    async (datos, { getState, dispatch }) => {
        try {
            const formData = new FormData();
            const losDatos = datos;
            formData.append("datos", JSON.stringify(losDatos));
            const response = await axios.post('/pedido/pedido', formData);
            const data = await response.data;
            return data;
        } catch (err) {
            dispatch(showMessage({ message: err.response.data.message, variant: "error" }));
            return;
        };
    });

export const updatePedido = createAsyncThunk(
    'produccionSeccion/pedido/updatePedido',
    async (datos, { getState, dispatch }) => {
        const formData = new FormData();
        const losDatos = datos;
        formData.append("datos", JSON.stringify(losDatos));
        try {
            const response = await axios.post('/pedido/actualizar', formData);
            const data = await response.data;
            dispatch(showMessage({ message: "Pedido actualizado con éxito.", variant: "success" }));
            return data;
        } catch (err) {
            dispatch(showMessage({ message: err.response.data.message, variant: "error" }));
            return;
        };
    });

export const getPedidoProducto = createAsyncThunk(
    'produccionSeccion/pedido/getPedidoProducto',
    async (tipo, { getState, dispatch }) => {
        try {
            const response = await axios.get('/pedido/producto/' + tipo);
            const data = await response.data;
            return data;
        } catch (err) {
            dispatch(showMessage({ message: err.response.data.message, variant: "error" }));
            return;
        };
    });

const initialState = {
    pedidoProduccion: null,
    anadirFilaId: null,
    pedidoProducto: null
};

const pedidoSlice = createSlice({
    name: 'produccionSeccion/pedido',
    initialState,
    reducers: {
        setPedido: (state, action) => {
            state.pedidoProduccion = action.payload;
        },
        setAnadirFilaId: (state, action) => {
            state.anadirFilaId = action.payload;
        },
        setPedidoProducto: (state, action) => {
            state.pedidoProducto = action.payload;
        },
    },
    extraReducers: {
        [getPedido.fulfilled]: (state, action) => {
            state.pedidoProduccion = action.payload;
        },
        [updatePedido.fulfilled]: (state, action) => {
            const arrayPedido = [...state.pedidoProduccion];
            arrayPedido[arrayPedido.findIndex(item => item._id === action.payload._id)] = action.payload;                   
            state.pedidoProduccion = arrayPedido;
        },
        [getPedidoProducto.fulfilled]: (state, action) => {
            state.pedidoProducto = action.payload;
        },
    },
});

export const {
    setPedido,
    setAnadirFilaId,
    setPedidoProducto
} = pedidoSlice.actions;

export const selectPedido = ({ produccionSeccion }) => produccionSeccion.pedido.pedidoProduccion;
export const selectAnadirFilaId = ({ produccionSeccion }) => produccionSeccion.pedido.anadirFilaId;
export const selectPedidoProducto = ({ produccionSeccion }) => produccionSeccion.pedido.pedidoProducto;

export default pedidoSlice.reducer;
