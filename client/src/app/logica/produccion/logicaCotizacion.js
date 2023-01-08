import _ from '@lodash';

//importacion acciones
import {
    setObjetoCotizacionCuerpo,
    setRegistraIntervencionDialog,
    setObjetoCotizacionLateralSup,
    setObjetoCotizacionCabecera,
    setObjetoCotizacionLateralInf
} from 'app/redux/produccion/cotizacionSlice';
import { formateado } from 'app/logica/produccion/logicaProduccion';

//constantes
import { REDONDEADO } from 'constantes';

//CABECERA

export const calculosTablaCabecera = (objetoCabecera) => (dispatch, getState) => {
    const arrayTabla = [];
    let objetoFila = { ...objetoCabecera };
    objetoFila.descripcion = objetoCabecera.descripcion;
    objetoFila.of = objetoCabecera.of ? objetoCabecera.of : '';
    objetoFila.unidades = objetoCabecera.unidades;
    arrayTabla.push(objetoFila);
    return arrayTabla
};

export const actualizarTablaCabecera = (arrayTabla, descripcion) => (dispatch, getState) => {
    let datosCotizacionUpdate = {};
    datosCotizacionUpdate = {
        descripcion: descripcion ? descripcion : 'Sin descripción',
        fecha: arrayTabla[0].fecha,
        cliente: arrayTabla[0].cliente,
        of: arrayTabla[0].of,
        unidades: arrayTabla[0].unidades,
    };
    dispatch(setObjetoCotizacionCabecera(datosCotizacionUpdate));
};

//CUERPO

export const calculosTablaCuerpo = (tabla) => (dispatch, getState) => {
    const cotizacionCuerpo = getState().produccionSeccion.cotizacion.objetoCotizacionCuerpo;
    const arrayTabla = [];
    let arrayFilas = [];
    if (cotizacionCuerpo && cotizacionCuerpo.filasCuerpo.length > 0) {
        arrayFilas = cotizacionCuerpo.filasCuerpo;
    };
    tabla.map((fila, index) => {
        let objetoFila = {};
        let merma = [];
        let recalcularMerma = false;
        let proveedor, precio_m3, largo, ancho, grueso;
        if (arrayFilas[index]) {
            merma = arrayFilas[index].filaMerma;
            proveedor = arrayFilas[index].proveedor;
            precio_m3 = arrayFilas[index].precio_m3;
            largo = arrayFilas[index].largo;
            ancho = arrayFilas[index].ancho;
            grueso = arrayFilas[index].grueso;
        } else {
            precio_m3 = 0;
            proveedor = ""
            largo = 0;
            ancho = 0;
            grueso = 0;
        };
        objetoFila.unidades = Number(fila.unidades);
        objetoFila.proveedor = proveedor;
        objetoFila.precio_m3 = precio_m3;
        objetoFila.largo = largo;
        objetoFila.ancho = ancho;
        objetoFila.grueso = grueso;
        objetoFila.medidas = `${formateado(objetoFila.largo)} x ${formateado(objetoFila.ancho)} x ${formateado(objetoFila.grueso)}`;
        if (merma.length > 0) {
            recalcularMerma = true;
        };
        if (objetoFila.unidades > 0) {
            objetoFila.vol_unitario = _.round(((objetoFila.largo * objetoFila.ancho * objetoFila.grueso) / 1000000000), REDONDEADO);
            objetoFila.vol_total = _.round((objetoFila.unidades * objetoFila.vol_unitario), REDONDEADO);
            objetoFila.precio_total = _.round((objetoFila.vol_total * objetoFila.precio_m3), REDONDEADO);
            objetoFila.volumen = `Uni: ${formateado(objetoFila.vol_unitario)} m³ - Tot: ${formateado(objetoFila.vol_total)} m³`;
            objetoFila.precio = `m³: ${formateado(objetoFila.precio_m3)} €/m³ - Tot: ${formateado(objetoFila.precio_total)} €`;
        } else {
            objetoFila.vol_unitario = 0;
            objetoFila.vol_total = 0;
            objetoFila.precio_total = 0;
            objetoFila.volumen = "Uni: 0 m³ - Tot: 0 m³";
            if (objetoFila.precio_m3 > 0) {
                objetoFila.precio = `m³: ${formateado(objetoFila.precio_m3)} €/m³ - Tot: 0 €`;
            } else {
                objetoFila.precio = "m³: 0 €/m³ - Tot: 0 €";
            };
        };
        if (recalcularMerma) {
            const objetoMerma = {
                unidades: merma[0].unidades,
                largo: merma[0].largo,
                ancho: objetoFila.ancho,
                grueso: objetoFila.grueso,
                vol_total: objetoFila.vol_total,
                precio_m3: objetoFila.precio_m3
            };
            const arrayMerma = dispatch(calculosTablaMerma(objetoMerma));
            objetoFila.filaMerma = arrayMerma;
        } else {
            objetoFila.filaMerma = merma;
        };
        arrayTabla.push(objetoFila);
    });
    return arrayTabla
};

