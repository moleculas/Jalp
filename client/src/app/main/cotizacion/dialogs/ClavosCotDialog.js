import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import _ from '@lodash';
import MaterialReactTable from 'material-react-table';
import Typography from '@mui/material/Typography';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
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
    selectActualizandoCotizacion,
    selectObjetoCotizacionLateralSup,
} from 'app/redux/produccion/cotizacionSlice';
import {
    getProductos,
    setProductos
} from 'app/redux/produccion/productoSlice';
import {
    calculosTablaClavos,
    actualizarTablaClavos
} from 'app/logica/produccion/logicaCotizacion';

function ClavosCotDialog(props) {
    const { } = props;
    const dispatch = useDispatch();
    const [tableColumns, setTableColumns] = useState(null);
    const [tableData, setTableData] = useState(null);
    const [changedData, setChangedData] = useState(false);
    const anadirFilaIdCotizacion = useSelector(selectAnadirFilaIdCotizacion);
    const actualizandoCotizacion = useSelector(selectActualizandoCotizacion);
    const cotizacionLateralSup = useSelector(selectObjetoCotizacionLateralSup);
    const [updateState, setUpdateState] = useState({ estado: false, objeto: null });

    //useEffect  

    useEffect(() => {
        dispatch(setProductos(null));
        dispatch(getProductos({ familia: 'clavos', min: true })).then(({ payload }) => {
            generarColumnas(payload);
        });
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
        if (updateState.estado) {
            const delayDebounceFn = setTimeout(() => {
                dispatch(actualizarTablaClavos(updateState.objeto));
                setUpdateState({ estado: false, objeto: null });
            }, 50);
            return () => clearTimeout(delayDebounceFn)
        };
    }, [updateState]);

    useEffect(() => {
        if (anadirFilaIdCotizacion && anadirFilaIdCotizacion === "clavos") {
            const arrayDatos = [...tableData];
            let objetoDatos = {
                clavo: "",
                precio_unitario: 0,
                unidades: 0,
                precio_total: 0
            };
            arrayDatos.push(objetoDatos);
            setTableData(arrayDatos);
            dispatch(setAnadirFilaIdCotizacion(null));
        };
    }, [anadirFilaIdCotizacion]);

    //funciones

    const generarColumnas = (clavos) => {
        const arrayColumnas = [
            {
                header: 'Clavo',
                accessorKey: 'clavo',
                enableSorting: false,
                enableColumnFilter: false,
                enableEditing: false,
                muiTableHeadCellProps: {
                    sx: {
                        paddingLeft: '24px',
                        fontSize: '1.5rem',
                        fontWeight: 700,
                    },
                },
                muiTableBodyCellProps: ({ cell, table }) => ({
                    onBlurCapture: (event) => {
                        if (event.target.dataset.value !== undefined) {
                            handleChangeSelectClavos(table, event.target.dataset.value, Number(cell.row.id), clavos);
                        };
                    },
                    sx: {
                        paddingLeft: '24px',
                        backgroundColor: 'white',
                    },
                }),
                Cell: ({ cell }) => (
                    <FormControl variant="standard" className="-my-12" sx={{ minWidth: 200 }}>
                        <Select
                            value={cell.getValue()}
                            fullWidth
                        >
                            <MenuItem value="">
                                <em>Clavos</em>
                            </MenuItem>
                            {clavos.map((option, index) => (
                                <MenuItem key={option.descripcion} value={option.descripcion}>
                                    {option.descripcion}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                ),
            },
            {
                header: 'Precio.U',
                accessorKey: 'precio_unitario',
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
            },
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
                            backgroundColor: '#e5e9ec',
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
                header: 'Precio.T',
                accessorKey: 'precio_total',
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
                Footer: ({ table }) => retornaTotales(table, 'precio_total'),
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
            case 'precio_total':
                if (table.options.data[0].precio_total > 0) {
                    const sumatorioTotales1 = table.options.data.reduce((sum, { precio_total }) => sum + precio_total, 0);
                    return (
                        <Typography variant="body1">
                            <span className="font-bold whitespace-nowrap">
                                {`${formateado(sumatorioTotales1)} €`}
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
        let arrayFilas = cotizacionLateralSup.filasClavos;
        if (arrayFilas?.length > 0) {
            arrayFilas.forEach((fila) => {
                objetoDatos = {
                    clavo: fila.clavo,
                    precio_unitario: fila.precio_unitario,
                    unidades: fila.unidades,
                    precio_total: fila.precio_total,
                };
                arrayDatos.push(objetoDatos);
            });
        } else {
            objetoDatos = {
                clavo: "",
                precio_unitario: 0,
                unidades: 0,
                precio_total: 0
            };
            arrayDatos.push(objetoDatos);
        };
        setTableData(arrayDatos);
    };

    const calculosTabla = (tabla, update, row) => {
        const arrayTabla = dispatch(calculosTablaClavos(tabla));
        setTableData(arrayTabla);
        setUpdateState({ estado: true, objeto: arrayTabla });
    };

    const handleChangeCell = (cell, event) => {
        setChangedData(true);
        const tabla = [...tableData];
        const rowIndex = Number(cell.row.id);
        const columna = cell.column.id;
        let valor = event.target.value;
        !valor && (valor = 0);
        tabla[rowIndex][columna] = valor;
        calculosTabla(tabla, null, rowIndex);
    };

    const handleExitCell = (cell) => {
        const tabla = [...tableData];
        const rowIndex = Number(cell.row.id);
        if (changedData) {
            calculosTabla(tabla, null, rowIndex);
            setChangedData(false);
        } else {
            if (!cell.getValue()) {
                const columna = cell.column.id;
                tabla[rowIndex][columna] = 0;
                setTableData(tabla);
            };
        };
    };

    const handleChangeSelectClavos = (table, clavo, row, clavos) => {
        const arrayTabla = [...table.options.data];
        arrayTabla[row].clavo = clavo;
        let precioUnitario = 0;
        if (clavo) {
            precioUnitario = clavos[clavos.findIndex(item => item.descripcion === clavo)].precioUnitario;
        };
        arrayTabla[row].precio_unitario = precioUnitario;
        calculosTabla(arrayTabla, true, row);
    };

    const borrarColumna = (id) => {
        const myArray = removeArrayByIndex(tableData, id);
        setTableData(myArray);
        dispatch(actualizarTablaClavos(myArray));
    };

    if (!tableData && !tableColumns) {
        return null
    };

    return (
        (tableColumns && tableData) && (
            <>
                <MaterialReactTable
                    {...dispatch(generarPropsTabla(
                        false,
                        false,
                        `Cálculo Clavos cotización`,
                        '',
                        null,
                        null,
                        { id: null, disabled: false, type: 'clavos' }
                    ))}
                    columns={tableColumns}
                    data={tableData}
                    muiTableBodyCellProps={({ cell }) => ({
                        onChange: (event) => {
                            handleChangeCell(cell, event);
                        },
                        onBlur: () => {
                            if (cell.column.id !== "clavo") {
                                handleExitCell(cell);
                            };
                        },
                        sx: {
                            backgroundColor: 'white',
                            cursor: 'default'
                        }
                    })}
                    muiTablePaperProps={{
                        elevation: 0,
                        sx: {
                            minHeight: 200,
                            overflowY: 'auto'
                        },
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
                />
            </>
        )
    );
}

export default ClavosCotDialog;
