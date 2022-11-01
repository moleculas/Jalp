import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import _ from '@lodash';
import MaterialReactTable from 'material-react-table';
import TableContainer from '@mui/material/TableContainer';
import Typography from '@mui/material/Typography';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Paper from '@mui/material/Paper';

//importacion acciones
import { generarPropsTabla } from 'app/logica/produccion/logicaProduccion';
import {
    setAnadirFilaIdCotizacion,
    selectAnadirFilaIdCotizacion,
    setObjetoCotizacionCuerpo,
    selectObjetoCotizacionActualizado
} from 'app/redux/produccion/cotizacionSlice';

function CuerpoCotizacion(props) {
    const { cotizacionCuerpo } = props;
    const dispatch = useDispatch();
    const anadirFilaIdCotizacion = useSelector(selectAnadirFilaIdCotizacion);
    const [tableColumns, setTableColumns] = useState(null);
    const [tableData, setTableData] = useState(null);
    const [changedData, setChangedData] = useState(false);
    const cotizacionActualizado = useSelector(selectObjetoCotizacionActualizado);

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
            };
            arrayDatos.push(objetoDatos);
            setTableData(arrayDatos);
            dispatch(setAnadirFilaIdCotizacion(false));
        };
    }, [anadirFilaIdCotizacion]);

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
                        paddingLeft: '24px'
                    },
                },
                muiTableBodyCellEditTextFieldProps: {
                    type: 'number',
                },
                muiTableBodyCellProps: {
                    sx: {
                        '&:hover': {
                            backgroundColor: '#ebebeb',
                        },
                        paddingLeft: '24px',
                        backgroundColor: 'white',
                    },
                },
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
                    >
                        {cell.getValue()}
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
                },
                muiTableBodyCellProps: {
                    sx: {
                        '&:hover': {
                            backgroundColor: '#ebebeb',
                        },
                        backgroundColor: 'white',
                    },
                },
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
                    >
                        {cell.getValue()}
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
                },
                muiTableBodyCellProps: {
                    sx: {
                        '&:hover': {
                            backgroundColor: '#ebebeb',
                        },
                        backgroundColor: 'white',
                    },
                },
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
                    >
                        {cell.getValue()}
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
                },
                muiTableBodyCellProps: {
                    sx: {
                        '&:hover': {
                            backgroundColor: '#ebebeb',
                        },
                        backgroundColor: 'white',
                    },
                },
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
                    >
                        {cell.getValue()}
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
                        {cell.getValue() + " m³"}
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
                    >
                        {cell.getValue() + " m³"}
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
                },
                muiTableBodyCellProps: {
                    sx: {
                        '&:hover': {
                            backgroundColor: '#ebebeb',
                        },
                        backgroundColor: 'white',
                    },
                },
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
                    >
                        {cell.getValue() + " €/m³"}
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
                    >
                        {cell.getValue() + " €"}
                    </Typography>
                ),
                size: 50,
                Footer: ({ table }) => retornaTotales(table, 'precio_t'),
            },
        ];
        setTableColumns(arrayColumnas);
    };

    const retornaTotales = (table, columna) => {
        switch (columna) {
            case 'vol_unitario':
                if (table.options.data[0].vol_unitario > 0) {
                    const sumatorioTotales1 = table.options.data.reduce((sum, { vol_unitario }) => sum + vol_unitario, 0);
                    return (
                        <Typography variant="body1">
                            <span className="font-bold">
                                {`${_.round(sumatorioTotales1, 5)} m³`}
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
                            <span className="font-bold">
                                {`${_.round(sumatorioTotales2, 5)} m³`}
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
                            <span className="font-bold">
                                {`${_.round(sumatorioTotales3, 5)} €`}
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
                    precio_t: fila.precio_t
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
                precio_t: 0
            };
            arrayDatos.push(objetoDatos);
        };
        setTableData(arrayDatos);
    };

    const calculosTabla = (tabla, indice, update) => {
        let objetoFila;
        const arrayTabla = [];
        tabla.map((fila) => {
            objetoFila = { ...fila };
            objetoFila.unidades = Number(objetoFila.unidades);
            objetoFila.largo = Number(objetoFila.largo);
            objetoFila.ancho = Number(objetoFila.ancho);
            objetoFila.grueso = Number(objetoFila.grueso);
            objetoFila.precio = Number(objetoFila.precio);
            objetoFila.vol_unitario = _.round(((objetoFila.largo * objetoFila.ancho * objetoFila.grueso) / 1000000000), 5);
            objetoFila.vol_total = _.round((objetoFila.unidades * objetoFila.vol_unitario), 5);
            objetoFila.precio_t = _.round((objetoFila.vol_total * objetoFila.precio), 5);
            arrayTabla.push(objetoFila);
        });
        setTableData(arrayTabla);
        if (update) {
            actualizarTabla(arrayTabla);
        };
    };

    const actualizarTabla = (arrayTabla) => {
        let datosCotizacionUpdate = {};
        if (cotizacionCuerpo) {
            datosCotizacionUpdate = { ...cotizacionCuerpo };
        };
        const arrayLinea = arrayTabla.map(({ unidades, largo, ancho, grueso, precio, vol_unitario, vol_total, precio_t }) => ({ unidades, largo, ancho, grueso, precio, vol_unitario, vol_total, precio_t }));
        datosCotizacionUpdate.filasCuerpo = arrayLinea;
        const sumCuerpo = arrayLinea.reduce((sum, { precio_t }) => sum + precio_t, 0);
        datosCotizacionUpdate.sumCuerpo = _.round(sumCuerpo, 5);
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
                borderBottomRightRadius: '16px'
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
            />
        </TableContainer>
    );
}

export default CuerpoCotizacion;