export const actualizarTablaCuerpo = (arrayTabla) => (dispatch, getState) => {
    let datosCotizacionUpdate = {};
    const arrayLinea = arrayTabla.map(({
        unidades,
        largo,
        ancho,
        grueso,
        proveedor,
        precio_m3,
        vol_unitario,
        vol_total,
        precio_total,
        filaMerma
    }) => ({
        unidades,
        largo,
        ancho,
        grueso,
        proveedor,
        precio_m3,
        vol_unitario,
        vol_total,
        precio_total,
        filaMerma
    }));
    datosCotizacionUpdate.filasCuerpo = arrayLinea;
    const sumCuerpo = arrayLinea.reduce((sum, { precio_total }) => sum + precio_total, 0);
    datosCotizacionUpdate.sumCuerpo = _.round(sumCuerpo, REDONDEADO);
    const sumVolumen = arrayLinea.reduce((sum, { vol_total }) => sum + vol_total, 0);
    datosCotizacionUpdate.sumVolumen = _.round(sumVolumen, REDONDEADO);
    let sumPrecioMerma = 0;
    let sumVolumenMerma = 0;
    let filasMerma = 0;
    arrayLinea.map((fila) => {
        if (fila.filaMerma.length > 0) {
            sumPrecioMerma += fila.filaMerma[0].precio_merma;
            sumVolumenMerma += fila.filaMerma[0].vol_merma;
            filasMerma += 1;
        };
    });
    datosCotizacionUpdate.merma = {
        sumPrecioMerma: _.round(sumPrecioMerma, REDONDEADO),
        sumVolumenMerma: _.round(sumVolumenMerma, REDONDEADO),
        filasMerma
    };
    dispatch(setObjetoCotizacionCuerpo(datosCotizacionUpdate));
};

export const calculosTablaMerma = (objetoMerma) => (dispatch, getState) => {
    const arrayTabla = [];
    let objetoFila = {};
    objetoFila.unidades = objetoMerma.unidades;
    objetoFila.largo = objetoMerma.largo;
    objetoFila.ancho = objetoMerma.ancho;
    objetoFila.grueso = objetoMerma.grueso;
    objetoFila.mat_prima = _.round((objetoFila.unidades * ((objetoFila.largo * objetoFila.ancho * objetoFila.grueso) / 1000000000)), REDONDEADO);
    if (objetoFila.unidades > 0 && objetoFila.largo > 0) {
        objetoFila.vol_merma = _.round((objetoFila.mat_prima - objetoMerma.vol_total), REDONDEADO);
        objetoFila.precio_merma = _.round((objetoFila.vol_merma * objetoMerma.precio_m3), REDONDEADO);
    } else {
        objetoFila.vol_merma = 0;
        objetoFila.precio_merma = 0;
    };
    arrayTabla.push(objetoFila);
    return arrayTabla
};

