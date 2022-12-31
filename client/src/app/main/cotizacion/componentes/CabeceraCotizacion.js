import Paper from '@mui/material/Paper';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import _ from '@lodash';
import MaterialReactTable from 'material-react-table';
import TableContainer from '@mui/material/TableContainer';
import Typography from '@mui/material/Typography';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import format from 'date-fns/format';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Box from '@mui/system/Box';
import TextField from '@mui/material/TextField';

//importacion acciones
import { generarPropsTabla } from 'app/logica/produccion/logicaProduccion';
import {
    setAnadirFilaIdCotizacion,
    getOf,
    selectObjetoCotizacionActualizado,
} from 'app/redux/produccion/cotizacionSlice';
import { showMessage } from 'app/redux/fuse/messageSlice';
import {
    getProductos,
    setProductos
} from 'app/redux/produccion/productoSlice';
import {
    calculosTablaCabecera,
    actualizarTablaCabecera
} from 'app/logica/produccion/logicaCotizacion';

function CabeceraCotizacion(props) {
    const { cotizacionCabecera } = props;
    const dispatch = useDispatch();
    const [tableData, setTableData] = useState(null);
    const [tableColumns, setTableColumns] = useState(null);
    const [changedData, setChangedData] = useState(false);
    const cotizacionActualizado = useSelector(selectObjetoCotizacionActualizado);
    const [descripcion, setDescripcion] = useState("");

    //useEffect  

    useEffect(() => {
        dispatch(setProductos(null));
        dispatch(getProductos({ familia: 'clientes', min: true })).then(({ payload }) => {
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
        setTableData(null);
        generarDatos();
    }, [cotizacionActualizado]);

    //funciones

    const generarColumnas = (clientes) => {
        const arrayColumnas = [
            {
                header: 'Fecha',
                accessorKey: 'fecha',
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
                muiTableBodyCellProps: {
                    sx: {
                        paddingLeft: '24px',
                        backgroundColor: 'white',
                        cursor: 'default'
                    },
                },
                Cell: ({ cell, row }) => (
                    <Typography
                        variant="body1"
                    >
                        {format(new Date(cell.getValue()), 'dd/MM/yyyy')}
                    </Typography>
                ),
            },
            {
                header: 'Cliente',
                accessorKey: 'cliente',
                enableSorting: false,
                enableColumnFilter: false,
                enableEditing: false,
                muiTableBodyCellProps: ({ cell, table }) => ({
                    onBlurCapture: (event) => {
                        if (event.target.dataset.value !== undefined) {
                            handleChangeSelectCliente(table, event.target.dataset.value);
                        };
                    },
                }),
                Cell: ({ cell }) => (
                    <FormControl variant="standard" className="-my-12" sx={{ minWidth: 150 }}>
                        <Select
                            value={cell.getValue()}
                        >
                            <MenuItem value="">
                                <em>Cliente</em>
                            </MenuItem>
                            {clientes.map((option) => (
                                <MenuItem key={option.descripcion} value={option.descripcion}>
                                    {_.capitalize(option.descripcion)}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                ),
            },
            {
                header: 'OF',
                accessorKey: 'of',
                enableSorting: false,
                enableColumnFilter: false,
                enableEditing: true,
                muiTableBodyCellEditTextFieldProps: {
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
                        {cell.getValue()}
                    </Typography>
                ),
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
                        {cell.getValue()}
                    </Typography>
                ),
            },
            {
                header: '',
                accessorKey: 'anadir_fila',
                enableSorting: false,
                enableColumnFilter: false,
                enableEditing: false,
                Cell: () => (
                    <div className="flex justify-end">
                        <Button
                            onClick={() => dispatch(setAnadirFilaIdCotizacion('cuerpo'))}
                            color="primary"
                            variant="outlained"
                            startIcon={<FuseSvgIcon size={20}>heroicons-outline:plus-circle</FuseSvgIcon>}
                            size="small"
                            sx={{
                                paddingX: 2
                            }}
                            className="-my-12"
                        >
                            Añadir fila
                        </Button>
                    </div>
                ),
            }
        ];
        setTableColumns(arrayColumnas);
    };

    const generarDatos = () => {
        const arrayDatos = [];
        let objetoDatos;
        if (cotizacionActualizado) {
            objetoDatos = {
                descripcion: cotizacionActualizado.descripcion,
                fecha: cotizacionActualizado.fecha,
                cliente: cotizacionActualizado.cliente,
                of: cotizacionActualizado.of,
                unidades: cotizacionActualizado.unidades
            };
            setDescripcion(cotizacionActualizado.descripcion);
        } else {
            objetoDatos = {
                descripcion,
                fecha: new Date(),
                cliente: "",
                of: "",
                unidades: 0
            };
        };
        arrayDatos.push(objetoDatos);
        setTableData(arrayDatos);
    };

    const calculosTabla = (tabla, update) => {
        const objetoCabecera = {
            ...tabla[0],
            of: tabla[0].of,
            unidades: Number(tabla[0].unidades)
        };
        const arrayTabla = dispatch(calculosTablaCabecera(objetoCabecera));
        setTableData(arrayTabla);
        if (update) {
            dispatch(actualizarTablaCabecera(arrayTabla, descripcion));
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
        calculosTabla(tabla, false);
    };

    const handleExitCell = (cell) => {
        const tabla = [...tableData];
        if (changedData) {
            if (cell.id === "0_of" && tabla[0].of) {
                dispatch(getOf(tabla[0].of)).then(({ payload }) => {
                    if (payload.respuesta) {
                        dispatch(showMessage({ message: "Ya hay una OF registrada con ese número.", variant: "error" }));
                        tabla[0].of = '';
                    };
                    calculosTabla(tabla, true);
                    setChangedData(false);
                });
            } else {
                calculosTabla(tabla, true);
                setChangedData(false);
            };
        } else {
            if (!cell.getValue() && cell.id === "0_unidades") {
                const columna = cell.column.id;
                tabla[0][columna] = 0;
                setTableData(tabla);
            };
        };
    };

    const handleChangeSelectCliente = (table, cliente) => {
        const arrayTabla = [...table.options.data];
        arrayTabla[0].cliente = cliente;
        calculosTabla(arrayTabla, true);
    };

    const handleChangeDescripcion = (e) => {
        setDescripcion(e.target.value);
    };

    const clickCelda = (cell, table) => {
        if (cell.getValue() === 0) {
            const tabla = [...table.options.data];
            const columna = cell.column.id;
            tabla[0][columna] = "";
            setTableData(tabla);
        };
        table.setEditingCell(cell);
    };

    const retornaDisplay = () => {
        if (cotizacionActualizado) {
            return ""
        } else {
            if (tableData[0].cliente && tableData[0].of && tableData[0].unidades > 0) {
                return ""
            } else {
                return "none"
            };
        };
    };

    if (!tableData && !tableColumns) {
        return null
    };

    return (
        (tableColumns && tableData) && (
            <TableContainer
                component={Paper}
                className="relative flex flex-col flex-auto w-full overflow-hidden"
                style={{
                    borderTopLeftRadius: '16px',
                    borderTopRightRadius: '16px',
                    borderBottomLeftRadius: '0px',
                    borderBottomRightRadius: '0px'
                }}
            >
                <Box className="flex flex-row items-center w-full pb-12 pt-8 px-24 gap-24">
                    <Typography className="text-[15px] font-bold">
                        Descripción
                    </Typography>
                    <TextField
                        type="text"
                        variant="standard"
                        fullWidth
                        value={descripcion}
                        onChange={handleChangeDescripcion}
                    />
                </Box>
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
                    columns={tableColumns}
                    data={tableData}
                    enableTopToolbar={false}
                    muiTableBodyCellProps={({ cell }) => ({
                        onChange: (event) => {
                            handleChangeCell(cell, event);
                        },
                        onBlur: () => {
                            if (cell.id !== "0_cliente") {
                                handleExitCell(cell);
                            };
                        },
                        sx: {
                            backgroundColor: 'white',
                            cursor: 'default',
                            display: cell.id === "0_anadir_fila" && (retornaDisplay())
                        }
                    })}
                    muiBottomToolbarProps={{
                        sx: {
                            backgroundColor: 'white',
                            minHeight: '10px',
                        }
                    }}
                />
            </TableContainer>
        )
    );
}

export default CabeceraCotizacion;
