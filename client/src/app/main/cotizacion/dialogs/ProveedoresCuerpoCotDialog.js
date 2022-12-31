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
    selectObjetoCotizacionCuerpo
} from 'app/redux/produccion/cotizacionSlice';
import {
    getProductos,
    setProductos
} from 'app/redux/produccion/productoSlice';
import {
    calculosTablaProveedores,
    actualizarTablaProveedores
} from 'app/logica/produccion/logicaCotizacion';

function ProveedoresCuerpoCotDialog(props) {
    const { index } = props;
    const dispatch = useDispatch();
    const [tableColumns, setTableColumns] = useState(null);
    const [tableData, setTableData] = useState(null);
    const cotizacionActualizado = useSelector(selectObjetoCotizacionActualizado);
    const cotizacionCuerpo = useSelector(selectObjetoCotizacionCuerpo);

    //useEffect  

    useEffect(() => {
        dispatch(setProductos(null));
        dispatch(getProductos({ familia: 'proveedores', min: true })).then(({ payload }) => {
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

    const generarColumnas = (proveedores) => {
        const arrayColumnas = [
            {
                header: 'Proveedor',
                accessorKey: 'proveedor',
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
                            let precio_m3 = 0;
                            if (event.target.dataset.value !== "") {
                                precio_m3 = proveedores[proveedores.findIndex(prov => prov.descripcion === event.target.dataset.value)].precioProductoProveedor;
                            };
                            handleChangeSelectProveedor(table, event.target.dataset.value, precio_m3);
                        };
                    },
                    sx: {
                        paddingLeft: '24px',
                        backgroundColor: 'white',
                    },
                }),
                Cell: ({ cell }) => (
                    <FormControl variant="standard" className="-my-12" sx={{ minWidth: 250 }}>
                        <Select
                            value={cell.getValue()}
                        >
                            <MenuItem value="">
                                <em>Proveedor</em>
                            </MenuItem>
                            {proveedores.map((option) => (
                                <MenuItem key={option.descripcion} value={option.descripcion}>
                                    {option.descripcion}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                ),
            },
            {
                header: 'Precio.m³',
                accessorKey: 'precio_m3',
                enableSorting: false,
                enableColumnFilter: false,
                enableEditing: false,
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
        ];
        setTableColumns(arrayColumnas);
    };

    const handleChangeSelectProveedor = (table, proveedor, precio_m3) => {
        const arrayTabla = [...table.options.data];
        arrayTabla[0].proveedor = proveedor;
        arrayTabla[0].precio_m3 = precio_m3;
        calculosTabla(arrayTabla, true);
    };

    const generarDatos = () => {
        const arrayDatos = [];
        let objetoDatos;
        if (cotizacionActualizado || cotizacionCuerpo) {
            let arrayFilas;
            if (cotizacionActualizado && !cotizacionCuerpo) {
                arrayFilas = cotizacionActualizado.filasCuerpo;
            } else {
                arrayFilas = cotizacionCuerpo.filasCuerpo;
            };
            objetoDatos = {
                proveedor: arrayFilas[index].proveedor ? arrayFilas[index].proveedor : "",
                precio_m3: arrayFilas[index].precio_m3 ? arrayFilas[index].precio_m3 : 0
            };
        } else {
            objetoDatos = {
                proveedor: "",
                precio_m3: 0
            };
        };
        arrayDatos.push(objetoDatos);
        setTableData(arrayDatos);
    };

    const calculosTabla = (tabla) => {
        const objetoProveedores = { ...tabla[0] };
        const arrayTabla = dispatch(calculosTablaProveedores(objetoProveedores));
        setTableData(arrayTabla);
        dispatch(actualizarTablaProveedores(arrayTabla, index));
    };

    const handleChangeCell = (cell, event) => {
        setChangedData(true);
        const tabla = [...tableData];
        const rowIndex = Number(cell.row.id);
        const columna = cell.column.id;
        let valor = event.target.value;
        !valor && (valor = 0);
        tabla[rowIndex][columna] = valor;
        calculosTabla(tabla);
    };

    if (!tableData && !tableColumns) {
        return null
    };

    return (
        (tableColumns && tableData) && (
            <MaterialReactTable
                {...dispatch(generarPropsTabla(false, false, `Selección proveedor cotización Fila ${index + 1}`, '', null, null, false))}
                columns={tableColumns}
                data={tableData}
                muiTableBodyCellProps={({ cell }) => ({
                    onChange: (event) => {
                        handleChangeCell(cell, event);
                    },
                    sx: {
                        backgroundColor: 'white',
                        cursor: 'default'
                    }
                })}
                muiTablePaperProps={{
                    elevation: 0,
                    sx: {
                        height: 200,
                        overflow: 'hidden'
                    },
                }}
            />
        )
    );
}

export default ProveedoresCuerpoCotDialog;
