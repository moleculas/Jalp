import Paper from '@mui/material/Paper';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import _ from '@lodash';
import MaterialReactTable from 'material-react-table';
import TableContainer from '@mui/material/TableContainer';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Typography from '@mui/material/Typography';

//constantes
import { REDONDEADO } from 'constantes';

//importacion acciones
import {
    generarPropsTabla,
    formateado,
    calculoSemanaAnyoActual,
    decMesActual
} from 'app/logica/produccion/logicaProduccion';
import {
    selectDatosProduccionInicial,
    selectDatosProduccionSaldo,
    updateProduccionTabla,
    updateColumnas,
    setMesSeleccionadoIniciales,
    getColumnas,
    selectDatosColumnasVisibilidad
} from 'app/redux/produccion/produccionSlice';
import { showMessage } from 'app/redux/fuse/messageSlice';
import { selectObjSocket } from 'app/redux/socketSlice';

function PanelProduccion1(props) {
    const { datosColumnasConfig, datosVisibilidad, semanas, datosTabla, datosPalet, producto, mes, anyo, medidas } = props;
    const dispatch = useDispatch();
    const socket = useSelector(selectObjSocket);
    const datosProduccionInicial = useSelector(selectDatosProduccionInicial);
    const datosProduccionSaldo = useSelector(selectDatosProduccionSaldo);
    const datosColumnasVisibilidad = useSelector(selectDatosColumnasVisibilidad);
    const [tableColumns, setTableColumns] = useState(null);
    const [tableData, setTableData] = useState(null);
    const [calculoTabla, setCalculoTabla] = useState(false);
    const [changedData, setChangedData] = useState({ estado: false, item: null });
    const [tablaActiva, setTablaActiva] = useState(false);
    const [visibilidadColumnas, setVisibilidadColumnas] = useState(null);
    const [semanaActual, setSemanaActual] = useState(dispatch(calculoSemanaAnyoActual()));
    const mesActual = dispatch(decMesActual());

    //useEffect  

    useEffect(() => {
        if (datosColumnasConfig && datosVisibilidad) {
            const datosColumnas = {
                pantalla: producto.producto,
                columnas: datosVisibilidad,
                mes,
                anyo
            };
            dispatch(getColumnas(datosColumnas));
            generarColumnas(datosColumnasConfig);
        };
    }, []);

    useEffect(() => {
        if (datosColumnasVisibilidad) {
            if (datosColumnasVisibilidad.mes === mes && datosColumnasVisibilidad.anyo === anyo) {
                let objColumnas = {};
                datosColumnasVisibilidad.columnas.map((columna) => {
                    objColumnas[columna.proveedor] = columna.visible;
                });
                setVisibilidadColumnas(objColumnas);
            };
        };
    }, [datosColumnasVisibilidad]);

    useEffect(() => {
        if (tableColumns && datosTabla && datosProduccionInicial) {
            setTableData(null);
            generarDatos(false);
            const indexInicial = datosProduccionInicial.findIndex(item => item.mes === mes);
            const indexSaldo = datosProduccionSaldo.findIndex(item => item.mes === mes);
            if (datosProduccionInicial[indexInicial].stockInicial === 0 || datosProduccionSaldo[indexSaldo].saldoInicial === 0) {
                setTablaActiva(false);
            } else {
                setTablaActiva(true);
            };
        };
    }, [tableColumns, datosProduccionInicial]);

    // useEffect(() => {
    //     if (calculoTabla) {           
    //         generarDatos(false);
    //         setCalculoTabla(false);
    //     };
    // }, [datosTabla]);

    useEffect(() => {
        if (visibilidadColumnas) {
            let hayCambio = false;
            let objActualizar;
            const arrActualizar = [];
            datosColumnasVisibilidad.columnas.map((columna) => {
                for (const key in columna) {
                    if (key === "proveedor") {
                        objActualizar = { proveedor: columna[key], visible: visibilidadColumnas[columna[key]], _id: columna['_id'] };
                        if (visibilidadColumnas[columna[key]] !== columna['visible']) {
                            hayCambio = true;
                        };
                    };
                };
                arrActualizar.push(objActualizar);
            });
            if (hayCambio) {
                const datosColumnas = {
                    _id: datosColumnasVisibilidad._id,
                    columnas: arrActualizar
                };
                dispatch(updateColumnas(datosColumnas));
            };
        };
    }, [visibilidadColumnas]);

    //funciones

    const calculosTabla = (tabla, mensaje, update, item) => {
        const indexInicial = datosProduccionInicial.findIndex(item => item.mes === mes);
        const indexSaldo = datosProduccionSaldo.findIndex(item => item.mes === mes);
        let sumatorioSaldoInicial = (datosProduccionInicial[indexInicial].stockInicial / producto.unidades) + datosProduccionSaldo[indexSaldo].saldoInicial;
        let sumatorioSaldo = 0;
        let objetoFila = null;
        const arrayTabla = [];
        tabla.map((fila, index) => {
            let sumatorioEntradasVariables = 0;
            let mp_u_f = 0;
            if (semanas[index].mes === mes) {
                objetoFila = { ...fila };
                for (const key in fila) {
                    if (key !== "periodo" && key !== "mp_u_f" && key !== "palets" && key !== "saldo") {
                        sumatorioEntradasVariables += Number(fila[key]);
                    };
                };
                mp_u_f = sumatorioEntradasVariables;
                objetoFila.mp_u_f = mp_u_f;
                objetoFila.saldo = Number(sumatorioSaldoInicial) + sumatorioSaldo + mp_u_f - Number(objetoFila.palets);
                sumatorioSaldo = objetoFila.saldo - sumatorioSaldoInicial;
                arrayTabla.push(objetoFila);
            };
        });
        setCalculoTabla(true);
        setTableData(arrayTabla);
        if (update) {
            actualizarTabla(arrayTabla, true, item);
        };
    };

    const actualizarTabla = (arrayTabla, mensaje, item) => {
        const datosTablaUpdate = [];
        const datosPaletUpdate = [];
        let itemFila, itemConcepto;
        if (item) {
            [itemFila, itemConcepto] = item.split("_");
        };
        let updPedido = { estado: false, obj: null };
        arrayTabla.map((fila, index) => {
            const myArraySplit = fila.periodo.split(' ');
            const semana = Number(myArraySplit[1]);
            let objTablaUpdate = {};
            let objPaletUpdate = {};
            const arrProveedores = [];
            for (const key in fila) {
                if (key !== "periodo") {
                    if (key === "mp_u_f" || key === "saldo") {
                        objTablaUpdate = { ...objTablaUpdate, [key]: Number(fila[key]) };
                    } else {
                        if (key === "palets") {
                            objPaletUpdate = { ...objPaletUpdate, palets: Number(fila[key]) };
                        } else {
                            if (itemConcepto === key && Number(itemFila) === index) {
                                updPedido.estado = true;
                                const unidades = Number(fila[key]);
                                const vol_unitario = _.round(((medidas.largo * medidas.ancho * medidas.grueso) / 1000000000), REDONDEADO);
                                updPedido.obj = {
                                    fila: {
                                        producto: producto.producto,
                                        unidades,
                                        vol_unitario,
                                        vol_total: _.round((unidades * vol_unitario), REDONDEADO)
                                    },
                                    semana,
                                    proveedor: key
                                };
                            };
                            arrProveedores.push({
                                proveedor: key,
                                cantidad: Number(fila[key])
                            });
                            objTablaUpdate = { ...objTablaUpdate, proveedores: arrProveedores };
                        };
                    };
                };
            };
            datosTablaUpdate.push({ _id: datosTabla[index]._id, semana, ...objTablaUpdate });
            datosPaletUpdate.push({ _id: datosPalet[index]._id, semana, ...objPaletUpdate });
        });
        dispatch(updateProduccionTabla({
            datosTabla: datosTablaUpdate,
            datosPalet: datosPaletUpdate,
            mes,
            anyo,
            producto: producto.producto,
            familia: producto.familia,
            mensaje,
            updPedido
        })).then(({ payload }) => {
            if (item) {
                socket.emit("comunicacion", {
                    tabla: "updateProduccionTabla",
                    pantalla: producto.producto,
                    item: itemConcepto
                });
            };
        });
    };

    const generarColumnas = (columnas) => {
        const arrayColumnas = [];
        let objeto = {};
        let accessorKey;
        columnas.map((columna, index) => {
            accessorKey = columna._id ? (columna._id) : (_.deburr(columna.nombre).replaceAll(/[ .]/g, "_").toLowerCase());
            objeto = {
                header: (columna.nombre === 'Periodo' || columna.nombre === 'MP U.F' || columna.nombre === 'Palets' || columna.nombre === 'Saldo') ? columna.nombre : _.capitalize(columna.nombre),
                accessorKey,
                muiTableBodyCellEditTextFieldProps: {
                    type: columna.tipo === 'input' && 'number',
                    autoFocus: index !== 0 && true
                },
                muiTableHeadCellProps: {
                    sx: {
                        paddingLeft: index === 0 && '24px',
                        fontSize: '1.5rem',
                        fontWeight: 700,
                    },
                },
                muiTableBodyCellProps: ({ cell, table }) => ({
                    onClick: () => {
                        columna.tipo === 'input' && (clickCelda(cell, table));
                    },
                }),
                Header: ({ column }) => (
                    <div className='flex flex-row items-center'>
                        {columna.tipo === 'input' && <FuseSvgIcon className="mr-4" size={20}>material-outline:edit_note</FuseSvgIcon>}
                        <div>
                            {column.columnDef.header}
                        </div>
                    </div>
                ),
                Cell: ({ cell, row }) => (
                    <div className='flex flex-row items-center'>
                        {index === 0 && <FuseSvgIcon className="mr-8" size={22}>heroicons-outline:calendar</FuseSvgIcon>}
                        <Typography
                            variant="body1"
                            color={cell.getValue() < 0 && "error"}
                            className="whitespace-nowrap"
                        >
                            {index === 0 ? cell.getValue() : formateado(cell.getValue())}
                        </Typography>
                    </div>
                ),
                size: 75,
            };
            columna.tipo === 'texto' && (objeto['enableEditing'] = false);
            arrayColumnas.push(objeto);
        });
        setTableColumns(arrayColumnas);
    };

    const clickCelda = (cell, table) => {
        if (cell.getValue() === 0) {
            const tabla = [...table.options.data];
            const rowIndex = Number(cell.row.id);
            const columna = cell.column.id;
            tabla[rowIndex][columna] = "";
            setTableData(tabla);
        };
        table.setEditingCell(cell);
    };

    const generarDatos = (actualizando, arrayTabla) => {
        const indexInicial = datosProduccionInicial.findIndex(item => item.mes === mes);
        const indexSaldo = datosProduccionSaldo.findIndex(item => item.mes === mes);
        const arrayDatos = [];
        let sumatorioSaldoInicial = (datosProduccionInicial[indexInicial].stockInicial / producto.unidades) + datosProduccionSaldo[indexSaldo].saldoInicial;
        let sumatorioSaldo = 0;
        semanas.map((semana, indexS) => {
            let objeto = {};
            let saldo = 0;
            let palets = 0;
            let mp_u_f = 0;
            let sumatorioEntradasVariables = 0;
            tableColumns.map((columna, indexT) => {
                let dato = 0;
                if (indexT === 0) {
                    objeto = { ...objeto, [columna[Object.keys(columna)[1]]]: `Sem: ${semana.numeroSemana} - ${semana.nombre}` };
                } else {
                    if (columna.accessorKey !== "mp_u_f" && columna.accessorKey !== "palets" && columna.accessorKey !== "saldo") {
                        const proveedor = datosTabla[indexS].proveedores.find(element => element.proveedor === columna[Object.keys(columna)[1]]);
                        if (proveedor) {
                            dato = proveedor.cantidad;
                        };
                        sumatorioEntradasVariables += dato;
                        objeto = {
                            ...objeto,
                            [columna[Object.keys(columna)[1]]]: dato
                        };
                    };
                    if (columna.accessorKey === "mp_u_f") {
                        mp_u_f = sumatorioEntradasVariables;
                        objeto = {
                            ...objeto,
                            [columna[Object.keys(columna)[1]]]: mp_u_f
                        };
                    };
                    if (columna.accessorKey === "palets") {
                        if (datosPalet[indexS][columna[Object.keys(columna)[1]]]) {
                            palets = datosPalet[indexS][columna[Object.keys(columna)[1]]];
                        };
                        objeto = {
                            ...objeto,
                            [columna[Object.keys(columna)[1]]]: palets
                        };
                    };
                    if (columna.accessorKey === "saldo") {
                        saldo = sumatorioSaldoInicial + sumatorioSaldo + mp_u_f - palets;
                        sumatorioSaldo = saldo - sumatorioSaldoInicial;
                        objeto = {
                            ...objeto,
                            [columna[Object.keys(columna)[1]]]: saldo
                        };
                    };
                };
            });
            arrayDatos.push(objeto);
        });
        setTableData(arrayDatos);
        actualizando && (actualizarTabla(arrayDatos, false, null));
    };

    const handleChangeCell = (cell, event) => {
        setChangedData({ estado: true, item: cell.id });
        const tabla = [...tableData];
        const rowIndex = Number(cell.row.id);
        const columna = cell.column.id;
        let valor = event.target.value;
        !valor && (valor = 0);
        tabla[rowIndex][columna] = valor;
        calculosTabla(tabla, false, false, null);
    };

    const handleExitCell = (cell) => {
        const tabla = [...tableData];
        if (changedData.estado) {
            calculosTabla(tabla, true, true, changedData.item);
            setChangedData({ estado: false, item: null });
        } else {
            if (!cell.getValue()) {
                const rowIndex = Number(cell.row.id);
                const columna = cell.column.id;
                tabla[rowIndex][columna] = 0;
                setTableData(tabla);
            };
        };
    };

    const retornaPeriodo = (periodo) => {
        const [, mes1] = _.split(periodo, '/');
        const mes2 = mesActual.mes.slice(0, 3);
        return { mes1, mes2 }
    };

    const retornaClick = (periodo, event) => {
        const { mes1, mes2 } = retornaPeriodo(periodo);
        if (!tablaActiva) {
            dispatch(showMessage({ message: `Falta rellenar los datos Stock inicial o Saldo inicial del mes: ${_.capitalize(mes)} - ${anyo}`, variant: "warning", autoHideDuration: 6000 }));
            event.preventDefault();
            event.stopPropagation();
        } else {
            if (mes1 !== mes2) {
                dispatch(setMesSeleccionadoIniciales(mes));
            };
        };
    };

    const retornaSx = (periodo, editable, id) => {
        const [, semana] = periodo.split(" ");
        let sxRetornar = {
            paddingLeft: '24px'
        };
        if (id === "periodo") {
            sxRetornar = {
                ...sxRetornar,
                pointerEvents: "none",
                backgroundColor: Number(semana) === semanaActual ? '#e5e9ec' : 'white',
            };
        } else {
            if (!tablaActiva) {
                sxRetornar = {
                    ...sxRetornar,
                    cursor: 'default',
                    '&:hover': {
                        backgroundColor: 'white',
                    },
                    color: "#959CA9",
                    backgroundColor: 'white',
                };
            } else {
                sxRetornar = {
                    ...sxRetornar,
                    cursor: editable ? 'pointer' : 'default',
                    '&:hover': {
                        backgroundColor: editable && ('#e5e9ec'),
                    },
                    backgroundColor: 'white',
                };
            };
        };
        return sxRetornar
    };

    if (!tableData && !visibilidadColumnas) {
        return null
    };

    return (
        (tableData && visibilidadColumnas) && (
            <TableContainer component={Paper} className="rounded-2xl mb-24">
                <MaterialReactTable
                    {...dispatch(generarPropsTabla(
                        true,
                        true,
                        `Tabla cálculos producción mes: ${_.capitalize(mes)} - ${anyo}`,
                        '',
                        null,
                        null,
                        false
                    ))}
                    columns={tableColumns}
                    data={tableData}
                    muiTableBodyRowProps={({ row }) => ({
                        onClickCapture: (event) => {
                            retornaClick(row.getValue('periodo'), event);
                        },
                    })}
                    muiTableBodyCellProps={({ cell }) => ({
                        onChange: (event) => {
                            handleChangeCell(cell, event);
                        },
                        onBlur: () => {
                            handleExitCell(cell);
                        },
                        sx: retornaSx(
                            cell.row.original.periodo,
                            cell.column.columnDef.muiTableBodyCellEditTextFieldProps.type,
                            cell.column.id
                        )
                    })}
                    onColumnVisibilityChange={setVisibilidadColumnas}
                    state={{
                        columnVisibility: visibilidadColumnas,
                    }}
                />
            </TableContainer>
        )
    );
}

export default PanelProduccion1;
