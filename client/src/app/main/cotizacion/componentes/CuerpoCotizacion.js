import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, useRef } from 'react';
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

//importacion acciones
import {
    generarPropsTabla,
    formateado,
    removeArrayByIndex
} from 'app/logica/produccion/logicaProduccion';
import {
    setAnadirFilaIdCotizacion,
    selectAnadirFilaIdCotizacion,
    openNoteDialog,
    setDialogIndex,
    setRegistraIntervencionDialog,
    selectRegistraIntervencionDialog,
    selectActualizandoCotizacion
} from 'app/redux/produccion/cotizacionSlice';
import {
    calculosTablaCuerpo,
    actualizarTablaCuerpo
} from 'app/logica/produccion/logicaCotizacion';

function CuerpoCotizacion(props) {
    const { cotizacionCuerpo, cotizacionCabecera } = props;
    const dispatch = useDispatch();
    const componentRef = useRef(null);
    const anadirFilaIdCotizacion = useSelector(selectAnadirFilaIdCotizacion);
    const [tableColumns, setTableColumns] = useState(null);
    const [tableData, setTableData] = useState(null);
    const [changedData, setChangedData] = useState(false);
    const actualizandoCotizacion = useSelector(selectActualizandoCotizacion);
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
        if (actualizandoCotizacion.estado) {
            setTableData(null);
            generarDatos();
        };
    }, [actualizandoCotizacion]);

    useEffect(() => {
        if (anadirFilaIdCotizacion && anadirFilaIdCotizacion === "cuerpo") {
            const arrayDatos = [...tableData];
            let objetoDatos = {
                unidades: 0,
                largo: 0,
                ancho: 0,
                grueso: 0,
                medidas: "0 x 0 x 0",
                vol_unitario: 0,
                vol_total: 0,
                volumen: "Uni: 0 m³ - Tot: 0 m³",
                proveedor: "",
                precio_m3: 0,
                precio_total: 0,
                precio: "m³: 0 €/m³ - Tot: 0 €",
                filaMerma: [],
            };
            arrayDatos.push(objetoDatos);
            setTableData(arrayDatos);
            dispatch(setAnadirFilaIdCotizacion(null));
        };
    }, [anadirFilaIdCotizacion]);

    useEffect(() => {
        if (
            registraIntervencionDialog === "merma" ||
            registraIntervencionDialog === "proveedor" ||
            registraIntervencionDialog === "medidas"
        ) {
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
                        <div className='flex flex-row items-center'>
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
                header: 'Medidas',
                accessorKey: 'medidas',
                enableSorting: false,
                enableColumnFilter: false,
                enableEditing: false,
                muiTableBodyCellProps: ({ cell, table }) => ({
                    onClick: () => {
                        dispatch(openNoteDialog('medidas'));
                        dispatch(setDialogIndex(Number(cell.row.id)));
                    },
                    sx: {
                        '&:hover': {
                            backgroundColor: '#ebebeb'
                        },
                        backgroundColor: 'white',
                        cursor: 'pointer',
                        color: '#111827'
                    },
                }),
                Header: ({ column }) => (
                    <div className='flex flex-row items-center'>
                        <FuseSvgIcon className="mr-4" size={20}>material-outline:edit_note</FuseSvgIcon>
                        <div className='flex flex-row items-center'>
                            {column.columnDef.header}
                        </div>
                    </div>
                ),
                Cell: ({ cell }) => {
                    return (
                        <Typography
                            variant="body1"
                            className="whitespace-nowrap"
                        >
                            {cell.getValue()}
                        </Typography>
                    )
                },
                size: 100,
            },
            {
                header: 'Volumen',
                accessorKey: 'volumen',
                enableSorting: false,
                enableColumnFilter: false,
                enableEditing: false,
                Header: ({ column }) => (
                    <div className='flex flex-row items-center'>
                        <div className='flex flex-row items-center'>
                            {column.columnDef.header}
                        </div>
                    </div>
                ),
                Cell: ({ cell, row }) => (
                    <Typography
                        variant="body1"
                        className="whitespace-nowrap"
                    >
                        {cell.getValue()}
                    </Typography>
                ),
                size: 125,
                Footer: ({ table }) => retornaTotales(table, 'volumen'),
            },
            {
                header: 'Precio',
                accessorKey: 'precio',
                enableSorting: false,
                enableColumnFilter: false,
                enableEditing: false,
                muiTableBodyCellProps: ({ cell, table }) => ({
                    onClick: () => {
                        dispatch(openNoteDialog('proveedores'));
                        dispatch(setDialogIndex(Number(cell.row.id)));
                    },
                    sx: {
                        '&:hover': {
                            backgroundColor: '#ebebeb'
                        },
                        backgroundColor: 'white',
                        cursor: 'pointer',
                        color: '#111827'
                    },
                }),
                Header: ({ column }) => (
                    <div className='flex flex-row items-center'>
                        <div className='flex flex-row items-center'>
                            {column.columnDef.header}
                        </div>
                    </div>
                ),
                Cell: ({ cell, row }) => (
                    <Typography
                        variant="body1"
                        className="whitespace-nowrap"
                    >
                        {cell.getValue()}
                    </Typography>
                ),
                size: 100,
                Footer: ({ table }) => retornaTotales(table, 'precio_total'),
            },
            {
                header: 'Merma',
                accessorKey: 'filaMerma',
                enableSorting: false,
                enableColumnFilter: false,
                enableEditing: false,
                muiTableBodyCellProps: ({ cell, table }) => ({
                    onClick: () => {
                        dispatch(openNoteDialog('mermaCuerpo'));
                        dispatch(setDialogIndex(Number(cell.row.id)));
                    },
                    sx: {
                        '&:hover': {
                            backgroundColor: '#ebebeb'
                        },
                        backgroundColor: 'white',
                        cursor: 'pointer',
                        color: '#111827'
                    },
                }),
                Header: ({ column }) => (
                    <div className='flex flex-row items-center'>
                        <FuseSvgIcon className="mr-4" size={20}>material-outline:edit_note</FuseSvgIcon>
                        <div className='flex flex-row items-center'>
                            {column.columnDef.header}
                        </div>
                    </div>
                ),
                Cell: ({ cell }) => {
                    let valorCeldaParsed = 0;
                    const valorCelda = cell.getValue();
                    valorCelda.length > 0 && (valorCeldaParsed = valorCelda[0].vol_merma);
                    return (
                        <Typography
                            variant="body1"
                            color={cell.getValue() < 0 && "error"}
                            className="whitespace-nowrap"
                        >
                            {formateado(valorCeldaParsed) + " m³"}
                        </Typography>
                    )
                },
                size: 50,
                Footer: ({ table }) => retornaTotales(table, 'filaMerma'),
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
            case 'volumen':
                if (table.options.data[0].precio_total > 0 && table.options.data[0].vol_total > 0) {
                    const sumatorioTotales2 = table.options.data.reduce((sum, { vol_total }) => sum + vol_total, 0);
                    return (
                        <Typography
                            variant="body1"
                            color={sumatorioTotales2 < 0 && "error"}
                        >
                            <span className="font-bold whitespace-nowrap">
                                {`Tot: ${formateado(sumatorioTotales2)} m³`}
                            </span>
                        </Typography>
                    )
                };
                break;
            case 'precio_total':
                if (table.options.data[0].precio_total > 0) {
                    const sumatorioTotales3 = table.options.data.reduce((sum, { precio_total }) => sum + precio_total, 0);
                    return (
                        <Typography
                            variant="body1"
                            color={sumatorioTotales3 < 0 && "error"}
                        >
                            <span className="font-bold whitespace-nowrap">
                                {`Tot: ${formateado(sumatorioTotales3)} €`}
                            </span>
                        </Typography>
                    )
                };
                break;
            case 'filaMerma':
                if (table.options.data[0].precio_total > 0 && table.options.data[0].filaMerma.length > 0) {
                    let sumatorioTotales4 = 0;
                    table.options.data.map((fila) => { fila.filaMerma.length > 0 && (sumatorioTotales4 += fila.filaMerma[0].vol_merma) });
                    return (
                        <Typography
                            variant="body1"
                            color={sumatorioTotales4 < 0 && "error"}
                        >
                            <span className="font-bold whitespace-nowrap">
                                {`Tot: ${formateado(sumatorioTotales4)} m³`}
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
        if (actualizandoCotizacion.estado) {
            cotizacionCuerpo.filasCuerpo.forEach((fila) => {
                objetoDatos = {
                    unidades: fila.unidades,
                    largo: fila.largo,
                    ancho: fila.ancho,
                    grueso: fila.grueso,
                    medidas: `${formateado(fila.largo)} x ${formateado(fila.ancho)} x ${formateado(fila.grueso)}`,
                    vol_unitario: fila.vol_unitario,
                    vol_total: fila.vol_total,
                    volumen: `Uni: ${formateado(fila.vol_unitario)} m³ - Tot: ${formateado(fila.vol_total)} m³`,
                    proveedor: fila.proveedor,
                    precio_m3: fila.precio_m3,
                    precio_total: fila.precio_total,
                    precio: `m³: ${formateado(fila.precio_m3)} €/m³ - Tot: ${formateado(fila.precio_total)} €`,
                    filaMerma: fila.filaMerma,
                };
                arrayDatos.push(objetoDatos);
            });
        } else {
            objetoDatos = {
                unidades: 0,
                largo: 0,
                ancho: 0,
                grueso: 0,
                medidas: "0 x 0 x 0",
                vol_unitario: 0,
                vol_total: 0,
                volumen: "Uni: 0 m³ - Tot: 0 m³",
                proveedor: "",
                precio_m3: 0,
                precio_total: 0,
                precio: "m³: 0 €/m³ - Tot: 0 €",
                filaMerma: [],
            };
            arrayDatos.push(objetoDatos);
        };
        setTableData(arrayDatos);
    };

    const calculosTabla = (tabla, indice, update) => {
        const arrayTabla = dispatch(calculosTablaCuerpo(tabla));
        setTableData(arrayTabla);
        if (update) {
            dispatch(actualizarTablaCuerpo(arrayTabla));
        };
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
        actualizarTabla(myArray);
    };

    const retornaDisplay = () => {
        if (actualizandoCotizacion.objeto) {
            return ""
        } else {
            if (cotizacionCabecera && cotizacionCabecera.cliente && cotizacionCabecera.of && cotizacionCabecera.unidades > 0) {
                return ""
            } else {
                return "none"
            };
        };
    };

    const retornaExtendedPanel = (row) => {
        const [largo, ancho, grueso] = row.original.medidas.split(' x');
        let proveedor, precio_m3, unidades, largoMerma, anchoMerma, gruesoMerma, mat_prima, vol_merma, precio_merma;
        let hayMerma = false;
        if (row.original.proveedor) {
            proveedor = row.original.proveedor;
            precio_m3 = row.original.precio_m3;
        } else {
            proveedor = "No seleccionado";
            precio_m3 = 0;
        };
        if (row.original.filaMerma.length > 0) {
            hayMerma = true;
            unidades = row.original.filaMerma[0].unidades;
            largoMerma = row.original.filaMerma[0].largo;
            anchoMerma = row.original.ancho;
            gruesoMerma = row.original.grueso;
            mat_prima = row.original.filaMerma[0].mat_prima;
            vol_merma = row.original.filaMerma[0].vol_merma;
            precio_merma = row.original.filaMerma[0].precio_merma;
        };
        return (
            <>
                <Typography className="text-sm"><span className="font-semibold">Medidas:</span> Largo: {largo}, Ancho: {ancho}, Grueso: {grueso}.</Typography>
                <Typography className="text-sm"><span className="font-semibold">Proveedor:</span> {proveedor}, Precio m³: {precio_m3} €/m³.</Typography>
                {hayMerma ? (
                    <Typography className="text-sm"><span className="font-semibold">Merma:</span> Unidades: {unidades}, Largo: {largoMerma}, Ancho: {anchoMerma}, Grueso: {gruesoMerma}, Volumen materia prima merma: <span color={mat_prima < 0 ? "error" : "#111827"}>{mat_prima}</span> m³, Volumen merma: <span color={vol_merma < 0 ? "error" : "#111827"}>{vol_merma}</span> m³, Precio merma: <span color={precio_merma < 0 ? "error" : "#111827"}>{precio_merma}</span> €.</Typography>
                ) : (
                    <Typography className="text-sm"><span className="font-semibold">Merma:</span> -</Typography>
                )}
            </>
        )
    };

    if (!tableData) {
        return null
    };

    return (
        <TableContainer
            ref={componentRef}
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
                        display: retornaDisplay(),
                    }
                }}
                enableRowActions={true}
                positionActionsColumn="last"
                renderRowActions={({ row, table }) => (
                    <Box className="py-0 pr-8 pl-0 m-0">
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
                muiTableBodyProps={{
                    sx: {
                        '&::after': {
                            content: '"Totales"',
                            width: '100%',
                            borderTop: '1px solid #e2e8f0',
                            position: 'absolute',
                            paddingLeft: '24px',
                            paddingTop: '8px',
                            fontSize: '12px',
                            fontWeight: 'bold'
                        },
                    }
                }}
                renderDetailPanel={({ row }) => (
                    <Box
                        sx={{
                            padding: '0px 8px 8px 8px',
                            width: '100%',
                        }}
                    >
                        {retornaExtendedPanel(row)}
                    </Box>
                )}
                positionExpandColumn="first"
            />
        </TableContainer>
    );
}

export default CuerpoCotizacion;