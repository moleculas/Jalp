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
    selectActualizandoCotizacion,
    selectObjetoCotizacionCuerpo
} from 'app/redux/produccion/cotizacionSlice';
import {
    getProductos,
    setProductos,
    getProductosPayload
} from 'app/redux/produccion/productoSlice';
import {
    calculosTablaProveedores,
    actualizarTablaProveedores
} from 'app/logica/produccion/logicaCotizacion';
import { showMessage } from 'app/redux/fuse/messageSlice';

function ProveedoresCuerpoCotDialog(props) {
    const { index } = props;
    const dispatch = useDispatch();
    const [tableColumns, setTableColumns] = useState(null);
    const [tableData, setTableData] = useState(null);
    const actualizandoCotizacion = useSelector(selectActualizandoCotizacion);
    const cotizacionCuerpo = useSelector(selectObjetoCotizacionCuerpo);

    //useEffect  

    useEffect(() => {
        dispatch(setProductos(null));
        dispatch(getProductos({ familia: 'proveedores', min: true })).then(({ payload }) => {
            const prooveedoresPayload = payload;
            dispatch(getProductosPayload({ familia: 'maderas', min: true })).then(({ payload }) => {
                const maderasPayload = payload;
                generarColumnas(prooveedoresPayload, maderasPayload);
            });
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

    //funciones

    const generarColumnas = (proveedores, maderas) => {
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
                                const largo = cotizacionCuerpo.filasCuerpo[index].largo;
                                const ancho = cotizacionCuerpo.filasCuerpo[index].ancho;
                                const grueso = cotizacionCuerpo.filasCuerpo[index].grueso;
                                const indice = maderas.findIndex(madera => (
                                    madera.proveedor.includes(event.target.dataset.value) &&
                                    madera.largo === largo &&
                                    madera.ancho === ancho &&
                                    madera.grueso === grueso
                                ));
                                if (indice >= 0) {
                                    precio_m3 = maderas[indice].precioUnitario;                             
                                    handleChangeSelectProveedor(table, event.target.dataset.value, precio_m3);
                                } else {
                                    dispatch(showMessage({ message: "El formato de madera no está registrado para el proveedor seleccionado.", variant: "error", autoHideDuration: 6000 }));
                                };
                            } else {
                                handleChangeSelectProveedor(table, event.target.dataset.value, precio_m3);
                            };
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
                                <MenuItem key={option._id} value={option._id}>
                                    {_.capitalize(option.codigo)}
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
        if (cotizacionCuerpo) {
            let arrayFilas = cotizacionCuerpo.filasCuerpo;
            objetoDatos = {
                proveedor: arrayFilas[index]?.proveedor ? arrayFilas[index].proveedor : "",
                precio_m3: arrayFilas[index]?.precio_m3 ? arrayFilas[index].precio_m3 : 0
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
