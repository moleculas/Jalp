import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import _ from '@lodash';
import MaterialReactTable from 'material-react-table';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

//importacion acciones
import {
    generarPropsTabla,
    formateado
} from 'app/logica/produccion/logicaProduccion';
import {
    selectObjetoCotizacionActualizado,
    selectObjetoCotizacionLateralSup
} from 'app/redux/produccion/cotizacionSlice';
import {
    getProductos,
    setProductos
} from 'app/redux/produccion/productoSlice';
import {
    calculosTablaTransporte,
    actualizarTablaTransporte
} from 'app/logica/produccion/logicaCotizacion';

function TransporteCotDialog(props) {
    const { } = props;
    const dispatch = useDispatch();
    const [tableColumns, setTableColumns] = useState(null);
    const [tableData, setTableData] = useState(null);
    const [changedData, setChangedData] = useState(false);
    const cotizacionActualizado = useSelector(selectObjetoCotizacionActualizado);
    const cotizacionLateralSup = useSelector(selectObjetoCotizacionLateralSup);

    //useEffect  

    useEffect(() => {
        dispatch(setProductos(null));
        dispatch(getProductos({ familia: 'transportes', min: true })).then(({ payload }) => {
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

    const generarColumnas = (transportes) => {
        const arrayColumnas = [
            {
                header: 'Transporte',
                accessorKey: 'transporte',
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
                            handleChangeSelectTransportes(table, event.target.dataset.value, transportes);
                        };
                    },
                    sx: {
                        paddingLeft: '24px',
                        backgroundColor: 'white',
                    },
                }),
                Cell: ({ cell }) => (
                    <FormControl variant="standard" className="-my-12" sx={{ minWidth: 375 }}>
                        <Select
                            value={cell.getValue()}
                            fullWidth
                        >
                            <MenuItem value="">
                                <em>Transporte</em>
                            </MenuItem>
                            {transportes.map((option, index) => (
                                <MenuItem key={option._id} value={option._id}>
                                    {retornaOpcionSelect(option._id, transportes)}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                ),
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
                size: 50
            },
        ];
        setTableColumns(arrayColumnas);
    };

    const generarDatos = () => {
        const arrayDatos = [];
        let objetoDatos, arrayFilas;
        if (cotizacionActualizado) {
            if (cotizacionLateralSup) {
                arrayFilas = cotizacionLateralSup.filaTransporte;
            } else {
                arrayFilas = cotizacionActualizado.filaTransporte;
            };
        } else {
            arrayFilas = cotizacionLateralSup.filaTransporte;
        };
        if (arrayFilas && arrayFilas.length > 0) {
            arrayFilas.forEach((fila) => {
                objetoDatos = {
                    transporte: fila.transporte,
                    precio_total: fila.precio_total,
                };
                arrayDatos.push(objetoDatos);
            });
        } else {
            objetoDatos = {
                transporte: "",
                precio_total: 0,
            };
            arrayDatos.push(objetoDatos);
        };
        setTableData(arrayDatos);
    };

    const calculosTabla = (tabla, update, transportes) => {
        let arrayTabla;
        if (tabla[0].transporte) {
            const unidadesVehiculo = transportes[transportes.findIndex(item => item._id === tabla[0].transporte)].especialTransportes.unidadesVehiculo;
            const precioUnitario = transportes[transportes.findIndex(item => item._id === tabla[0].transporte)].precioUnitario;
            const objetoTransporte = {
                transporte: tabla[0].transporte,
                unidadesVehiculo,
                precioUnitario
            };
            arrayTabla = dispatch(calculosTablaTransporte(objetoTransporte));
        } else {
            arrayTabla = [{
                transporte: "",
                precio_total: 0,
            }];
        };
        setTableData(arrayTabla);
        dispatch(actualizarTablaTransporte(arrayTabla));
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

    const handleChangeSelectTransportes = (table, transporte, transportes) => {
        const arrayTabla = [...table.options.data];
        arrayTabla[0].transporte = transporte;
        calculosTabla(arrayTabla, true, transportes);
    };

    const retornaOpcionSelect = (id, transportes) => {
        const objetoTransporte = transportes[transportes.findIndex(item => item._id === id)];
        let vehiculo;
        switch (objetoTransporte.especialTransportes.vehiculo) {
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
        return objetoTransporte.especialTransportes.destino + " - " + vehiculo + ": " + objetoTransporte.especialTransportes.unidadesVehiculo + " uds."
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
                        `Cálculo Transporte cotización`,
                        '',
                        null,
                        null,
                        false
                    ))}
                    columns={tableColumns}
                    data={tableData}
                    muiTableBodyCellProps={({ cell }) => ({
                        onChange: (event) => {
                            handleChangeCell(cell, event);
                        },
                        onBlur: () => {
                            if (cell.column.id !== "transporte") {
                                handleExitCell(cell);
                            };
                        },
                        sx: {
                            backgroundColor: 'white',
                            cursor: 'default'
                        },

                    })}
                    muiTablePaperProps={{
                        elevation: 0,
                        sx: {
                            height: 200,
                            overflow: 'hidden'
                        },
                    }}
                />
            </>
        )
    );
}

export default TransporteCotDialog;