export const actualizarTablaMerma = (arrayTabla, index) => (dispatch, getState) => {
    const cotizacionCuerpo = getState().produccionSeccion.cotizacion.objetoCotizacionCuerpo;
    const datosMermaUpdate = [{
        unidades: arrayTabla[0].unidades,
        largo: arrayTabla[0].largo,
        mat_prima: arrayTabla[0].mat_prima,
        vol_merma: arrayTabla[0].vol_merma,
        precio_merma: arrayTabla[0].precio_merma
    }];
    let datosCotizacionUpdate = {};
    let objetoFilasCuerpo = {};
    let arrayFilasCuerpo = [];
    if (cotizacionCuerpo) {
        arrayFilasCuerpo = [...cotizacionCuerpo.filasCuerpo];
        datosCotizacionUpdate = { ...cotizacionCuerpo };
    };
    if (arrayFilasCuerpo[index]) {
        objetoFilasCuerpo = { ...arrayFilasCuerpo[index] };
    } else {
        objetoFilasCuerpo = {
            unidades: 0,
            largo: 0,
            ancho: 0,
            grueso: 0,
            vol_unitario: 0,
            vol_total: 0,
            proveedor: "",
            precio_m3: 0,
            precio_total: 0,
        };
    };
    objetoFilasCuerpo.filaMerma = datosMermaUpdate;
    arrayFilasCuerpo[index] = objetoFilasCuerpo;
    datosCotizacionUpdate.filasCuerpo = arrayFilasCuerpo;
    dispatch(setObjetoCotizacionCuerpo(datosCotizacionUpdate));
    dispatch(setRegistraIntervencionDialog('merma'));
};

export const calculosTablaProveedores = (objetoProveedores) => (dispatch, getState) => {
    const arrayTabla = [];
    let objetoFila = { ...objetoProveedores };
    arrayTabla.push(objetoFila);
    return arrayTabla
};

export const actualizarTablaProveedores = (arrayTabla, index) => (dispatch, getState) => {
    const cotizacionCuerpo = getState().produccionSeccion.cotizacion.objetoCotizacionCuerpo;
    let datosCotizacionUpdate = {};
    let objetoFilasCuerpo = {};
    let arrayFilasCuerpo = [];
    if (cotizacionCuerpo) {
        arrayFilasCuerpo = [...cotizacionCuerpo.filasCuerpo];
        datosCotizacionUpdate = { ...cotizacionCuerpo };
    };
    if (arrayFilasCuerpo[index]) {
        objetoFilasCuerpo = { ...arrayFilasCuerpo[index] };
    } else {
        objetoFilasCuerpo = {
            unidades: 0,
            largo: 0,
            ancho: 0,
            grueso: 0,
            vol_unitario: 0,
            vol_total: 0,
            precio_total: 0,
            filaMerma: []
        };
    };
    objetoFilasCuerpo.proveedor = arrayTabla[0].proveedor;
    objetoFilasCuerpo.precio_m3 = arrayTabla[0].precio_m3;
    arrayFilasCuerpo[index] = objetoFilasCuerpo;
    datosCotizacionUpdate.filasCuerpo = arrayFilasCuerpo;
    dispatch(setObjetoCotizacionCuerpo(datosCotizacionUpdate));
    dispatch(setRegistraIntervencionDialog('proveedor'));
};

export const calculosTablaMedidas = (objetoMedidas) => (dispatch, getState) => {
    const arrayTabla = [];
    let objetoFila = { ...objetoMedidas };
    arrayTabla.push(objetoFila);
    return arrayTabla
};

