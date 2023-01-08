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
            dispatch(clasificaCotizacion(data));
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
            dispatch(clasificaCotizacion(data));
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
            dispatch(clasificaCotizacion(data));
        } catch (err) {
            dispatch(showMessage({ message: err.response.data.message, variant: "error" }));
            return;
        };
    });

const initialState = {
    anadirFilaIdCotizacion: null,
    objetoCotizacionCabecera: null,
    objetoCotizacionCuerpo: null,
    objetoCotizacionLateralSup: null,
    objetoCotizacionLateralInf: null,
    openSidebarCotizacion: {estado: false, objeto: null},
    cotizaciones: null,
    noteDialogId: null,
    dialogIndex: null,    
    registraIntervencionDialog: null,
    anadirFila: false,
    actualizandoCotizacion: { estado: false, objeto: false, id: null },
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
        setOpenSidebarCotizacion: (state, action) => {
            state.openSidebarCotizacion = action.payload;
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
        setDialogIndex: (state, action) => {
            state.dialogIndex = action.payload;
        },       
        setRegistraIntervencionDialog: (state, action) => {
            state.registraIntervencionDialog = action.payload;
        },
        setActualizandoCotizacion: (state, action) => {
            state.actualizandoCotizacion = action.payload;
        },
    },
    extraReducers: {       
        [getCotizaciones.fulfilled]: (state, action) => {
            state.cotizaciones = action.payload;
        },
    },
});

export const {
    setAnadirFilaIdCotizacion,
    setObjetoCotizacionCabecera,
    setObjetoCotizacionCuerpo,
    setObjetoCotizacionLateralSup,
    setObjetoCotizacionLateralInf,
    setOpenSidebarCotizacion,
    setCotizaciones,
    openNoteDialog,
    closeNoteDialog,
    setDialogIndex,   
    setRegistraIntervencionDialog,
    setActualizandoCotizacion
} = cotizacionSlice.actions;

export const selectAnadirFilaIdCotizacion = ({ produccionSeccion }) => produccionSeccion.cotizacion.anadirFilaIdCotizacion;
export const selectObjetoCotizacionCabecera = ({ produccionSeccion }) => produccionSeccion.cotizacion.objetoCotizacionCabecera;
export const selectObjetoCotizacionCuerpo = ({ produccionSeccion }) => produccionSeccion.cotizacion.objetoCotizacionCuerpo;
export const selectObjetoCotizacionLateralSup = ({ produccionSeccion }) => produccionSeccion.cotizacion.objetoCotizacionLateralSup;
export const selectObjetoCotizacionLateralInf = ({ produccionSeccion }) => produccionSeccion.cotizacion.objetoCotizacionLateralInf;
export const selectOpenSidebarCotizacion = ({ produccionSeccion }) => produccionSeccion.cotizacion.openSidebarCotizacion;
export const selectCotizaciones = ({ produccionSeccion }) => produccionSeccion.cotizacion.cotizaciones;
export const selectNoteDialogId = ({ produccionSeccion }) => produccionSeccion.cotizacion.noteDialogId;
export const selectDialogIndex = ({ produccionSeccion }) => produccionSeccion.cotizacion.dialogIndex;
export const selectRegistraIntervencionDialog = ({ produccionSeccion }) => produccionSeccion.cotizacion.registraIntervencionDialog;
export const selectActualizandoCotizacion = ({ produccionSeccion }) => produccionSeccion.cotizacion.actualizandoCotizacion;

export const vaciarDatosGeneral = () => (dispatch, getState) => {   
    dispatch(setActualizandoCotizacion({ estado: false, objeto: false, id: null }));
    dispatch(setObjetoCotizacionCabecera(null));
    dispatch(setObjetoCotizacionCuerpo(null));
    dispatch(setObjetoCotizacionLateralSup(null));
    dispatch(setObjetoCotizacionLateralInf(null));
};

const clasificaCotizacion = (data) => (dispatch, getState) => {
    dispatch(setActualizandoCotizacion({ estado: true, objeto: true, id: data._id }));
    //cotizacionCabecera
    let objetoCotizacionCabecera = {
        descripcion: data.descripcion,
        fecha: data.fecha,
        cliente: data.cliente,
        of: data.of,
        unidades: data.unidades
    };
    dispatch(setObjetoCotizacionCabecera(objetoCotizacionCabecera));
    //cotizacionCuerpo
    let objetoCotizacionCuerpo = {
        filasCuerpo: data.filasCuerpo,
        sumCuerpo: data.sumCuerpo,
        sumVolumen: data.sumVolumen,
        merma: data.merma
    };
    dispatch(setObjetoCotizacionCuerpo(objetoCotizacionCuerpo));
    //cotizacionLateralSup    
    let objetoCotizacionLateralSup = {
        filasClavos: data.filasClavos,
        sumClavos: data.sumClavos,
        filaCorteMadera: data.filaCorteMadera,
        sumCorteMadera: data.sumCorteMadera,
        filaMontaje: data.filaMontaje,
        sumMontaje: data.sumMontaje,
        filaPatines: data.filaPatines,
        sumPatines: data.sumPatines,
        filaTransporte: data.filaTransporte,
        sumTransporte: data.sumTransporte,
        sumTratamiento: data.sumTratamiento,
        sumLateralSup: data.sumLateralSup,
        filasExtra: data.filasExtra
    };
    dispatch(setObjetoCotizacionLateralSup(objetoCotizacionLateralSup));
    //cotizacionLateralInf     
    let objetoCotizacionLateralInf = {
        cu: data.cu,
        precio_venta: data.precio_venta,
        mc: data.mc,
        mc_porcentaje: data.mc_porcentaje,
        precio: data.precio,
    };
    dispatch(setObjetoCotizacionLateralInf(objetoCotizacionLateralInf));
};

export default cotizacionSlice.reducer;