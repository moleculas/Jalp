import Paper from '@mui/material/Paper';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import _ from '@lodash';
import MaterialReactTable from 'material-react-table';
import TableContainer from '@mui/material/TableContainer';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Typography from '@mui/material/Typography';

//importacion acciones
import { generarPropsTabla } from 'app/logica/produccion/logicaProduccion';
import {
    selectDatosProduccionInicial,
    selectDatosProduccionSaldo,
    updateProduccionTabla
} from 'app/redux/produccion/produccionSlice';
import { showMessage } from 'app/redux/fuse/messageSlice';

function PanelProduccion1(props) {
    const { columnas, semanas, datosTabla, datosPalet, producto, mes } = props;
    const dispatch = useDispatch();
    const datosProduccionInicial = useSelector(selectDatosProduccionInicial);
    const datosProduccionSaldo = useSelector(selectDatosProduccionSaldo);
    const [tableColumns, setTableColumns] = useState(null);
    const [tableData, setTableData] = useState(null);
    const [calculoTabla, setCalculoTabla] = useState(false);
    const [changedData, setChangedData] = useState(false);

    //useEffect  

    useEffect(() => {
        if (columnas) {
            generarColumnas(columnas);
        };
    }, []);

    useEffect(() => {
        if (tableColumns && datosTabla && datosProduccionInicial) {
            setTableData(null);
            generarDatos(true);
        };
    }, [tableColumns, datosProduccionInicial]);

    useEffect(() => {
        if (calculoTabla) {
            generarDatos(false);
            setCalculoTabla(false);
        };
    }, [datosTabla]);

    //funciones

    const calculosTabla = (tabla, mensaje, update) => {
        let sumatorioSaldoInicial = (datosProduccionInicial.stockInicial / producto.unidades) + datosProduccionSaldo.saldoInicial;
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
                if (fila.mp_u_f) {
                    objetoFila.mp_u_f = mp_u_f;
                };
                objetoFila.saldo = Number(sumatorioSaldoInicial) + sumatorioSaldo + mp_u_f - Number(objetoFila.palets);
                sumatorioSaldo = objetoFila.saldo - sumatorioSaldoInicial;
                arrayTabla.push(objetoFila);
            };
        });
        setCalculoTabla(true);
        setTableData(arrayTabla);
        if (update) {
            actualizarTabla(arrayTabla, true);
        };
    };

    const actualizarTabla = (arrayTabla, mensaje) => {
        const datosTablaUpdate = [];
        const datosPaletUpdate = [];
        arrayTabla.map((fila, index) => {
            let objetoTablaUpdate = {};
            let objetoPaletUpdate = {};
            for (const key in fila) {
                if (key === "palets") {
                    objetoPaletUpdate = { ...objetoPaletUpdate, palets: fila[key] };
                } else {
                    if (key !== "periodo") {
                        objetoTablaUpdate = { ...objetoTablaUpdate, [key]: fila[key] };
                    };
                };
            };
            datosTablaUpdate.push({ _id: datosTabla[index]._id, ...objetoTablaUpdate });
            datosPaletUpdate.push({ _id: datosPalet[index]._id, ...objetoPaletUpdate });
        });
        dispatch(updateProduccionTabla({ datosTabla: datosTablaUpdate, datosPalet: datosPaletUpdate, mensaje }));
    };

    const generarColumnas = (columnas) => {
        const arrayColumnas = [];
        let objeto = {};
        let accessorKey;
        columnas.map((columna, index) => {
            accessorKey = _.deburr(columna.nombre).replaceAll(/[ .]/g, "_").toLowerCase();
            objeto = {
                header: columna.nombre,
                accessorKey,
                muiTableBodyCellEditTextFieldProps: {
                    type: index !== 0 && 'number',
                },
                muiTableHeadCellProps: {
                    sx: {
                        paddingLeft: index === 0 && '24px'
                    },
                },
                muiTableBodyCellProps: {
                    sx: {
                        paddingLeft: '24px',
                        backgroundColor: 'white',
                        cursor: columna.tipo === 'input' ? 'pointer' : 'default',
                        '&:hover': {
                            backgroundColor: columna.tipo === 'input' && '#ebebeb',
                        },
                    },
                },
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
                            className="truncate"
                            color={cell.getValue() < 0 && "error"}
                        >
                            {cell.getValue()}
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

    const generarDatos = (actualizando, arrayTabla) => {
        const arrayDatos = [];
        let sumatorioSaldoInicial = (datosProduccionInicial.stockInicial / producto.unidades) + datosProduccionSaldo.saldoInicial;
        let sumatorioSaldo = 0;
        semanas.map((semana, indexS) => {
            let objeto = {};
            let saldo = 0;
            let palets = 0;
            let mp_u_f = 0;
            let sumatorioEntradasVariables = 0;
            tableColumns.map((columna, indexT) => {
                let dato = 0;
                if (semanas[indexS].mes === mes) {
                    if (indexT === 0) {
                        objeto = { ...objeto, [columna[Object.keys(columna)[1]]]: `Sem: ${semana.numeroSemana} - ${semana.nombre}` };
                    } else {
                        if (columna.accessorKey !== "mp_u_f" && columna.accessorKey !== "palets" && columna.accessorKey !== "saldo") {
                            datosTabla[indexS][columna[Object.keys(columna)[1]]] && (dato = datosTabla[indexS][columna[Object.keys(columna)[1]]]);
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
                } else {
                    if (indexT === 0) {
                        objeto = { ...objeto, [columna[Object.keys(columna)[1]]]: `Sem: ${semana.numeroSemana} - ${semana.nombre}` };
                    } else {
                        datosTabla[indexS][columna[Object.keys(columna)[1]]] && (dato = datosTabla[indexS][columna[Object.keys(columna)[1]]]);
                        objeto = {
                            ...objeto,
                            [columna[Object.keys(columna)[1]]]: dato
                        };
                    };
                };
            });
            arrayDatos.push(objeto);
        });
        setTableData(arrayDatos);
        actualizando && (actualizarTabla(arrayDatos, false));
    };

    const handleChangeCell = (cell, event) => {
        setChangedData(true);
        const tabla = [...tableData];
        const rowIndex = Number(cell.row.id);
        const columna = cell.column.id;
        let valor = event.target.value;
        !valor && (valor = 0);
        tabla[rowIndex][columna] = valor;
        calculosTabla(tabla, false, false);
    };

    const handleExitCell = (cell) => {
        const tabla = [...tableData];
        if (changedData) {
            calculosTabla(tabla, true, true);
            setChangedData(false);
        };
    };

    const retornaPeriodo = (periodo) => {
        const periodoSplt = _.split(periodo, '/');
        const mes1 = periodoSplt[1];
        const mes2 = mes.slice(0, 3);
        return { mes1, mes2 }
    };

    const retornaClick = (periodo, event) => {
        const { mes1, mes2 } = retornaPeriodo(periodo);
        if (mes1 === mes2) {
            if (datosProduccionInicial.stockInicial === 0 || datosProduccionSaldo.saldoInicial === 0) {
                let mensaje;
                if (datosProduccionInicial.stockInicial === 0 && datosProduccionSaldo.saldoInicial !== 0) {
                    mensaje = "Falta rellenar los datos Stock inicial";
                } else if (datosProduccionInicial.stockInicial !== 0 && datosProduccionSaldo.saldoInicial === 0) {
                    mensaje = "Falta rellenar los datos Saldo inicial";
                } else {
                    mensaje = "Falta rellenar los datos Stock inicial y Saldo inicial";
                };
                dispatch(showMessage({ message: mensaje, variant: "warning" }));
                event.preventDefault();
                event.stopPropagation();
            };
        };
    };

    const retornaSx = (periodo) => {
        const { mes1, mes2 } = retornaPeriodo(periodo);
        let sxRetornar = null;
        if (mes1 === mes2) {
            sxRetornar = {
                backgroundColor: 'white'
            }
        } else {
            sxRetornar = {
                '& td': {
                    pointerEvents: 'none',                  
                },
                backgroundColor: 'white'
            }
        };
        return sxRetornar
    };

    if (!tableData) {
        return null
    };

    return (
        <TableContainer component={Paper} className="rounded-2xl">
            <MaterialReactTable
                {...dispatch(generarPropsTabla(true, true, 'Tabla cálculos producción', '', null, null, false))}
                columns={tableColumns}
                data={tableData}
                muiTableBodyRowProps={({ row }) => ({
                    onDoubleClickCapture: (event) => {
                        retornaClick(row.getValue('periodo'), event);
                    },
                    sx: semanas.length > 5 ? retornaSx(row.getValue('periodo')) : { backgroundColor: 'white' }
                })}
                muiTableBodyCellProps={({ cell }) => ({                    
                    onChange: (event) => {
                        handleChangeCell(cell, event);
                    },
                    onBlur: () => {
                        handleExitCell(cell);
                    },
                    sx: {
                        backgroundColor: 'white',
                        cursor: 'default'
                    }
                })}
            />
        </TableContainer>
    );
}

export default PanelProduccion1;