export const actualizarTablaMedidas = (arrayTabla, index) => (dispatch, getState) => {
    const cotizacionCuerpo = getState().produccionSeccion.cotizacion.objetoCotizacionCuerpo;
    let datosCotizacionUpdate = {};
    let objetoFilasCuerpo = {};
    let arrayFilasCuerpo = [];
    if (cotizacionCuerpo) {
        arrayFilasCuerpo = [...cotizacionCuerpo.filasCuerpo];
        datosCotizacionUpdate = { ...cotizacionCuerpo };
    };
    if (arrayFilasCuerpo[index]) {
        objetoFilasCuerpo = { ...arrayFilasCuerpo[index] };
    } else {
        objetoFilasCuerpo = {
            unidades: 0,
            vol_unitario: 0,
            vol_total: 0,
            proveedor: "",
            precio_m3: 0,
            precio_total: 0,
            filaMerma: []
        };
    };
    objetoFilasCuerpo.largo = arrayTabla[0].largo;
    objetoFilasCuerpo.ancho = arrayTabla[0].ancho;
    objetoFilasCuerpo.grueso = arrayTabla[0].grueso;
    arrayFilasCuerpo[index] = objetoFilasCuerpo;
    datosCotizacionUpdate.filasCuerpo = arrayFilasCuerpo;
    dispatch(setObjetoCotizacionCuerpo(datosCotizacionUpdate));
    dispatch(setRegistraIntervencionDialog('medidas'));
};

//LAT. SUPERIOR

export const calculosTablaLateralSup = (tabla, tratamiento, actualizacionInicial) => (dispatch, getState) => {
    const cotizacionCuerpo = getState().produccionSeccion.cotizacion.objetoCotizacionCuerpo;
    const cotizacionLateralSup = getState().produccionSeccion.cotizacion.objetoCotizacionLateralSup;
    const cotizacionCabecera = getState().produccionSeccion.cotizacion.objetoCotizacionCabecera;
    const arrayTabla = [];
    let objetoFila = null;
    let sumCuerpo, unidades, sumPrecioMerma, sumClavos, sumCorteMadera, sumMontaje, sumPatines, filasMerma, sumTransporte, sumTratamiento, sumVolumen, filasExtra;
    if (cotizacionCabecera && cotizacionCuerpo) {
        sumCuerpo = cotizacionCuerpo.sumCuerpo;
        unidades = cotizacionCabecera.unidades;
        sumPrecioMerma = cotizacionCuerpo.merma.sumPrecioMerma;
        filasMerma = cotizacionCuerpo.merma.filasMerma;
        sumVolumen = cotizacionCuerpo.sumVolumen;
    } else {
        sumCuerpo = 0;
        unidades = 0;
        sumPrecioMerma = 0;
        filasMerma = 0;
        sumVolumen = 0;
    };
    if (cotizacionLateralSup) {
        sumClavos = cotizacionLateralSup.sumClavos ? cotizacionLateralSup.sumClavos : 0;
        sumCorteMadera = cotizacionLateralSup.sumCorteMadera ? cotizacionLateralSup.sumCorteMadera : 0;
        sumMontaje = cotizacionLateralSup.sumMontaje ? cotizacionLateralSup.sumMontaje : 0;
        sumPatines = cotizacionLateralSup.sumPatines ? cotizacionLateralSup.sumPatines : 0;
        sumTransporte = cotizacionLateralSup.sumTransporte ? cotizacionLateralSup.sumTransporte : 0;
        sumTratamiento = _.round((sumVolumen * tratamiento), REDONDEADO);
        filasExtra = cotizacionLateralSup.filasExtra.length > 0 ? cotizacionLateralSup.filasExtra : [];
    } else {
        sumClavos = 0;
        sumCorteMadera = 0;
        sumMontaje = 0;
        sumPatines = 0;
        sumTransporte = 0;
        sumTratamiento = 0;
        filasExtra = [];
    };
    tabla.map((fila, index) => {
        objetoFila = { ...fila };
        switch (fila.concepto) {
            case "merma":
                objetoFila.total = sumPrecioMerma * unidades;
                break;
            case "clavos":
                objetoFila.total = sumClavos * unidades;
                break;
            case "corte_madera":
                objetoFila.total = (sumCorteMadera * filasMerma) * unidades;
                break;
            case "montaje":
                objetoFila.total = sumMontaje * unidades;
                break;
            case "patines":
                objetoFila.total = (sumPatines * 3) * unidades;
                break;
            case "transporte":
                objetoFila.total = sumTransporte * unidades;
                break;
            case "tratamiento":
                objetoFila.total = sumTratamiento * unidades;
                break;
            default:
                objetoFila.total = Number(fila.total);
                objetoFila.concepto = _.deburr(fila.concepto).replaceAll(/[ .]/g, "_").toLowerCase();
        };
        arrayTabla.push(objetoFila);
    });  
    //revisión tabla si carga por primera vez al actualizar
    if (arrayTabla.length !== (7 + filasExtra.length) && actualizacionInicial) {
        let objetoFilasExtra;
        filasExtra.forEach((fila, index) => {
            objetoFilasExtra = {
                concepto: fila.concepto,
                total: fila.precio_total
            };
            arrayTabla.push(objetoFilasExtra);
        });
    };
    return arrayTabla
};

