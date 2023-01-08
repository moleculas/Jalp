import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState, Fragment } from 'react';
import FuseLoading from '@fuse/core/FuseLoading';
import _ from '@lodash';
import format from 'date-fns/format';
import { es } from 'date-fns/locale';
import { PDFViewer, Page, Text, View, Document, StyleSheet, Font, Image } from "@react-pdf/renderer";

//importacion acciones
import {
    selectObjetoCotizacionCabecera,
    selectObjetoCotizacionCuerpo,
    selectObjetoCotizacionLateralSup,
    selectObjetoCotizacionLateralInf,
} from 'app/redux/produccion/cotizacionSlice';
import { getProducto } from 'app/redux/produccion/productoSlice';
import {
    formateado,
} from 'app/logica/produccion/logicaProduccion';

//fuentes
import InterRegular from "../../../styles/fonts/Inter-Regular.ttf";
import InterLight from "../../../styles/fonts/Inter-Light.ttf";
import InterExtraBold from "../../../styles/fonts/Inter-ExtraBold.ttf";
import InterBold from "../../../styles/fonts/Inter-Bold.ttf";
import InterSemiBold from "../../../styles/fonts/Inter-SemiBold.ttf";

Font.register({
    family: 'InterRegular',
    format: "truetype",
    src: InterRegular
});
Font.register({
    family: 'InterLight',
    format: "truetype",
    src: InterLight
});
Font.register({
    family: 'InterExtraBold',
    format: "truetype",
    src: InterExtraBold
});
Font.register({
    family: 'InterBold',
    format: "truetype",
    src: InterBold
});
Font.register({
    family: 'InterSemiBold',
    format: "truetype",
    src: InterSemiBold
});

const styles = StyleSheet.create({
    page: {
        backgroundColor: 'white',
        margin: 20,
        paddingBottom: 40,
        paddingTop: 20,
        paddingLeft: 20,
        paddingRight: 20
    },
    body: {
        paddingTop: 35,
        paddingBottom: 65,
        paddingHorizontal: 35,
    },
    pageNumber: {
        position: 'absolute',
        fontSize: 10,
        fontFamily: 'InterRegular',
        bottom: 30,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: 'grey',
    }
});

