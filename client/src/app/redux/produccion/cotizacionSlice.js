import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

//importacion acciones
import { showMessage } from 'app/redux/fuse/messageSlice';

export const getOf = createAsyncThunk(
    'produccionSeccion/cotizacion/getOf',
    async (of, { getState, dispatch }) => {
        try {
            const response = await axios.get('/cotizacion/of/' + of);
            const data = await response.data;
            return data;
        } catch (err) {
            dispatch(showMessage({ message: err.response.data.message, variant: "error" }));
            return;
        };
    });

export const addCotizacion = createAsyncThunk(
    'produccionSeccion/cotizacion/addCotizacion',
    async (objetoCotizacion, { getState, dispatch }) => {
        const formData = new FormData();
        const losDatos = objetoCotizacion;
        formData.append("datos", JSON.stringify(losDatos));
        try {
            const response = await axios.post('/cotizacion', formData);
            const data = await response.data;
            dispatch(showMessage({ message: "Datos registrados con éxito.", variant: "success" }));
            return data;
        } catch (err) {
            dispatch(showMessage({ message: err.response.data.message, variant: "error" }));
            return;
        };
    });

export const deleteCotizacion = createAsyncThunk(
    'produccionSeccion/cotizacion/deleteCotizacion',
    async (id, { getState, dispatch }) => {
        try {
            const response = await axios.delete(`/cotizacion/${id}`);
            const data = await response.data;
            dispatch(showMessage({ message: data.message, variant: "success" }));
            return data;
        } catch (err) {
            dispatch(showMessage({ message: err.response.data.message, variant: "error" }));
            return;
        };
    });

export const updateCotizacion = createAsyncThunk(
    'produccionSeccion/cotizacion/updateCotizacion',
    async (datosActualizar, { getState, dispatch }) => {
        const formData = new FormData();
        const losDatos = datosActualizar.objeto;
        formData.append("datos", JSON.stringify(losDatos));
        try {
            const response = await axios.put(`/cotizacion/${datosActualizar.id}`, formData);
            const data = await response.data;
            dispatch(showMessage({ message: "Datos actualizados con éxito.", variant: "success" }));
            return data;
        } catch (err) {
            dispatch(showMessage({ message: err.response.data.message, variant: "error" }));
            return;
        };
    });

export const getCotizaciones = createAsyncThunk(
    'produccionSeccion/cotizacion/getCotizaciones',
    async (_, { getState, dispatch }) => {
        try {
            const response = await axios.get('/cotizacion');
            const data = await response.data;
            return data;
        } catch (err) {
            dispatch(showMessage({ message: err.response.data.message, variant: "error" }));
            return;
        };
    });

export const getCotizacion = createAsyncThunk(
    'produccionSeccion/cotizacion/getCotizacion',
    async (id, { getState, dispatch }) => {
        try {
            const response = await axios.get('/cotizacion/' + id);
            const data = await response.data;
            return data;
        } catch (err) {
            dispatch(showMessage({ message: err.response.data.message, variant: "error" }));
            return;
        };
    });

const initialState = {
    anadirFilaIdCotizacion: false,
    objetoCotizacionCabecera: null,
    objetoCotizacionCuerpo: null,
    objetoCotizacionLateralSup: null,
    objetoCotizacionLateralInf: null,
    objetoCotizacionActualizado: null,
    openFormCotizacion: false,
    cotizaciones: null,
    noteDialogId: null,
    mermaIndex: null,
    registraIntervencionDialog: null
};