export const actualizarTablaLateralSup = (arrayTabla) => (dispatch, getState) => {
    const cotizacionCuerpo = getState().produccionSeccion.cotizacion.objetoCotizacionCuerpo;
    const cotizacionLateralSup = getState().produccionSeccion.cotizacion.objetoCotizacionLateralSup;
    const cotizacionCabecera = getState().produccionSeccion.cotizacion.objetoCotizacionCabecera;
    let datosCotizacionUpdate = {};
    let precio, volumen, unidades;
    datosCotizacionUpdate = { ...cotizacionLateralSup };
    unidades = cotizacionCabecera.unidades;
    precio = (cotizacionCuerpo.sumCuerpo) * unidades;
    volumen = (cotizacionCuerpo.sumVolumen) * unidades;
    const arrayFilasExtra = [];
    let objetoFilasExtra;
    let sumTratamiento;
    let sumLateralSup = 0;
    arrayTabla.forEach((fila, index) => {
        if (index > 6) {
            objetoFilasExtra = {
                concepto: fila.concepto,
                precio_total: fila.total
            };
            arrayFilasExtra.push(objetoFilasExtra);
            sumLateralSup += (fila.total * unidades);
        } else {
            if (index === 5) {
                sumTratamiento = fila.total / unidades;
            };
            sumLateralSup += fila.total;
        };
    });
    sumLateralSup = sumLateralSup / unidades;
    if (!datosCotizacionUpdate.sumClavos) {
        datosCotizacionUpdate.filasClavos = [];
        datosCotizacionUpdate.sumClavos = 0;
    };
    if (!datosCotizacionUpdate.sumCorteMadera) {
        datosCotizacionUpdate.filaCorteMadera = [];
        datosCotizacionUpdate.sumCorteMadera = 0;
    };
    if (!datosCotizacionUpdate.sumMontaje) {
        datosCotizacionUpdate.filaMontaje = [];
        datosCotizacionUpdate.sumMontaje = 0;
    };
    if (!datosCotizacionUpdate.sumPatines) {
        datosCotizacionUpdate.filaPatines = [];
        datosCotizacionUpdate.sumPatines = 0;
    };
    if (!datosCotizacionUpdate.sumTransporte) {
        datosCotizacionUpdate.filaTransporte = [];
        datosCotizacionUpdate.sumTransporte = 0;
    };
    datosCotizacionUpdate.sumTratamiento = sumTratamiento;
    datosCotizacionUpdate.sumLateralSup = _.round(sumLateralSup, REDONDEADO);
    precio > 0 && (precio += (datosCotizacionUpdate.sumLateralSup) * unidades);

    datosCotizacionUpdate.filasExtra = arrayFilasExtra;
    dispatch(setObjetoCotizacionLateralSup(datosCotizacionUpdate));   
    return { precio, volumen, unidades }
};

export const calculosTablaClavos = (tabla) => (dispatch, getState) => {
    const arrayTabla = [];
    let objetoFila = {};
    tabla.map((fila, index) => {
        objetoFila = { ...fila };
        objetoFila.unidades = Number(fila.unidades);
        if (objetoFila.unidades > 0) {
            objetoFila.precio_total = _.round((objetoFila.unidades * objetoFila.precio_unitario), REDONDEADO);
        } else {
            objetoFila.precio_total = 0;
        };
        arrayTabla.push(objetoFila);
    });
    return arrayTabla
};

