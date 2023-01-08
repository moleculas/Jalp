import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import _ from '@lodash';
import MaterialReactTable from 'material-react-table';
import Typography from '@mui/material/Typography';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import clsx from 'clsx';

//importacion acciones
import {
    generarPropsTabla,
    formateado
} from 'app/logica/produccion/logicaProduccion';
import {
    selectActualizandoCotizacion,
    selectObjetoCotizacionLateralSup,
    selectObjetoCotizacionCuerpo
} from 'app/redux/produccion/cotizacionSlice';
import {
    getProductos,
    setProductos
} from 'app/redux/produccion/productoSlice';
import {
    calculosTablaCorteMadera,
    actualizarTablaCorteMadera
} from 'app/logica/produccion/logicaCotizacion';

function CorteMaderaCotDialog(props) {
    const { } = props;
    const dispatch = useDispatch();
    const [tableColumns, setTableColumns] = useState(null);
    const [tableData, setTableData] = useState(null);
    const [changedData, setChangedData] = useState(false);
    const actualizandoCotizacion = useSelector(selectActualizandoCotizacion);
    const cotizacionLateralSup = useSelector(selectObjetoCotizacionLateralSup);
    const cotizacionCuerpo = useSelector(selectObjetoCotizacionCuerpo);
    const [updateState, setUpdateState] = useState({ estado: false, objeto: null });
    const conceptoCosteHoraTrabajador = "corteMadera";
    const [cantidadPrecioHora, setCantidadPrecioHora] = useState(null);

    //useEffect  

    useEffect(() => {
        dispatch(setProductos(null));
        dispatch(getProductos({ familia: 'costesHoraTrabajador', min: true })).then(({ payload }) => {
            const objetoCosteHoraTrabajador = payload.filter(objeto => objeto.categoria.includes(conceptoCosteHoraTrabajador));
            setCantidadPrecioHora(objetoCosteHoraTrabajador[0].precioUnitario);
            let piezasCorte = cotizacionCuerpo.merma.filasMerma;            
            generarColumnas(piezasCorte);
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
                dispatch(actualizarTablaCorteMadera(updateState.objeto));
                setUpdateState({ estado: false, objeto: null });
            }, 50);
            return () => clearTimeout(delayDebounceFn)
        };
    }, [updateState]);

    //funciones

    const generarColumnas = (piezasCorte) => {
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
                        {formateado(cell.getValue()) + " piezas/hora"}
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
                Cell: ({ cell, row }) => {
                    let valorCelda = 0;
                    piezasCorte > 0 && (valorCelda = formateado(cell.getValue()));
                    return (
                        <Typography
                            variant="body1"
                            className="whitespace-nowrap"
                        >
                            <span>{valorCelda + " € * "}</span>
                            <span className={clsx(piezasCorte < 1 && 'text-[#f44336]')}>{piezasCorte + " piezas/corte"}</span>
                        </Typography>
                    )
                },
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
        let arrayFilas = cotizacionLateralSup.filaCorteMadera;
        if (arrayFilas?.length > 0) {
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
        setTableData(arrayDatos);
    };

    const calculosTabla = (tabla, update, row) => {
        const objetoCorteMadera = {
            operarios: Number(tabla[0].operarios),
            productividad: Number(tabla[0].productividad),
            cantidadPrecioHora: tabla[0].cantidadPrecioHora
        };
        const arrayTabla = dispatch(calculosTablaCorteMadera(objetoCorteMadera));
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
                        `Cálculo Corte Madera cotización`,
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

export default CorteMaderaCotDialog;
