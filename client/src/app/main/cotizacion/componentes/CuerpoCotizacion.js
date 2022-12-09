import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import _ from '@lodash';
import MaterialReactTable from 'material-react-table';
import TableContainer from '@mui/material/TableContainer';
import Typography from '@mui/material/Typography';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import clsx from 'clsx';

//constantes
import { REDONDEADO } from 'constantes';

//importacion acciones
import {
    generarPropsTabla,
    formateado,
    removeArrayByIndex
} from 'app/logica/produccion/logicaProduccion';
import {
    setAnadirFilaIdCotizacion,
    selectAnadirFilaIdCotizacion,
    setObjetoCotizacionCuerpo,
    selectObjetoCotizacionActualizado,
    openNoteDialog,
    setMermaIndex,
    setRegistraIntervencionDialog,
    selectRegistraIntervencionDialog
} from 'app/redux/produccion/cotizacionSlice';

function CuerpoCotizacion(props) {
    const { cotizacionCuerpo } = props;
    const dispatch = useDispatch();
    const anadirFilaIdCotizacion = useSelector(selectAnadirFilaIdCotizacion);
    const [tableColumns, setTableColumns] = useState(null);
    const [tableData, setTableData] = useState(null);
    const [changedData, setChangedData] = useState(false);
    const cotizacionActualizado = useSelector(selectObjetoCotizacionActualizado);
    const registraIntervencionDialog = useSelector(selectRegistraIntervencionDialog);

    //useEffect  

    useEffect(() => {
        generarColumnas();
    }, []);

    useEffect(() => {
        if (tableColumns) {
            setTableData(null);
            generarDatos();
        };
    }, [tableColumns]);

    useEffect(() => {
        setTableData(null);
        generarDatos();
    }, [cotizacionActualizado]);

    useEffect(() => {
        if (anadirFilaIdCotizacion) {
            const arrayDatos = [...tableData];
            let objetoDatos = {
                unidades: 0,
                largo: 0,
                ancho: 0,
                grueso: 0,
                vol_unitario: 0,
                vol_total: 0,
                precio: 0,
                precio_t: 0,
                vol_merma: 0,
            };
            arrayDatos.push(objetoDatos);
            setTableData(arrayDatos);
            dispatch(setAnadirFilaIdCotizacion(false));
        };
    }, [anadirFilaIdCotizacion]);

    useEffect(() => {
        if (registraIntervencionDialog === "merma") {
            calculosTabla(tableData, null, true);
            dispatch(setRegistraIntervencionDialog(null));
        };
    }, [registraIntervencionDialog]);

    //funciones    

    const generarColumnas = () => {
        const arrayColumnas = [
            {
                header: 'Unidades',
                accessorKey: 'unidades',
                enableSorting: false,
                enableColumnFilter: false,
                muiTableHeadCellProps: {
                    sx: {
                        paddingLeft: '24px',
                        fontSize: '1.5rem',
                        fontWeight: 700,
                    },
                },
                muiTableBodyCellEditTextFieldProps: {
                    type: 'number',
                    autoFocus: true
                },
                muiTableBodyCellProps: ({ cell, table }) => ({
                    onClick: () => clickCelda(cell, table),
                    sx: {
                        '&:hover': {
                            backgroundColor: '#ebebeb',
                        },
                        paddingLeft: '24px',
                        backgroundColor: 'white',
                    },
                }),
                Header: ({ column }) => (
                    <div className='flex flex-row items-center'>
                        <FuseSvgIcon className="mr-4" size={20}>material-outline:edit_note</FuseSvgIcon>
                        <div>
                            {column.columnDef.header}
                        </div>
                    </div>
                ),
                Cell: ({ cell, row }) => (
                    <Typography
                        variant="body1"
                        color={cell.getValue() < 0 && "error"}
                        className="whitespace-nowrap"
                    >
                        {formateado(cell.getValue())}
                    </Typography>
                ),
                size: 50,
            },
            {
                header: 'Largo',
                accessorKey: 'largo',
                enableSorting: false,
                enableColumnFilter: false,
                muiTableBodyCellEditTextFieldProps: {
                    type: 'number',
                    autoFocus: true
                },
                muiTableBodyCellProps: ({ cell, table }) => ({
                    onClick: () => clickCelda(cell, table),
                    sx: {
                        '&:hover': {
                            backgroundColor: '#ebebeb',
                        },
                        backgroundColor: 'white',
                    },
                }),
                Header: ({ column }) => (
                    <div className='flex flex-row items-center'>
                        <FuseSvgIcon className="mr-4" size={20}>material-outline:edit_note</FuseSvgIcon>
                        <div>
                            {column.columnDef.header}
                        </div>
                    </div>
                ),
                Cell: ({ cell, row }) => (
                    <Typography
                        variant="body1"
                        color={cell.getValue() < 0 && "error"}
                        className="whitespace-nowrap"
                    >
                        {formateado(cell.getValue())}
                    </Typography>
                ),
                size: 50,
            },
            {
                header: 'Ancho',
                accessorKey: 'ancho',
                enableSorting: false,
                enableColumnFilter: false,
                muiTableBodyCellEditTextFieldProps: {
                    type: 'number',
                    autoFocus: true
                },
                muiTableBodyCellProps: ({ cell, table }) => ({
                    onClick: () => clickCelda(cell, table),
                    sx: {
                        '&:hover': {
                            backgroundColor: '#ebebeb',
                        },
                        backgroundColor: 'white',

                    },
                }),
                Header: ({ column }) => (
                    <div className='flex flex-row items-center'>
                        <FuseSvgIcon className="mr-4" size={20}>material-outline:edit_note</FuseSvgIcon>
                        <div>
                            {column.columnDef.header}
                        </div>
                    </div>
                ),
                Cell: ({ cell, row }) => (
                    <Typography
                        variant="body1"
                        color={cell.getValue() < 0 && "error"}
                        className="whitespace-nowrap"
                    >
                        {formateado(cell.getValue())}
                    </Typography>
                ),
                size: 50,
            },
            {
                header: 'Grueso',
                accessorKey: 'grueso',
                enableSorting: false,
                enableColumnFilter: false,
                muiTableBodyCellEditTextFieldProps: {
                    type: 'number',
                    autoFocus: true
                },
                muiTableBodyCellProps: ({ cell, table }) => ({
                    onClick: () => clickCelda(cell, table),
                    sx: {
                        '&:hover': {
                            backgroundColor: '#ebebeb',
                        },
                        backgroundColor: 'white',
                    },
                }),
                Header: ({ column }) => (
                    <div className='flex flex-row items-center'>
                        <FuseSvgIcon className="mr-4" size={20}>material-outline:edit_note</FuseSvgIcon>
                        <div>
                            {column.columnDef.header}
                        </div>
                    </div>
                ),
                Cell: ({ cell, row }) => (
                    <Typography
                        variant="body1"
                        color={cell.getValue() < 0 && "error"}
                        className="whitespace-nowrap"
                    >
                        {formateado(cell.getValue())}
                    </Typography>
                ),
                size: 50,
            },
            {
                header: 'Vol.Unitario',
                accessorKey: 'vol_unitario',
                enableSorting: false,
                enableColumnFilter: false,
                enableEditing: false,
                Cell: ({ cell, row }) => (
                    <Typography
                        variant="body1"
                        color={cell.getValue() < 0 && "error"}
                    >
                        {formateado(cell.getValue()) + " m³"}
                    </Typography>
                ),
                size: 50,
                Footer: ({ table }) => retornaTotales(table, 'vol_unitario'),
            },
            {
                header: 'Vol.Total',
                accessorKey: 'vol_total',
                enableSorting: false,
                enableColumnFilter: false,
                enableEditing: false,
                Cell: ({ cell, row }) => (
                    <Typography
                        variant="body1"
                        color={cell.getValue() < 0 && "error"}
                        className="whitespace-nowrap"
                    >
                        {formateado(cell.getValue()) + " m³"}
                    </Typography>
                ),
                size: 50,
                Footer: ({ table }) => retornaTotales(table, 'vol_total'),
            },
            {
                header: 'Precio',
                accessorKey: 'precio',
                enableSorting: false,
                enableColumnFilter: false,
                muiTableBodyCellEditTextFieldProps: {
                    type: 'number',
                    autoFocus: true
                },
                muiTableBodyCellProps: ({ cell, table }) => ({
                    onClick: () => clickCelda(cell, table),
                    sx: {
                        '&:hover': {
                            backgroundColor: '#ebebeb',
                        },
                        backgroundColor: 'white',
                    },
                }),
                Header: ({ column }) => (
                    <div className='flex flex-row items-center'>
                        <FuseSvgIcon className="mr-4" size={20}>material-outline:edit_note</FuseSvgIcon>
                        <div>
                            {column.columnDef.header}
                        </div>
                    </div>
                ),
                Cell: ({ cell, row }) => (
                    <Typography
                        variant="body1"
                        color={cell.getValue() < 0 && "error"}
                        className="whitespace-nowrap"
                    >
                        {formateado(cell.getValue()) + " €/m³"}
                    </Typography>
                ),
                size: 50,
            },
            {
                header: 'PrecioT.',
                accessorKey: 'precio_t',
                enableSorting: false,
                enableColumnFilter: false,
                enableEditing: false,
                Cell: ({ cell, row }) => (
                    <Typography
                        variant="body1"
                        color={cell.getValue() < 0 && "error"}
                        className="whitespace-nowrap"
                    >
                        {formateado(cell.getValue()) + " €"}
                    </Typography>
                ),
                size: 50,
                Footer: ({ table }) => retornaTotales(table, 'precio_t'),
            },
            {
                header: 'Vol.Merma',
                accessorKey: 'vol_merma',
                enableSorting: false,
                enableColumnFilter: false,
                enableEditing: false,
                muiTableBodyCellProps: ({ cell, table }) => ({
                    onClick: () => {
                        gestionCeldaMerma(Number(cell.row.id), 'click', table.options.data);
                    },
                    sx: {
                        '&:hover': {
                            backgroundColor: gestionCeldaMerma(Number(cell.row.id), 'bg', table.options.data)
                        },
                        backgroundColor: 'white',
                        cursor: gestionCeldaMerma(Number(cell.row.id), 'cursor', table.options.data),
                        color: gestionCeldaMerma(Number(cell.row.id), 'color', table.options.data)
                    },
                }),
                Header: ({ column }) => (
                    <div className='flex flex-row items-center'>
                        <FuseSvgIcon className="mr-4" size={20}>material-outline:edit_note</FuseSvgIcon>
                        <div>
                            {column.columnDef.header}
                        </div>
                    </div>
                ),
                Cell: ({ cell }) => {
                    let valorCeldaParsed = 0;
                    const valorCelda = cell.getValue();
                    valorCelda.vol_merma && (valorCeldaParsed = valorCelda.vol_merma);
                    return (
                        <Typography
                            variant="body1"
                            className="whitespace-nowrap"
                        >
                            {formateado(valorCeldaParsed) + " m³"}
                        </Typography>
                    )
                },
                size: 50,
                Footer: ({ table }) => retornaTotales(table, 'vol_merma'),
            },
        ];
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

    const retornaTotales = (table, columna) => {
        switch (columna) {
            case 'vol_unitario':
                if (table.options.data[0].vol_unitario > 0) {
                    const sumatorioTotales1 = table.options.data.reduce((sum, { vol_unitario }) => sum + vol_unitario, 0);
                    return (
                        <Typography variant="body1">
                            <span className="font-bold whitespace-nowrap">
                                {`${formateado(sumatorioTotales1)} m³`}
                            </span>
                        </Typography>
                    )
                };
                break;
            case 'vol_total':
                if (table.options.data[0].vol_unitario > 0) {
                    const sumatorioTotales2 = table.options.data.reduce((sum, { vol_total }) => sum + vol_total, 0);
                    return (
                        <Typography variant="body1">
                            <span className="font-bold whitespace-nowrap">
                                {`${formateado(sumatorioTotales2)} m³`}
                            </span>
                        </Typography>
                    )
                };
                break;
            case 'precio_t':
                if (table.options.data[0].vol_unitario > 0) {
                    const sumatorioTotales3 = table.options.data.reduce((sum, { precio_t }) => sum + precio_t, 0);
                    return (
                        <Typography variant="body1">
                            <span className="font-bold whitespace-nowrap">
                                {`${formateado(sumatorioTotales3)} €`}
                            </span>
                        </Typography>
                    )
                };
                break;
            case 'vol_merma':
                if (table.options.data[0].vol_merma !== 0) {
                    let sumatorioTotales4 = 0;
                    table.options.data.map((fila) => { fila.vol_merma && (sumatorioTotales4 += fila.vol_merma.vol_merma) });
                    return (
                        <Typography variant="body1">
                            <span className="font-bold whitespace-nowrap">
                                {`${formateado(sumatorioTotales4)} m³`}
                            </span>
                        </Typography>
                    )
                };
                break;
            default:
        };
    };

    const generarDatos = () => {
        const arrayDatos = [];
        let objetoDatos;
        if (cotizacionActualizado) {
            cotizacionActualizado.filasCuerpo.forEach((fila) => {
                objetoDatos = {
                    unidades: fila.unidades,
                    largo: fila.largo,
                    ancho: fila.ancho,
                    grueso: fila.grueso,
                    vol_unitario: fila.vol_unitario,
                    vol_total: fila.vol_total,
                    precio: fila.precio,
                    precio_t: fila.precio_t,
                    vol_merma: fila.vol_merma,
                };
                arrayDatos.push(objetoDatos);
            });
        } else {
            objetoDatos = {
                unidades: 0,
                largo: 0,
                ancho: 0,
                grueso: 0,
                vol_unitario: 0,
                vol_total: 0,
                precio: 0,
                precio_t: 0,
                vol_merma: 0,
            };
            arrayDatos.push(objetoDatos);
        };
        setTableData(arrayDatos);
    };

    const calculosTabla = (tabla, indice, update) => {
        const arrayTabla = [];
        tabla.map((fila, index) => {
            let objetoFila = {};
            let merma = 0;
            if (cotizacionActualizado && !cotizacionCuerpo) {
                merma = cotizacionActualizado.filasCuerpo[index].vol_merma;
            };
            if (cotizacionCuerpo && cotizacionCuerpo.filasCuerpo[index] && cotizacionCuerpo.filasCuerpo[index].vol_merma) {
                merma = cotizacionCuerpo.filasCuerpo[index].vol_merma;
            };
            objetoFila.unidades = Number(fila.unidades);
            objetoFila.largo = Number(fila.largo);
            objetoFila.ancho = Number(fila.ancho);
            objetoFila.grueso = Number(fila.grueso);
            objetoFila.precio = Number(fila.precio);
            objetoFila.vol_unitario = _.round(((objetoFila.largo * objetoFila.ancho * objetoFila.grueso) / 1000000000), REDONDEADO);
            objetoFila.vol_total = _.round((objetoFila.unidades * objetoFila.vol_unitario), REDONDEADO);
            objetoFila.precio_t = _.round((objetoFila.vol_total * objetoFila.precio), REDONDEADO);
            objetoFila.vol_merma = merma;
            arrayTabla.push(objetoFila);
        });
        setTableData(arrayTabla);
        if (update) {
            actualizarTabla(arrayTabla);
        };
    };

    const actualizarTabla = (arrayTabla) => {
        let datosCotizacionUpdate = {};
        const arrayLinea = arrayTabla.map(({ unidades, largo, ancho, grueso, precio, vol_unitario, vol_total, precio_t, vol_merma }) => ({ unidades, largo, ancho, grueso, precio, vol_unitario, vol_total, precio_t, vol_merma }));
        datosCotizacionUpdate.filasCuerpo = arrayLinea;
        const sumCuerpo = arrayLinea.reduce((sum, { precio_t }) => sum + precio_t, 0);
        datosCotizacionUpdate.sumCuerpo = _.round(sumCuerpo, 5);
        const sumVolumen = arrayLinea.reduce((sum, { vol_total }) => sum + vol_total, 0);
        datosCotizacionUpdate.sumVolumen = _.round(sumVolumen, 5);
        let sumPrecioMerma = 0;
        let sumVolumenMerma = 0;
        arrayLinea.map((fila) => {
            if (fila.vol_merma !== 0) {
                sumPrecioMerma += fila.vol_merma.precio_merma;
                sumVolumenMerma += fila.vol_merma.vol_merma;
            };
        });
        datosCotizacionUpdate.sumPrecioMerma = _.round(sumPrecioMerma, REDONDEADO);
        datosCotizacionUpdate.sumVolumenMerma = _.round(sumVolumenMerma, REDONDEADO);
        dispatch(setObjetoCotizacionCuerpo(datosCotizacionUpdate));
    };

    const handleChangeCell = (cell, event) => {
        setChangedData(true);
        const tabla = [...tableData];
        const rowIndex = Number(cell.row.id);
        const columna = cell.column.id;
        let valor = event.target.value;
        !valor && (valor = 0);
        tabla[rowIndex][columna] = valor;
        calculosTabla(tabla, rowIndex, false);
    };

    const handleExitCell = (cell) => {
        const tabla = [...tableData];
        const rowIndex = Number(cell.row.id);
        if (changedData) {
            calculosTabla(tabla, rowIndex, true);
            setChangedData(false);
        } else {
            if (!cell.getValue()) {
                const rowIndex = Number(cell.row.id);
                const columna = cell.column.id;
                tabla[rowIndex][columna] = 0;
                setTableData(tabla);
            };
        };
    };

    const borrarColumna = (id) => {
        const myArray = removeArrayByIndex(tableData, id);
        setTableData(myArray);
    };

    const gestionCeldaMerma = (rowId, consulta, table) => {
        switch (consulta) {
            case 'click':
                if (table[rowId].precio_t === 0) {
                    return false
                } else {
                    dispatch(openNoteDialog('mermaCuerpo'));
                    dispatch(setMermaIndex(rowId));
                };
                break;
            case 'bg':
                if (table[rowId].precio_t === 0) {
                    return 'white'
                } else {
                    return '#ebebeb'
                };
                break;
            case 'cursor':
                if (table[rowId].precio_t === 0) {
                    return 'default'
                } else {
                    return 'pointer'
                };
                break;
            case 'color':
                if (table[rowId].precio_t === 0) {
                    return '#959CA9'
                } else {
                    return '#111827'
                };
                break;
            default:
        };
    };

    if (!tableData) {
        return null
    };

    return (
        <TableContainer
            component={Paper}
            className="relative w-full overflow-hidden h-full"
            style={{
                borderTopLeftRadius: '0px',
                borderTopRightRadius: '0px',
                borderBottomLeftRadius: '16px',
                borderBottomRightRadius: '16px',
            }}
        >
            <MaterialReactTable
                {...dispatch(generarPropsTabla(
                    false,
                    false,
                    '',
                    '',
                    null,
                    '',
                    false
                ))}
                enableTopToolbar={false}
                columns={tableColumns}
                data={tableData}
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
                muiTableProps={{
                    sx: {
                        display: 'none',
                    }
                }}
                enableRowActions={true}
                positionActionsColumn="last"
                renderRowActions={({ row, table }) => (
                    <Box className="p-0 m-0">
                        <Tooltip arrow placement="top-start" title="Borrar fila">
                            <IconButton
                                size='small'
                                className={clsx(Number(row.id) === 0 && 'hidden')}
                                onClick={() => borrarColumna(Number(row.id))}
                            >
                                <FuseSvgIcon>material-outline:delete</FuseSvgIcon>
                            </IconButton>
                        </Tooltip>
                    </Box>
                )}
            />
        </TableContainer>
    );
}

export default CuerpoCotizacion;