export const actualizarTablaClavos = (arrayTabla) => (dispatch, getState) => {
    const cotizacionLateralSup = getState().produccionSeccion.cotizacion.objetoCotizacionLateralSup;
    let datosCotizacionUpdate = {};
    if (cotizacionLateralSup) {
        datosCotizacionUpdate = { ...cotizacionLateralSup };
    };
    const arrayLinea = arrayTabla.map(({ clavo, precio_unitario, unidades, precio_total }) => ({ clavo, precio_unitario, unidades, precio_total }));
    datosCotizacionUpdate.filasClavos = arrayLinea;
    const sumClavos = arrayLinea.reduce((sum, { precio_total }) => sum + precio_total, 0);
    datosCotizacionUpdate.sumClavos = _.round(sumClavos, REDONDEADO);
    dispatch(setObjetoCotizacionLateralSup(datosCotizacionUpdate));
    dispatch(setRegistraIntervencionDialog('clavos'));
};

export const calculosTablaCorteMadera = (objetoCorteMadera) => (dispatch, getState) => {
    const arrayTabla = [];
    let objetoFila = {};
    objetoFila.operarios = objetoCorteMadera.operarios;
    objetoFila.productividad = objetoCorteMadera.productividad;
    objetoFila.cantidadPrecioHora = objetoCorteMadera.cantidadPrecioHora;
    if (objetoFila.operarios > 0 && objetoFila.productividad > 0) {
        objetoFila.precio_total = _.round((((1 / objetoFila.productividad) * objetoFila.cantidadPrecioHora) * objetoFila.operarios), REDONDEADO);
    } else {
        objetoFila.precio_total = 0;
    };
    arrayTabla.push(objetoFila);
    return arrayTabla
};

export const actualizarTablaCorteMadera = (arrayTabla) => (dispatch, getState) => {
    const cotizacionLateralSup = getState().produccionSeccion.cotizacion.objetoCotizacionLateralSup;
    let datosCotizacionUpdate = {};
    if (cotizacionLateralSup) {
        datosCotizacionUpdate = { ...cotizacionLateralSup };
    };
    const arrayLinea = arrayTabla.map(({
        cantidadPrecioHora,
        operarios,
        productividad,
        precio_total
    }) => ({
        cantidadPrecioHora,
        operarios,
        productividad,
        precio_total
    }));
    datosCotizacionUpdate.filaCorteMadera = arrayLinea;
    datosCotizacionUpdate.sumCorteMadera = arrayLinea[0].precio_total;
    dispatch(setObjetoCotizacionLateralSup(datosCotizacionUpdate));
    dispatch(setRegistraIntervencionDialog('corte_madera'));
};

export const calculosTablaMontaje = (objetoMontaje) => (dispatch, getState) => {
    const arrayTabla = [];
    let objetoFila = {};
    objetoFila.operarios = objetoMontaje.operarios;
    objetoFila.productividad = objetoMontaje.productividad;
    objetoFila.cantidadPrecioHora = objetoMontaje.cantidadPrecioHora;
    if (objetoFila.operarios > 0 && objetoFila.productividad > 0) {
        objetoFila.precio_total = _.round((((1 / objetoFila.productividad) * objetoFila.cantidadPrecioHora) * objetoFila.operarios), REDONDEADO);
    } else {
        objetoFila.precio_total = 0;
    };
    arrayTabla.push(objetoFila);
    return arrayTabla
};

