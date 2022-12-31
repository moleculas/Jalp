import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import _ from '@lodash';
import MaterialReactTable from 'material-react-table';
import Typography from '@mui/material/Typography';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

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
    calculosTablaMontaje,
    actualizarTablaMontaje
} from 'app/logica/produccion/logicaCotizacion';

function MontajeCotDialog(props) {
    const { } = props;
    const dispatch = useDispatch();
    const [tableColumns, setTableColumns] = useState(null);
    const [tableData, setTableData] = useState(null);
    const [changedData, setChangedData] = useState(false);
    const cotizacionActualizado = useSelector(selectObjetoCotizacionActualizado);
    const cotizacionLateralSup = useSelector(selectObjetoCotizacionLateralSup);
    const [updateState, setUpdateState] = useState({ estado: false, objeto: null });
    const conceptoCosteHoraTrabajador = "montaje";
    const [cantidadPrecioHora, setCantidadPrecioHora] = useState(null);

    //useEffect  

    useEffect(() => {
        dispatch(setProductos(null));
        dispatch(getProductos({ familia: 'costesHoraTrabajador', min: true })).then(({ payload }) => {
            const objetoCosteHoraTrabajador = payload.filter(objeto => objeto.categoria.includes(conceptoCosteHoraTrabajador));
            setCantidadPrecioHora(objetoCosteHoraTrabajador[0].precioUnitario);
            generarColumnas();
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

    useEffect(() => {
        if (updateState.estado) {
            const delayDebounceFn = setTimeout(() => {
                dispatch(actualizarTablaMontaje(updateState.objeto));
                setUpdateState({ estado: false, objeto: null });
            }, 50);
            return () => clearTimeout(delayDebounceFn)
        };
    }, [updateState]);

    //funciones

    const generarColumnas = () => {
        const arrayColumnas = [
            {
                header: 'Coste precio/hora',
                accessorKey: 'cantidadPrecioHora',
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
                        color={cell.getValue() < 0 && "error"}
                        className="whitespace-nowrap"
                    >
                        {formateado(cell.getValue()) + " €"}
                    </Typography>
                ),
                size: 50,
            },
            {
                header: 'Nº operarios',
                accessorKey: 'operarios',
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
                header: 'Productividad',
                accessorKey: 'productividad',
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
                        {formateado(cell.getValue()) + " palets/hora"}
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
                size: 50
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

    const generarDatos = () => {
        const arrayDatos = [];
        let objetoDatos;
        if (cotizacionActualizado || cotizacionLateralSup) {
            let arrayFilas;
            if (cotizacionActualizado && !cotizacionLateralSup) {
                arrayFilas = cotizacionActualizado.filaMontaje;
            } else {
                arrayFilas = cotizacionLateralSup.filaMontaje;
            };
            if (arrayFilas && arrayFilas.length > 0) {
                arrayFilas.forEach((fila) => {
                    objetoDatos = {
                        cantidadPrecioHora: fila.cantidadPrecioHora,
                        operarios: fila.operarios ? fila.operarios : 0,
                        productividad: fila.productividad ? fila.productividad : 0,
                        precio_total: fila.precio_total,
                    };
                    arrayDatos.push(objetoDatos);
                });
            } else {
                objetoDatos = {
                    cantidadPrecioHora,
                    operarios: 0,
                    productividad: 0,
                    precio_total: 0,
                };
                arrayDatos.push(objetoDatos);
            };
        };
        setTableData(arrayDatos);
    };

    const calculosTabla = (tabla, update, row) => {
        const objetoMontaje = {
            operarios: Number(tabla[0].operarios),
            productividad: Number(tabla[0].productividad),
            cantidadPrecioHora: tabla[0].cantidadPrecioHora
        };
        const arrayTabla = dispatch(calculosTablaMontaje(objetoMontaje));
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
                        `Cálculo Montaje cotización`,
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
                            handleExitCell(cell);
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
            </>
        )
    );
}

export default MontajeCotDialog;
