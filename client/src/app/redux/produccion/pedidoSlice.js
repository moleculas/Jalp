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

export const getPedidosMenu = createAsyncThunk(
    'produccionSeccion/pedido/getPedidosMenu',
    async (datos, { getState, dispatch }) => {
        try {
            const formData = new FormData();
            const losDatos = datos;
            formData.append("datos", JSON.stringify(losDatos));
            const response = await axios.post('/pedido/pedidosMenu', formData);
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
    pedidosMenu: null,
    semanaSeleccionadaMenu: null,
    actualizandoPedido: false
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
        setPedidosMenu: (state, action) => {
            state.pedidosMenu = action.payload;
        },
        setSemanaSeleccionadaMenu: (state, action) => {
            state.semanaSeleccionadaMenu = action.payload;
        },
        setActualizadoPedido: (state, action) => {
            state.actualizandoPedido = action.payload;
        },
    },
    extraReducers: {
        [getPedido.fulfilled]: (state, action) => {
            state.pedidoProduccion = action.payload;
        },
        [updatePedido.fulfilled]: (state, action) => {
            state.actualizandoPedido = true;
            const arrayPedido = [...state.pedidoProduccion];
            arrayPedido[arrayPedido.findIndex(item => item.semana === action.payload.semana)] = action.payload;
            state.pedidoProduccion = arrayPedido;
        },
        [getPedidosMenu.fulfilled]: (state, action) => {          
            state.pedidosMenu = action.payload;
        },
    },
});

export const {
    setPedido,
    setAnadirFilaId,
    setPedidosMenu,
    setSemanaSeleccionadaMenu,
    setActualizadoPedido
} = pedidoSlice.actions;

export const selectPedido = ({ produccionSeccion }) => produccionSeccion.pedido.pedidoProduccion;
export const selectAnadirFilaId = ({ produccionSeccion }) => produccionSeccion.pedido.anadirFilaId;
export const selectPedidosMenu = ({ produccionSeccion }) => produccionSeccion.pedido.pedidosMenu;
export const selectSemanaSeleccionadaMenu = ({ produccionSeccion }) => produccionSeccion.pedido.semanaSeleccionadaMenu;
export const selectActualizandoPedido = ({ produccionSeccion }) => produccionSeccion.pedido.actualizandoPedido;

export default pedidoSlice.reducer;