export const actualizarTablaMontaje = (arrayTabla) => (dispatch, getState) => {
    const cotizacionLateralSup = getState().produccionSeccion.cotizacion.objetoCotizacionLateralSup;
    let datosCotizacionUpdate = {};
    if (cotizacionLateralSup) {
        datosCotizacionUpdate = { ...cotizacionLateralSup };
    };
    const arrayLinea = arrayTabla.map(({
        cantidadPrecioHora,
        operarios,
        productividad,
        precio_total
    }) => ({
        cantidadPrecioHora,
        operarios,
        productividad,
        precio_total
    }));
    datosCotizacionUpdate.filaMontaje = arrayLinea;
    datosCotizacionUpdate.sumMontaje = arrayLinea[0].precio_total;
    dispatch(setObjetoCotizacionLateralSup(datosCotizacionUpdate));
    dispatch(setRegistraIntervencionDialog('montaje'));
};

export const calculosTablaPatines = (objetoPatines) => (dispatch, getState) => {
    const arrayTabla = [];
    let objetoFila = {};
    objetoFila.operarios = objetoPatines.operarios;
    objetoFila.productividad = objetoPatines.productividad;
    objetoFila.cantidadPrecioHora = objetoPatines.cantidadPrecioHora;
    if (objetoFila.operarios > 0 && objetoFila.productividad > 0) {
        objetoFila.precio_total = _.round((((1 / objetoFila.productividad) * objetoFila.cantidadPrecioHora) * objetoFila.operarios), REDONDEADO);
    } else {
        objetoFila.precio_total = 0;
    };
    arrayTabla.push(objetoFila);
    return arrayTabla
};

export const actualizarTablaPatines = (arrayTabla) => (dispatch, getState) => {
    const cotizacionLateralSup = getState().produccionSeccion.cotizacion.objetoCotizacionLateralSup;
    let datosCotizacionUpdate = {};
    if (cotizacionLateralSup) {
        datosCotizacionUpdate = { ...cotizacionLateralSup };
    };
    const arrayLinea = arrayTabla.map(({
        cantidadPrecioHora,
        operarios,
        productividad,
        precio_total
    }) => ({
        cantidadPrecioHora,
        operarios,
        productividad,
        precio_total
    }));
    datosCotizacionUpdate.filaPatines = arrayLinea;
    datosCotizacionUpdate.sumPatines = arrayLinea[0].precio_total;
    dispatch(setObjetoCotizacionLateralSup(datosCotizacionUpdate));
    dispatch(setRegistraIntervencionDialog('patines'));
};

export const calculosTablaTransporte = (objetoTransporte) => (dispatch, getState) => {
    const arrayTabla = [];
    let objetoFila = {};
    objetoFila.transporte = objetoTransporte.transporte;
    objetoFila.precio_total = _.round((objetoTransporte.precioUnitario / objetoTransporte.unidadesVehiculo), REDONDEADO);
    arrayTabla.push(objetoFila);
    return arrayTabla
};

export const actualizarTablaTransporte = (arrayTabla) => (dispatch, getState) => {
    const cotizacionLateralSup = getState().produccionSeccion.cotizacion.objetoCotizacionLateralSup;
    let datosCotizacionUpdate = {};
    if (cotizacionLateralSup) {
        datosCotizacionUpdate = { ...cotizacionLateralSup };
    };
    const arrayLinea = arrayTabla.map(({
        transporte,
        precio_total
    }) => ({
        transporte,
        precio_total
    }));
    datosCotizacionUpdate.filaTransporte = arrayLinea;
    datosCotizacionUpdate.sumTransporte = arrayLinea[0].precio_total;
    dispatch(setObjetoCotizacionLateralSup(datosCotizacionUpdate));
    dispatch(setRegistraIntervencionDialog('transporte'));
};

//LAT. INFERIOR

