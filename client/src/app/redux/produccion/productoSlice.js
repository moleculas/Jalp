import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

//importacion acciones
import { showMessage } from 'app/redux/fuse/messageSlice';

export const addProducto = createAsyncThunk(
    'produccionSeccion/producto/addProducto',
    async (objetoProducto, { getState, dispatch }) => {
        const formData = new FormData();
        const losDatos = objetoProducto;
        formData.append("datos", JSON.stringify(losDatos));
        try {
            const response = await axios.post('/producto', formData);
            const data = await response.data;
            dispatch(showMessage({ message: "Datos registrados con éxito.", variant: "success" }));
            return data;
        } catch (err) {
            dispatch(showMessage({ message: err.response.data.message, variant: "error" }));
            return;
        };
    });

export const deleteProducto = createAsyncThunk(
    'produccionSeccion/producto/deleteProducto',
    async (id, { getState, dispatch }) => {
        try {
            const response = await axios.delete(`/producto/${id}`);
            const data = await response.data;
            dispatch(showMessage({ message: data.message, variant: "success" }));
            return data;
        } catch (err) {
            dispatch(showMessage({ message: err.response.data.message, variant: "error" }));
            return;
        };
    });

export const updateProducto = createAsyncThunk(
    'produccionSeccion/producto/updateProducto',
    async (datosActualizar, { getState, dispatch }) => {
        const formData = new FormData();
        const losDatos = datosActualizar.producto;
        formData.append("datos", JSON.stringify(losDatos));
        try {
            const response = await axios.put(`/producto/${datosActualizar.id}`, formData);
            const data = await response.data;
            dispatch(showMessage({ message: "Datos actualizados con éxito.", variant: "success" }));
            return data;
        } catch (err) {
            dispatch(showMessage({ message: err.response.data.message, variant: "error" }));
            return;
        };
    });

export const getProductos = createAsyncThunk(
    'produccionSeccion/producto/getProductos',
    async (consulta, { getState, dispatch }) => {
        const formData = new FormData();
        const losDatos = consulta;
        formData.append("datos", JSON.stringify(losDatos));
        try {
            const response = await axios.post('/producto/obtener', formData);
            const data = await response.data;
            return data;
        } catch (err) {
            dispatch(showMessage({ message: err.response.data.message, variant: "error" }));
            return;
        };
    });

export const getProductosPayload = createAsyncThunk(
    'produccionSeccion/producto/getProductosPayload',
    async (consulta, { getState, dispatch }) => {
        const formData = new FormData();
        const losDatos = consulta;
        formData.append("datos", JSON.stringify(losDatos));
        try {
            const response = await axios.post('/producto/obtener', formData);
            const data = await response.data;
            return data;
        } catch (err) {
            dispatch(showMessage({ message: err.response.data.message, variant: "error" }));
            return;
        };
    });

export const getProducto = createAsyncThunk(
    'produccionSeccion/producto/getProducto',
    async (objetoItem, { getState, dispatch }) => {
        const formData = new FormData();
        const losDatos = objetoItem;
        formData.append("datos", JSON.stringify(losDatos));
        try {
            const response = await axios.post('/producto/obtenerItem', formData);
            const data = await response.data;
            return data;
        } catch (err) {
            dispatch(showMessage({ message: err.response.data.message, variant: "error" }));
            return;
        };
    });

const initialState = {
    productos: null
};

const productoSlice = createSlice({
    name: 'produccionSeccion/producto',
    initialState,
    reducers: {
        setProductos: (state, action) => {
            state.productos = action.payload;
        },
    },
    extraReducers: {
        [getProductos.fulfilled]: (state, action) => {
            state.productos = action.payload;
        },
    },
});

export const {
    setProductos
} = productoSlice.actions;

export const selectProductos = ({ produccionSeccion }) => produccionSeccion.producto.productos;

export default productoSlice.reducer;