const cotizacionSlice = createSlice({
    name: 'produccionSeccion/cotizacion',
    initialState,
    reducers: {
        setAnadirFilaIdCotizacion: (state, action) => {
            state.anadirFilaIdCotizacion = action.payload;
        },
        setObjetoCotizacionCabecera: (state, action) => {
            state.objetoCotizacionCabecera = action.payload;
        },
        setObjetoCotizacionCuerpo: (state, action) => {
            state.objetoCotizacionCuerpo = action.payload;
        },
        setObjetoCotizacionLateralSup: (state, action) => {
            state.objetoCotizacionLateralSup = action.payload;
        },
        setObjetoCotizacionLateralInf: (state, action) => {
            state.objetoCotizacionLateralInf = action.payload;
        },
        setObjetoCotizacionActualizado: (state, action) => {
            state.objetoCotizacionActualizado = action.payload;
        },
        setOpenFormCotizacion: (state, action) => {
            state.openFormCotizacion = action.payload;
        },
        setCotizaciones: (state, action) => {
            state.cotizaciones = action.payload;
        },
        openNoteDialog: (state, action) => {
            state.noteDialogId = action.payload;
        },
        closeNoteDialog: (state, action) => {
            state.noteDialogId = action.null;
        },
        setMermaIndex: (state, action) => {
            state.mermaIndex = action.payload;
        },
        setRegistraIntervencionDialog: (state, action) => {
            state.registraIntervencionDialog = action.payload;
        },
    },
    extraReducers: {
        [addCotizacion.fulfilled]: (state, action) => {
            state.objetoCotizacionActualizado = action.payload;
        },
        [updateCotizacion.fulfilled]: (state, action) => {
            state.objetoCotizacionActualizado = action.payload;
        },
        [getCotizaciones.fulfilled]: (state, action) => {
            state.cotizaciones = action.payload;
        },
        [getCotizacion.fulfilled]: (state, action) => {
            state.objetoCotizacionActualizado = action.payload;
        },
    },
});

export const {
    setAnadirFilaIdCotizacion,
    setObjetoCotizacionCabecera,
    setObjetoCotizacionCuerpo,
    setObjetoCotizacionLateralSup,
    setObjetoCotizacionLateralInf,
    setObjetoCotizacionActualizado,
    setOpenFormCotizacion,
    setCotizaciones,
    openNoteDialog,
    closeNoteDialog,
    setMermaIndex,
    setRegistraIntervencionDialog
} = cotizacionSlice.actions;

export const selectAnadirFilaIdCotizacion = ({ produccionSeccion }) => produccionSeccion.cotizacion.anadirFilaIdCotizacion;
export const selectObjetoCotizacionCabecera = ({ produccionSeccion }) => produccionSeccion.cotizacion.objetoCotizacionCabecera;
export const selectObjetoCotizacionCuerpo = ({ produccionSeccion }) => produccionSeccion.cotizacion.objetoCotizacionCuerpo;
export const selectObjetoCotizacionLateralSup = ({ produccionSeccion }) => produccionSeccion.cotizacion.objetoCotizacionLateralSup;
export const selectObjetoCotizacionLateralInf = ({ produccionSeccion }) => produccionSeccion.cotizacion.objetoCotizacionLateralInf;
export const selectObjetoCotizacionActualizado = ({ produccionSeccion }) => produccionSeccion.cotizacion.objetoCotizacionActualizado;
export const selectOpenFormCotizacion = ({ produccionSeccion }) => produccionSeccion.cotizacion.openFormCotizacion;
export const selectCotizaciones = ({ produccionSeccion }) => produccionSeccion.cotizacion.cotizaciones;
export const selectNoteDialogId = ({ produccionSeccion }) => produccionSeccion.cotizacion.noteDialogId;
export const selectMermaIndex = ({ produccionSeccion }) => produccionSeccion.cotizacion.mermaIndex;
export const selectRegistraIntervencionDialog = ({ produccionSeccion }) => produccionSeccion.cotizacion.registraIntervencionDialog;

export const vaciarDatosGeneral = (actualizacion) => (dispatch, getState) => {
    !actualizacion && dispatch(setObjetoCotizacionActualizado(null));
    dispatch(setObjetoCotizacionCabecera(null));
    dispatch(setObjetoCotizacionCuerpo(null));
    dispatch(setObjetoCotizacionLateralSup(null));
    dispatch(setObjetoCotizacionLateralInf(null));
};

export default cotizacionSlice.reducer;