export const calculosTablaLateralInf = (tabla, objetoReCalculado) => (dispatch, getState) => {
    const cotizacionCuerpo = getState().produccionSeccion.cotizacion.objetoCotizacionCuerpo;
    const cotizacionLateralSup = getState().produccionSeccion.cotizacion.objetoCotizacionLateralSup;
    const cotizacionCabecera = getState().produccionSeccion.cotizacion.objetoCotizacionCabecera;
    const arrayTabla = [];
    let objetoFila;
    let sumLateralSup, unidades, sumCuerpo, precio;
    if (cotizacionCabecera && cotizacionCuerpo) {
        sumCuerpo = cotizacionCuerpo.sumCuerpo;
        unidades = cotizacionCabecera.unidades;
    } else {
        sumCuerpo = 0;
        unidades = 0;
    };
    if (cotizacionLateralSup) {
        sumLateralSup = cotizacionLateralSup.sumLateralSup ? cotizacionLateralSup.sumLateralSup : 0;
    } else {
        sumLateralSup = 0;
    };
    tabla.map((fila, index) => {
        objetoFila = { ...fila };
        objetoFila.cu = unidades > 0 ? _.round((((sumLateralSup * unidades) + (sumCuerpo * unidades)) / unidades), REDONDEADO) : 0;
        if (!objetoReCalculado.estado) {
            objetoFila.precio_venta = Number(objetoFila.precio_venta);
            objetoFila.mc = (sumLateralSup + sumCuerpo) > 0 ? _.round((objetoFila.precio_venta - objetoFila.cu), REDONDEADO) : 0;
            if (objetoFila.precio_venta === 0) {
                objetoFila.mc_porcentaje = 0;
            } else {
                objetoFila.mc_porcentaje = (sumLateralSup + sumCuerpo) > 0 ? _.round(((objetoFila.mc / objetoFila.precio_venta) * 100), REDONDEADO) : 0;
            };
        } else {
            switch (objetoReCalculado.tipo) {
                case "precioVenta":
                    objetoFila.precio_venta = Number(objetoFila.precio_venta);
                    objetoFila.mc = (sumLateralSup + sumCuerpo) > 0 ? _.round((objetoFila.precio_venta - objetoFila.cu), REDONDEADO) : 0;
                    if (objetoFila.precio_venta === 0) {
                        objetoFila.mc_porcentaje = 0;
                    } else {
                        objetoFila.mc_porcentaje = (sumLateralSup + sumCuerpo) > 0 ? _.round(((objetoFila.mc / objetoFila.precio_venta) * 100), REDONDEADO) : 0;
                    };
                    break;
                case "mc":
                    objetoFila.mc = Number(objetoFila.mc);
                    objetoFila.precio_venta = (sumLateralSup + sumCuerpo) > 0 ? _.round((objetoFila.mc + objetoFila.cu), REDONDEADO) : 0;
                    if (objetoFila.precio_venta === 0) {
                        objetoFila.mc_porcentaje = 0;
                    } else {
                        objetoFila.mc_porcentaje = (sumLateralSup + sumCuerpo) > 0 ? _.round(((objetoFila.mc / objetoFila.precio_venta) * 100), REDONDEADO) : 0;
                    };
                    break;
                case "mcPorcentaje":
                    objetoFila.mc_porcentaje = Number(objetoFila.mc_porcentaje);
                    objetoFila.mc = (sumLateralSup + sumCuerpo) > 0 ? _.round(((objetoFila.mc_porcentaje * objetoFila.cu) / (100 - objetoFila.mc_porcentaje)), REDONDEADO) : 0;
                    objetoFila.precio_venta = (sumLateralSup + sumCuerpo) > 0 ? _.round((objetoFila.mc + objetoFila.cu), REDONDEADO) : 0;
                    break;
                default:
            };
        };
        arrayTabla.push(objetoFila);
    });
    precio = _.round((arrayTabla[0].cu / (100 - arrayTabla[0].mc_porcentaje) * 100), REDONDEADO);
    return { arrayTabla, precio }
};

export const actualizarTablaLateralInf = (arrayTabla, precio) => (dispatch, getState) => {
    let datosCotizacionUpdate = {};
    datosCotizacionUpdate = {
        cu: arrayTabla[0].cu,
        precio_venta: arrayTabla[0].precio_venta,
        mc: arrayTabla[0].mc,
        mc_porcentaje: arrayTabla[0].mc_porcentaje,
        precio
    };
    dispatch(setObjetoCotizacionLateralInf(datosCotizacionUpdate));
};