const PdfCotizacion = (props) => {
    const dispatch = useDispatch();
    const cotizacionCabecera = useSelector(selectObjetoCotizacionCabecera);
    const cotizacionCuerpo = useSelector(selectObjetoCotizacionCuerpo);
    const cotizacionLateralSup = useSelector(selectObjetoCotizacionLateralSup);
    const cotizacionLateralInf = useSelector(selectObjetoCotizacionLateralInf);
    const [cargadoDocumento, setCargadoDocumento] = useState(false);
    const [transporte, setTransporte] = useState(null);

    //useEffect

    useEffect(() => {
        if (cotizacionLateralSup.filaTransporte[0]?.transporte) {
            dispatch(getProducto(cotizacionLateralSup.filaTransporte[0].transporte)).then(({ payload }) => {
                let vehiculo;
                switch (payload.especialTransportes.vehiculo) {
                    case "camion":
                        vehiculo = "Camión"
                        break;
                    case "trailer":
                        vehiculo = "Tráiler"
                        break;
                    case "trenCarretera":
                        vehiculo = "Tren de carretera"
                        break;
                    default:
                };
                setTransporte({
                    destino: payload.especialTransportes.destino,
                    vehiculo,
                    unidadesVehiculo: payload.especialTransportes.unidadesVehiculo,
                    precioUnitario: payload.precioUnitario
                });
                temporizador();
            });
        } else {
            temporizador();
        };
    }, []);

    //funciones  

    const temporizador = () => {
        const timer = setTimeout(() => {
            setCargadoDocumento(true);
        }, 1200);
        return () => clearTimeout(timer);
    };

    const retornaLineas = () => {
        const rows = cotizacionCuerpo.filasCuerpo.map((fila, index) =>
            <View style={{ width: '100%', marginBottom: 7, flexDirection: 'row' }} key={"linea-" + index}>
                <View style={{ width: '60%' }}>
                    <Text style={{ fontFamily: 'InterLight', fontSize: 11, marginBottom: 3 }}>
                        <Text style={{ fontFamily: 'InterSemiBold' }}>Línea: </Text>
                        {index + 1}
                    </Text>
                    <Text style={{ fontFamily: 'InterLight', fontSize: 10 }}>
                        <Text style={{ fontFamily: 'InterSemiBold' }}>Unidades: </Text>
                        {fila.unidades}
                    </Text>
                    <Text style={{ fontFamily: 'InterLight', fontSize: 10 }}>
                        <Text style={{ fontFamily: 'InterSemiBold' }}>Medidas: </Text>
                        {`Largo: ${fila.largo}, Ancho: ${fila.ancho}, Grueso: ${fila.grueso}`}
                    </Text>
                    <Text style={{ fontFamily: 'InterLight', fontSize: 10 }}>
                        <Text style={{ fontFamily: 'InterSemiBold' }}>Volumen unitario: </Text>
                        {`${formateado(fila.vol_unitario)} m³`}
                    </Text>
                    <Text style={{ fontFamily: 'InterLight', fontSize: 10 }}>
                        <Text style={{ fontFamily: 'InterSemiBold' }}>Volumen total: </Text>
                        {`${formateado(fila.vol_total)} m³`}
                    </Text>
                    <Text style={{ fontFamily: 'InterLight', fontSize: 10 }}>
                        <Text style={{ fontFamily: 'InterSemiBold' }}>Proveedor: </Text>
                        {fila.proveedor}
                    </Text>
                    <Text style={{ fontFamily: 'InterLight', fontSize: 10 }}>
                        <Text style={{ fontFamily: 'InterSemiBold' }}>Precio unitario: </Text>
                        {`${formateado(fila.precio_m3)} €/m³`}
                    </Text>
                    <Text style={{ fontFamily: 'InterLight', fontSize: 10 }}>
                        <Text style={{ fontFamily: 'InterSemiBold' }}>Precio total: </Text>
                        {`${formateado(fila.precio_total)} €`}
                    </Text>
                </View>
                {fila.filaMerma.length > 0 && (
                    <View style={{ width: '40%' }}>
                        <Text style={{ fontFamily: 'InterLight', fontSize: 11, marginBottom: 3 }}>
                            <Text style={{ fontFamily: 'InterSemiBold' }}>Merma: </Text>
                            {index + 1}
                        </Text>
                        <Text style={{ fontFamily: 'InterLight', fontSize: 10 }}>
                            <Text style={{ fontFamily: 'InterSemiBold' }}>Unidades: </Text>
                            {fila.filaMerma[0].unidades}
                        </Text>
                        <Text style={{ fontFamily: 'InterLight', fontSize: 10 }}>
                            <Text style={{ fontFamily: 'InterSemiBold' }}>Medidas: </Text>
                            {`Largo: ${fila.filaMerma[0].largo}, Ancho: ${fila.ancho}, Grueso: ${fila.grueso}`}
                        </Text>
                        <Text style={{ fontFamily: 'InterLight', fontSize: 10 }}>
                            <Text style={{ fontFamily: 'InterSemiBold' }}>Volumen materia prima: </Text>
                            {`${formateado(fila.filaMerma[0].mat_prima)} m³`}
                        </Text>
                        <Text style={{ fontFamily: 'InterLight', fontSize: 10 }}>
                            <Text style={{ fontFamily: 'InterSemiBold' }}>Volumen merma: </Text>
                            {`${formateado(fila.filaMerma[0].vol_merma)} m³`}
                        </Text>
                        <Text style={{ fontFamily: 'InterLight', fontSize: 10 }}>
                            <Text style={{ fontFamily: 'InterSemiBold' }}>Precio merma: </Text>
                            {`${formateado(fila.filaMerma[0].precio_merma)} €`}
                        </Text>
                    </View>
                )}
            </View>
        )
        return (<Fragment>{rows}</Fragment>)
    };

    const retornaClavos = () => {
        const rows = cotizacionLateralSup.filasClavos.map((fila, index) =>
            <View style={{ width: '100%' }} key={"lineaClavos-" + index}>
                <Text style={{ fontFamily: 'InterLight', fontSize: 10 }}>
                    <Text style={{ fontFamily: 'InterSemiBold' }}>Clavo: </Text>
                    {fila.clavo}
                </Text>
                <Text style={{ fontFamily: 'InterLight', fontSize: 10 }}>
                    <Text style={{ fontFamily: 'InterSemiBold' }}>Precio unitario: </Text>
                    {`${formateado(fila.precio_unitario)} €`}
                </Text>
                <Text style={{ fontFamily: 'InterLight', fontSize: 10 }}>
                    <Text style={{ fontFamily: 'InterSemiBold' }}>Unidades: </Text>
                    {fila.unidades}
                </Text>
                <Text style={{ fontFamily: 'InterLight', fontSize: 10 }}>
                    <Text style={{ fontFamily: 'InterSemiBold' }}>Precio total: </Text>
                    {`${formateado(fila.precio_total)} €`}
                </Text>
            </View>
        );
        if (rows.length > 0) {
            return (
                <Fragment>
                    {rows}
                    <Text style={{ fontFamily: 'InterLight', fontSize: 10 }}>
                        <Text style={{ fontFamily: 'InterSemiBold' }}>Precio total Clavos: </Text>
                        {`${formateado(cotizacionLateralSup.sumClavos)} € x (${cotizacionCabecera.unidades} unidades) = ${formateado(cotizacionLateralSup.sumClavos * cotizacionCabecera.unidades)} €`}
                    </Text>
                </Fragment>
            )
        } else {
            return (
                <Fragment>
                    <Text style={{ fontFamily: 'InterLight', fontSize: 10 }}>
                        <Text style={{ fontFamily: 'InterSemiBold' }}>Precio total clavos: </Text>
                        {`0 €`}
                    </Text>
                </Fragment>
            )
        };
    };

    const retornaCorteMadera = () => {
        const rows = cotizacionLateralSup.filaCorteMadera.map((fila, index) =>
            <View style={{ width: '100%' }} key={"lineaCorteMadera-" + index}>
                <Text style={{ fontFamily: 'InterLight', fontSize: 10 }}>
                    <Text style={{ fontFamily: 'InterSemiBold' }}>Coste precio/hora: </Text>
                    {`${formateado(fila.cantidadPrecioHora)} €/hora`}
                </Text>
                <Text style={{ fontFamily: 'InterLight', fontSize: 10 }}>
                    <Text style={{ fontFamily: 'InterSemiBold' }}>Número operarios: </Text>
                    {fila.operarios}
                </Text>
                <Text style={{ fontFamily: 'InterLight', fontSize: 10 }}>
                    <Text style={{ fontFamily: 'InterSemiBold' }}>Productividad: </Text>
                    {`${formateado(fila.productividad)} piezas/hora`}
                </Text>
                <Text style={{ fontFamily: 'InterLight', fontSize: 10 }}>
                    <Text style={{ fontFamily: 'InterSemiBold' }}>Precio total: </Text>
                    {`${formateado(fila.precio_total)} €`}
                </Text>
            </View>
        );
        if (rows.length > 0) {
            return (
                <Fragment>
                    {rows}
                    <Text style={{ fontFamily: 'InterLight', fontSize: 10 }}>
                        <Text style={{ fontFamily: 'InterSemiBold' }}>Precio total Corte Madera: </Text>
                        {`${formateado(cotizacionLateralSup.sumCorteMadera)} € x (${cotizacionCuerpo.merma.filasMerma} piezas corte x ${cotizacionCabecera.unidades} unidades) = ${formateado((cotizacionLateralSup.sumCorteMadera * cotizacionCuerpo.merma.filasMerma) * cotizacionCabecera.unidades)} €`}
                    </Text>
                </Fragment>
            )
        } else {
            return (
                <Fragment>
                    <Text style={{ fontFamily: 'InterLight', fontSize: 10 }}>
                        <Text style={{ fontFamily: 'InterSemiBold' }}>Precio total Corte Madera: </Text>
                        {`0 €`}
                    </Text>
                </Fragment>
            )
        };
    };

    const retornaMontaje = () => {
        const rows = cotizacionLateralSup.filaMontaje.map((fila, index) =>
            <View style={{ width: '100%' }} key={"lineaMontaje-" + index}>
                <Text style={{ fontFamily: 'InterLight', fontSize: 10 }}>
                    <Text style={{ fontFamily: 'InterSemiBold' }}>Coste precio/hora: </Text>
                    {`${formateado(fila.cantidadPrecioHora)} €/hora`}
                </Text>
                <Text style={{ fontFamily: 'InterLight', fontSize: 10 }}>
                    <Text style={{ fontFamily: 'InterSemiBold' }}>Número operarios: </Text>
                    {fila.operarios}
                </Text>
                <Text style={{ fontFamily: 'InterLight', fontSize: 10 }}>
                    <Text style={{ fontFamily: 'InterSemiBold' }}>Productividad: </Text>
                    {`${formateado(fila.productividad)} palets/hora`}
                </Text>
                <Text style={{ fontFamily: 'InterLight', fontSize: 10 }}>
                    <Text style={{ fontFamily: 'InterSemiBold' }}>Precio total: </Text>
                    {`${formateado(fila.precio_total)} €`}
                </Text>
            </View>
        );
        if (rows.length > 0) {
            return (
                <Fragment>
                    {rows}
                    <Text style={{ fontFamily: 'InterLight', fontSize: 10 }}>
                        <Text style={{ fontFamily: 'InterSemiBold' }}>Precio total Montaje: </Text>
                        {`${formateado(cotizacionLateralSup.sumMontaje)} € x (${cotizacionCabecera.unidades} unidades) = ${formateado(cotizacionLateralSup.sumMontaje * cotizacionCabecera.unidades)} €`}
                    </Text>
                </Fragment>
            )
        } else {
            return (
                <Fragment>
                    <Text style={{ fontFamily: 'InterLight', fontSize: 10 }}>
                        <Text style={{ fontFamily: 'InterSemiBold' }}>Precio total Montaje: </Text>
                        {`0 €`}
                    </Text>
                </Fragment>
            )
        };
    };

    const retornaPatines = () => {
        const rows = cotizacionLateralSup.filaPatines.map((fila, index) =>
            <View style={{ width: '100%' }} key={"lineaPatines-" + index}>
                <Text style={{ fontFamily: 'InterLight', fontSize: 10 }}>
                    <Text style={{ fontFamily: 'InterSemiBold' }}>Coste precio/hora: </Text>
                    {`${formateado(fila.cantidadPrecioHora)} €/hora`}
                </Text>
                <Text style={{ fontFamily: 'InterLight', fontSize: 10 }}>
                    <Text style={{ fontFamily: 'InterSemiBold' }}>Número operarios: </Text>
                    {fila.operarios}
                </Text>
                <Text style={{ fontFamily: 'InterLight', fontSize: 10 }}>
                    <Text style={{ fontFamily: 'InterSemiBold' }}>Productividad: </Text>
                    {`${formateado(fila.productividad)} patines/hora`}
                </Text>
                <Text style={{ fontFamily: 'InterLight', fontSize: 10 }}>
                    <Text style={{ fontFamily: 'InterSemiBold' }}>Precio total: </Text>
                    {`${formateado(fila.precio_total)} €`}
                </Text>
            </View>
        );
        if (rows.length > 0) {
            return (
                <Fragment>
                    {rows}
                    <Text style={{ fontFamily: 'InterLight', fontSize: 10 }}>
                        <Text style={{ fontFamily: 'InterSemiBold' }}>Precio total Patines: </Text>
                        {`${formateado(cotizacionLateralSup.sumPatines)} € x (${cotizacionCabecera.unidades} unidades) x 3 = ${formateado((cotizacionLateralSup.sumPatines * cotizacionCabecera.unidades) * 3)} €`}
                    </Text>
                </Fragment>
            )
        } else {
            return (
                <Fragment>
                    <Text style={{ fontFamily: 'InterLight', fontSize: 10 }}>
                        <Text style={{ fontFamily: 'InterSemiBold' }}>Precio total Patines: </Text>
                        {`0 €`}
                    </Text>
                </Fragment>
            )
        };
    };

    const retornaTransporte = () => {
        const rows = cotizacionLateralSup.filaTransporte.map((fila, index) =>
            <View style={{ width: '100%' }} key={"lineaTransporte-" + index}>
                <Text style={{ fontFamily: 'InterLight', fontSize: 10 }}>
                    <Text style={{ fontFamily: 'InterSemiBold' }}>Destino: </Text>
                    {transporte.destino}
                </Text>
                <Text style={{ fontFamily: 'InterLight', fontSize: 10 }}>
                    <Text style={{ fontFamily: 'InterSemiBold' }}>Coste transporte: </Text>
                    {`${formateado(transporte.precioUnitario)} €`}
                </Text>
                <Text style={{ fontFamily: 'InterLight', fontSize: 10 }}>
                    <Text style={{ fontFamily: 'InterSemiBold' }}>Tipo de vehículo: </Text>
                    {transporte.vehiculo}
                </Text>
                <Text style={{ fontFamily: 'InterLight', fontSize: 10 }}>
                    <Text style={{ fontFamily: 'InterSemiBold' }}>Unidades: </Text>
                    {`${transporte.unidadesVehiculo} unidades/vehículo`}
                </Text>
                <Text style={{ fontFamily: 'InterLight', fontSize: 10 }}>
                    <Text style={{ fontFamily: 'InterSemiBold' }}>Precio total: </Text>
                    {`${formateado(fila.precio_total)} €`}
                </Text>
            </View>
        );
        if (rows.length > 0) {
            return (
                <Fragment>
                    {rows}
                    <Text style={{ fontFamily: 'InterLight', fontSize: 10 }}>
                        <Text style={{ fontFamily: 'InterSemiBold' }}>Precio total Transporte: </Text>
                        {`${formateado(cotizacionLateralSup.sumTransporte)} € x (${cotizacionCabecera.unidades} unidades) = ${formateado(cotizacionLateralSup.sumTransporte * cotizacionCabecera.unidades)} €`}
                    </Text>
                </Fragment>
            )
        } else {
            return (
                <Fragment>
                    <Text style={{ fontFamily: 'InterLight', fontSize: 10 }}>
                        <Text style={{ fontFamily: 'InterSemiBold' }}>Precio total Transporte: </Text>
                        {`0 €`}
                    </Text>
                </Fragment>
            )
        };
    };

    const retornaMerma = () => {
        if (cotizacionCuerpo.merma.sumPrecioMerma > 0) {
            return (
                <Fragment>
                    <Text style={{ fontFamily: 'InterLight', fontSize: 10 }}>
                        <Text style={{ fontFamily: 'InterSemiBold' }}>Precio total Merma: </Text>
                        {`${formateado(cotizacionCuerpo.merma.sumPrecioMerma)} € x (${cotizacionCabecera.unidades} unidades) = ${formateado(cotizacionCuerpo.merma.sumPrecioMerma * cotizacionCabecera.unidades)} €`}
                    </Text>
                </Fragment>
            )
        } else {
            return (
                <Fragment>
                    <Text style={{ fontFamily: 'InterLight', fontSize: 10 }}>
                        <Text style={{ fontFamily: 'InterSemiBold' }}>Precio total Merma: </Text>
                        {`0 €`}
                    </Text>
                </Fragment>
            )
        };
    };

    const retornaFilasExtra = () => {
        const rows = cotizacionLateralSup.filasExtra.map((fila, index) =>
            <Fragment>
                <View style={{ width: '100%', marginTop: 10, marginBottom: 7, flexDirection: 'row' }} key={"lineaExtra-" + index}>
                    <Text style={{ fontFamily: 'InterLight', fontSize: 11, marginBottom: 3 }}>
                        <Text style={{ fontFamily: 'InterSemiBold' }}>{7 + (index + 1)}.- {_.capitalize(fila.concepto).replaceAll("_", " ")}: </Text>
                    </Text>
                </View>
                <Text style={{ fontFamily: 'InterLight', fontSize: 10 }}>
                    <Text style={{ fontFamily: 'InterSemiBold' }}>Precio total {_.capitalize(fila.concepto).replaceAll("_", " ")}: </Text>
                    {`${formateado(fila.precio_total)} € x (${cotizacionCabecera.unidades} unidades) = ${formateado(fila.precio_total * cotizacionCabecera.unidades)} €`}
                </Text>
            </Fragment>
        );
        if (rows.length > 0) {
            return (rows)
        };
    };

    if (!cargadoDocumento) {
        return <FuseLoading />;
    };

    return (
        (cotizacionCabecera && cotizacionCuerpo && cotizacionLateralSup && cotizacionLateralInf) && (
            <PDFViewer style={{ width: "100%", height: "100vh" }}>
                <Document>
                    <Page size="A4" style={styles.page}>
                        {/* cabecera */}
                        <View fixed style={{ backgroundColor: "#f1f5f9", flexDirection: 'row', justifyContent: 'space-between', width: '95%', height: 60, padding: 15 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Image
                                    style={{ height: 25, width: "auto" }}
                                    src="assets/images/logo/logo_j.png"
                                />
                                <View style={{ flexDirection: 'column' }}>
                                    <Text style={{ fontFamily: 'InterRegular', fontSize: 12 }}>J.A.L.P.</Text>
                                    <Text style={{ fontFamily: 'InterLight', fontSize: 10 }}>MAD TECHNOLOGIC SL</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'column', alignItems: 'flex-end' }}>
                                <Text style={{ marginLeft: 30, fontFamily: 'InterLight', fontSize: 8, paddingTop: 1 }}>Pol. Ind. La Fàbrica  C/Maria Aurèlia Capmany, 5   -  08297 Castellgalí - BARCELONA</Text>
                                <Text style={{ marginLeft: 30, fontFamily: 'InterLight', fontSize: 8, paddingTop: 3 }}>Tel: 93 833 20 75   |   Fax: 93 833 46 44   |   www.jalp-mad.com</Text>
                            </View>
                        </View>
                        {/* título */}
                        <View fixed style={{ flexDirection: 'row', justifyContent: 'space-between', width: '95%', marginTop: 10, marginBottom: 30 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                                <Text style={{ fontFamily: 'InterRegular', fontSize: 12 }}>Documento: </Text>
                                <Text style={{ fontFamily: 'InterExtraBold', fontSize: 13, paddingTop: 3 }}>Cálculo Cotización</Text>
                            </View>
                            <Text style={{ fontFamily: 'InterRegular', fontSize: 10 }}>Fecha: {format(new Date(), "d 'de' MMMM 'de' y", { locale: es })}</Text>
                        </View>
                        {/* cuerpo */}
                        <View style={{ width: '95%' }}>
                            <View style={{ width: '100%', borderBottom: '0.5px solid #000000', marginBottom: 10, paddingBottom: 3 }}>
                                <Text style={{ fontFamily: 'InterRegular', fontSize: 11 }}>Datos Generales</Text>
                            </View>
                            <Text style={{ fontFamily: 'InterLight', fontSize: 11 }}>
                                <Text style={{ fontFamily: 'InterSemiBold' }}>Descripción: </Text>
                                {cotizacionCabecera.descripcion}
                            </Text>
                            <Text style={{ fontFamily: 'InterLight', fontSize: 11 }}>
                                <Text style={{ fontFamily: 'InterSemiBold' }}>Fecha: </Text>
                                {format(new Date(cotizacionCabecera.fecha), "d/MM/y", { locale: es })}
                            </Text>
                            <Text style={{ fontFamily: 'InterLight', fontSize: 11 }}>
                                <Text style={{ fontFamily: 'InterSemiBold' }}>Cliente: </Text>
                                {cotizacionCabecera.cliente}
                            </Text>
                            <Text style={{ fontFamily: 'InterLight', fontSize: 11 }}>
                                <Text style={{ fontFamily: 'InterSemiBold' }}>Orden de fabricación: </Text>
                                {cotizacionCabecera.of}
                            </Text>
                            <Text style={{ fontFamily: 'InterLight', fontSize: 11 }}>
                                <Text style={{ fontFamily: 'InterSemiBold' }}>Unidades: </Text>
                                {cotizacionCabecera.unidades}
                            </Text>
                            <View style={{ width: '100%', borderBottom: '0.5px solid #000000', marginBottom: 10, marginTop: 10, paddingBottom: 3 }}>
                                <Text style={{ fontFamily: 'InterRegular', fontSize: 11 }}>Líneas</Text>
                            </View>
                            {retornaLineas()}
                            <View style={{ width: '100%', borderBottom: '0.5px solid #000000', marginBottom: 10, marginTop: 10, paddingBottom: 3 }}>
                                <Text style={{ fontFamily: 'InterRegular', fontSize: 11 }}>Total Líneas</Text>
                            </View>
                            <Text style={{ fontFamily: 'InterLight', fontSize: 11 }}>
                                <Text style={{ fontFamily: 'InterSemiBold' }}>Volumen total líneas: </Text>
                                {`${formateado(cotizacionCuerpo.sumVolumen)} m³`}
                            </Text>
                            <Text style={{ fontFamily: 'InterLight', fontSize: 11 }}>
                                <Text style={{ fontFamily: 'InterSemiBold' }}>Precio total líneas: </Text>
                                {`${formateado(cotizacionCuerpo.sumCuerpo)} €`}
                            </Text>
                            <Text style={{ fontFamily: 'InterLight', fontSize: 11 }}>
                                <Text style={{ fontFamily: 'InterSemiBold' }}>Volumen total merma: </Text>
                                {`${formateado(cotizacionCuerpo.merma.sumVolumenMerma)} m³`}
                            </Text>
                            <View style={{ width: '100%', borderBottom: '0.5px solid #000000', marginTop: 10, paddingBottom: 3 }}>
                                <Text style={{ fontFamily: 'InterRegular', fontSize: 11 }}>Conceptos Extra</Text>
                            </View>
                            <View style={{ width: '100%', marginTop: 10, marginBottom: 7, flexDirection: 'row' }}>
                                <Text style={{ fontFamily: 'InterLight', fontSize: 11, marginBottom: 3 }}>
                                    <Text style={{ fontFamily: 'InterSemiBold' }}>1.- Clavos: </Text>
                                </Text>
                            </View>
                            {retornaClavos()}
                            <View style={{ width: '100%', marginTop: 10, marginBottom: 7, flexDirection: 'row' }}>
                                <Text style={{ fontFamily: 'InterLight', fontSize: 11, marginBottom: 3 }}>
                                    <Text style={{ fontFamily: 'InterSemiBold' }}>2.- Corte madera: </Text>
                                </Text>
                            </View>
                            {retornaCorteMadera()}
                            <View style={{ width: '100%', marginTop: 10, marginBottom: 7, flexDirection: 'row' }}>
                                <Text style={{ fontFamily: 'InterLight', fontSize: 11, marginBottom: 3 }}>
                                    <Text style={{ fontFamily: 'InterSemiBold' }}>3.- Montaje: </Text>
                                </Text>
                            </View>
                            {retornaMontaje()}
                            <View style={{ width: '100%', marginTop: 10, marginBottom: 7, flexDirection: 'row' }}>
                                <Text style={{ fontFamily: 'InterLight', fontSize: 11, marginBottom: 3 }}>
                                    <Text style={{ fontFamily: 'InterSemiBold' }}>4.- Patines: </Text>
                                </Text>
                            </View>
                            {retornaPatines()}
                            <View style={{ width: '100%', marginTop: 10, marginBottom: 7, flexDirection: 'row' }}>
                                <Text style={{ fontFamily: 'InterLight', fontSize: 11, marginBottom: 3 }}>
                                    <Text style={{ fontFamily: 'InterSemiBold' }}>5.- Transporte: </Text>
                                </Text>
                            </View>
                            {retornaTransporte()}
                            <View style={{ width: '100%', marginTop: 10, marginBottom: 7, flexDirection: 'row' }}>
                                <Text style={{ fontFamily: 'InterLight', fontSize: 11, marginBottom: 3 }}>
                                    <Text style={{ fontFamily: 'InterSemiBold' }}>6.- Tratamiento: </Text>
                                </Text>
                            </View>
                            <Text style={{ fontFamily: 'InterLight', fontSize: 10 }}>
                                <Text style={{ fontFamily: 'InterSemiBold' }}>Coste: </Text>
                                {`${formateado(cotizacionLateralSup.sumTratamiento / cotizacionCuerpo.sumVolumen)} €/m³`}
                            </Text>
                            <Text style={{ fontFamily: 'InterLight', fontSize: 10 }}>
                                <Text style={{ fontFamily: 'InterSemiBold' }}>Precio total Tratamiento: </Text>
                                {`${formateado(cotizacionLateralSup.sumTratamiento)} € x (${cotizacionCabecera.unidades} unidades) = ${formateado(cotizacionLateralSup.sumTratamiento * cotizacionCabecera.unidades)} €`}
                            </Text>
                            <View style={{ width: '100%', marginTop: 10, marginBottom: 7, flexDirection: 'row' }}>
                                <Text style={{ fontFamily: 'InterLight', fontSize: 11, marginBottom: 3 }}>
                                    <Text style={{ fontFamily: 'InterSemiBold' }}>7.- Merma: </Text>
                                </Text>
                            </View>
                            {retornaMerma()}
                            {retornaFilasExtra()}
                            <View style={{ width: '100%', borderBottom: '0.5px solid #000000', marginBottom: 10, marginTop: 10, paddingBottom: 3 }}>
                                <Text style={{ fontFamily: 'InterRegular', fontSize: 11 }}>Total General</Text>
                            </View>
                            <Text style={{ fontFamily: 'InterLight', fontSize: 11 }}>
                                <Text style={{ fontFamily: 'InterSemiBold' }}>Precio Total (sin variaciones): </Text>
                                {`${formateado((cotizacionCuerpo.sumCuerpo * cotizacionCabecera.unidades) + (cotizacionLateralSup.sumLateralSup * cotizacionCabecera.unidades))} €`}
                            </Text>
                            <Text style={{ fontFamily: 'InterLight', fontSize: 11 }}>
                                <Text style={{ fontFamily: 'InterSemiBold' }}>Coste Unitario: </Text>
                                {`${formateado(cotizacionLateralInf.cu)} €`}
                            </Text>
                            <Text style={{ fontFamily: 'InterLight', fontSize: 11 }}>
                                <Text style={{ fontFamily: 'InterSemiBold' }}>Precio Venta (variable): </Text>
                                {`${formateado(cotizacionLateralInf.precio_venta)} €`}
                            </Text>
                            <Text style={cotizacionLateralInf.mc < 0 ? { fontFamily: 'InterLight', fontSize: 11, color: 'red' } : { fontFamily: 'InterLight', fontSize: 11 }}>
                                <Text style={{ fontFamily: 'InterSemiBold', color: '#000000' }}>Margen de Contribución: </Text>
                                {`${formateado(cotizacionLateralInf.mc)} €`}
                            </Text>
                            <Text style={{ fontFamily: 'InterLight', fontSize: 11 }}>
                                <Text style={{ fontFamily: 'InterSemiBold' }}>Porcentaje Margen de Contribución: </Text>
                                {`${formateado(cotizacionLateralInf.mc_porcentaje)} %`}
                            </Text>
                            <View style={{ width: '100%', borderTop: '0.5px solid #000000', marginTop: 10, paddingTop: 3 }}>
                                <Text style={{ fontFamily: 'InterLight', fontSize: 12 }}>
                                    <Text style={{ fontFamily: 'InterSemiBold' }}>Precio Venta: </Text>
                                    {`${formateado(cotizacionLateralInf.precio)} €`}
                                </Text>
                            </View>
                        </View>
                        {/* footer */}
                        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
                            `${pageNumber} / ${totalPages}`
                        )} fixed />
                    </Page>
                </Document>
            </PDFViewer>
        )
    );
};

export default PdfCotizacion;
