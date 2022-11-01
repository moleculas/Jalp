import Paper from '@mui/material/Paper';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import _ from '@lodash';
import MaterialReactTable from 'material-react-table';
import TableContainer from '@mui/material/TableContainer';
import Typography from '@mui/material/Typography';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

//importacion acciones
import { generarPropsTabla } from 'app/logica/produccion/logicaProduccion';
import {
    setObjetoCotizacionLateralInf,
    selectObjetoCotizacionActualizado
} from 'app/redux/produccion/cotizacionSlice';

function LateralInfCotizacion(props) {
    const { cotizacionLateralInf, cotizacionLateralSup, cotizacionCabecera } = props;
    const dispatch = useDispatch();
    const [tableData1, setTableData1] = useState(null);
    const [changedData1, setChangedData1] = useState(false);
    const [tableData2, setTableData2] = useState(null);
    const [changedData2, setChangedData2] = useState(false);
    const cotizacionActualizado = useSelector(selectObjetoCotizacionActualizado);

    //useEffect  

    useEffect(() => {
        if (!tableData1 && !tableData2) {
            setTableData1(null);
            setTableData2(null);
            generarDatos();
        };
    }, [tableData1, tableData2]);

    useEffect(() => {
        if (cotizacionLateralSup && cotizacionCabecera) {
            calculosTabla(tableData1, tableData2, true);
        };
    }, [cotizacionLateralSup, cotizacionCabecera]);

    useEffect(() => {
        setTableData1(null);
        setTableData2(null);
        generarDatos();
    }, [cotizacionActualizado]);

    //funciones

    const generarDatos = () => {
        const arrayDatos1 = [];
        let arrayDatos2 = [];
        let objetoDatos1;
        if (cotizacionActualizado) {
            objetoDatos1 = {
                cu: cotizacionActualizado.cu,
                precio_venta: cotizacionActualizado.precio_venta,
                mc: cotizacionActualizado.mc,
                mc_porcentaje: cotizacionActualizado.mc_porcentaje
            };
            arrayDatos1.push(objetoDatos1);
            arrayDatos2 = [
                { concepto: 'Porcentaje deseado', unidades: cotizacionActualizado.porcentaje },
                { concepto: 'JALP (0 %)', unidades: cotizacionActualizado.jalp },
                { concepto: 'TOTAL', unidades: cotizacionActualizado.total },
                { concepto: 'PRECIO VENTA', unidades: cotizacionActualizado.precio_venta_total }
            ];
        } else {
            objetoDatos1 = {
                cu: 0,
                precio_venta: 139.76,
                mc: 0,
                mc_porcentaje: 0
            };
            arrayDatos1.push(objetoDatos1);
            arrayDatos2 = [
                { concepto: 'Porcentaje deseado', unidades: 15.4 },
                { concepto: 'JALP (0 %)', unidades: 0 },
                { concepto: 'TOTAL', unidades: 0 },
                { concepto: 'PRECIO VENTA', unidades: 0 }
            ];
        };
        setTableData1(arrayDatos1);
        setTableData2(arrayDatos2);
    };

    const calculosTabla = (tabla1, tabla2, update) => {
        const arrayTabla1 = [];
        const arrayTabla2 = [];
        let objetoFila1, objetoFila2;
        let sumLateralSup, unidades, precioVenta;
        if (cotizacionActualizado) {
            cotizacionLateralSup && cotizacionLateralSup.sumLateralSup ? sumLateralSup = cotizacionLateralSup.sumLateralSup : sumLateralSup = cotizacionActualizado.sumLateralSup;
            cotizacionCabecera && cotizacionCabecera.unidades ? unidades = cotizacionCabecera.unidades : unidades = cotizacionActualizado.unidades;
        } else {
            cotizacionLateralSup && cotizacionLateralSup.sumLateralSup ? sumLateralSup = cotizacionLateralSup.sumLateralSup : sumLateralSup = 0;
            cotizacionCabecera && cotizacionCabecera.unidades ? unidades = cotizacionCabecera.unidades : unidades = 0;
        };
        tabla1.map((fila, index) => {
            objetoFila1 = { ...fila };
            objetoFila1.cu = unidades > 0 ? _.round((sumLateralSup / unidades), 2) : 0;
            objetoFila1.precio_venta = Number(objetoFila1.precio_venta);
            objetoFila1.mc = sumLateralSup > 0 ? _.round((objetoFila1.precio_venta - objetoFila1.cu), 2) : 0;
            objetoFila1.mc_porcentaje = sumLateralSup > 0 ? _.round(((objetoFila1.mc / objetoFila1.precio_venta) * 100), 2) : 0;
            arrayTabla1.push(objetoFila1);
        });
        if (cotizacionActualizado) {
            cotizacionLateralSup && cotizacionLateralSup.sumLateralSup ? precioVenta = (sumLateralSup / (100 - arrayTabla1[0].mc_porcentaje)) * 100 : precioVenta = (cotizacionActualizado.sumLateralSup / (100 - arrayTabla1[0].mc_porcentaje)) * 100;
        } else {
            cotizacionLateralSup && cotizacionLateralSup.sumLateralSup ? precioVenta = (sumLateralSup / (100 - arrayTabla1[0].mc_porcentaje)) * 100 : precioVenta = 0;
        };
        tabla2.map((fila, index) => {
            objetoFila2 = { ...fila };
            switch (index) {
                case 0:
                    objetoFila2.unidades = fila.unidades;
                    break;
                case 1:
                    objetoFila2.concepto = `JALP (${arrayTabla1[0].mc_porcentaje} %)`;
                    objetoFila2.unidades = precioVenta === Infinity ? arrayTabla1[0].precio_venta : _.round((precioVenta - sumLateralSup), 2);
                    break;
                case 2:
                    objetoFila2.unidades = precioVenta === Infinity ? arrayTabla1[0].precio_venta : _.round(sumLateralSup + (precioVenta - sumLateralSup), 2);
                    break;
                case 3:
                    objetoFila2.unidades = precioVenta === Infinity ? arrayTabla1[0].precio_venta : _.round(precioVenta, 2);
                    break;
                default:
            };
            arrayTabla2.push(objetoFila2);
        });
        setTableData1(arrayTabla1);
        setTableData2(arrayTabla2);
        if (update) {
            actualizarTabla(arrayTabla1, arrayTabla2);
        };
    };

    const actualizarTabla = (arrayTabla1, arrayTabla2) => {
        let datosCotizacionUpdate = {};
        if (cotizacionLateralInf) {
            datosCotizacionUpdate = { ...cotizacionLateralInf };
        };
        datosCotizacionUpdate = {
            cu: arrayTabla1[0].cu,
            precio_venta: arrayTabla1[0].precio_venta,
            mc: arrayTabla1[0].mc,
            mc_porcentaje: arrayTabla1[0].mc_porcentaje,
        };
        arrayTabla2.map((fila, index) => {
            switch (index) {
                case 0:
                    datosCotizacionUpdate.porcentaje = fila.unidades;
                    break;
                case 1:
                    datosCotizacionUpdate.jalp = fila.unidades;
                    break;
                case 2:
                    datosCotizacionUpdate.total = fila.unidades;
                    break;
                case 3:
                    datosCotizacionUpdate.precio_venta_total = fila.unidades;
                    break;
                default:
            };
        });
        dispatch(setObjetoCotizacionLateralInf(datosCotizacionUpdate));
    };

    const handleChangeCell1 = (cell, event) => {
        setChangedData1(true);
        const tabla = [...tableData1];
        const rowIndex = Number(cell.row.id);
        const columna = cell.column.id;
        let valor = event.target.value;
        !valor && (valor = 0);
        tabla[rowIndex][columna] = valor;
        calculosTabla(tabla, tableData2, false);
    };

    const handleExitCell1 = (cell) => {
        const tabla = [...tableData1];
        if (changedData1) {
            calculosTabla(tabla, tableData2, true);
            setChangedData1(false);
        };
    };

    if (!tableData1 && !tableData2) {
        return null
    };

    return (
        <>
            <TableContainer
                component={Paper}
                className="relative flex flex-col flex-auto w-full overflow-hidden"
                style={{
                    borderTopLeftRadius: '0px',
                    borderTopRightRadius: '0px',
                    borderBottomLeftRadius: '0px',
                    borderBottomRightRadius: '0px'
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
                    columns={[
                        {
                            header: 'C.U.',
                            accessorKey: 'cu',
                            enableSorting: false,
                            enableColumnFilter: false,
                            enableEditing: false,
                            muiTableHeadCellProps: {
                                sx: {
                                    paddingLeft: '24px'
                                },
                            },
                            muiTableBodyCellProps: {
                                sx: {
                                    paddingLeft: '24px',
                                    backgroundColor: 'white',
                                    cursor: 'default',
                                },
                            },
                            Cell: ({ cell, row }) => (
                                <Typography
                                    variant="body1"
                                >
                                    {`${cell.getValue()} €`}
                                </Typography>
                            ),
                            size: 50
                        },
                        {
                            header: 'Precio venta',
                            accessorKey: 'precio_venta',
                            enableSorting: false,
                            enableColumnFilter: false,
                            enableEditing: true,
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
                                    {`${cell.getValue()} €`}
                                </Typography>
                            ),
                            size: 50
                        },
                        {
                            header: 'M.C.',
                            accessorKey: 'mc',
                            enableSorting: false,
                            enableColumnFilter: false,
                            enableEditing: false,
                            Cell: ({ cell, row }) => (
                                <Typography
                                    variant="body1"
                                    color={cell.getValue() < 0 && "error"}
                                >
                                    {`${cell.getValue()} €`}
                                </Typography>
                            ),
                            size: 50,
                        },
                        {
                            header: 'M.C.%',
                            accessorKey: 'mc_porcentaje',
                            enableSorting: false,
                            enableColumnFilter: false,
                            enableEditing: false,
                            Cell: ({ cell, row }) => (
                                <Typography
                                    variant="body1"
                                    color={cell.getValue() < 0 && "error"}
                                >
                                    {`${cell.getValue()} %`}
                                </Typography>
                            ),
                            size: 50,
                        }
                    ]}
                    data={tableData1}
                    enableTopToolbar={false}
                    muiTableBodyCellProps={({ cell }) => ({
                        onChange: (event) => {
                            handleChangeCell1(cell, event);
                        },
                        onBlur: () => {
                            handleExitCell1(cell);
                        },
                        sx: {
                            backgroundColor: 'white',
                            cursor: 'default'
                        }
                    })}
                    muiBottomToolbarProps={{
                        sx: {
                            backgroundColor: 'white',
                            minHeight: '10px',
                        }
                    }}
                    muiTableHeadCellProps={{
                        sx: {
                            paddingBottom: '5px'
                        },
                    }}
                    initialState={{ density: 'compact', columnPinning: { left: null } }}
                />
            </TableContainer>
            <TableContainer
                component={Paper}
                className="relative flex flex-col flex-auto w-full overflow-hidden"
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
                    columns={[
                        {
                            header: '',
                            accessorKey: 'concepto',
                            enableSorting: false,
                            enableColumnFilter: false,
                            enableEditing: false,
                            muiTableHeadCellProps: {
                                sx: {
                                    paddingLeft: '24px'
                                },
                            },
                            muiTableBodyCellProps: ({ cell }) => ({
                                sx: {
                                    backgroundColor: cell.id === "0_concepto" ? '#e3f2fd' : 'white',
                                    paddingLeft: '24px',
                                    cursor: 'default',
                                },
                            }),
                            Cell: ({ cell, row }) => (
                                <Typography
                                    variant="body1"
                                >
                                    <span className="font-bold">
                                        {cell.getValue()}
                                    </span>
                                </Typography>
                            ),
                            size: 50
                        },
                        {
                            header: '',
                            accessorKey: 'unidades',
                            enableSorting: false,
                            enableColumnFilter: false,
                            muiTableBodyCellEditTextFieldProps: {
                                type: 'number',
                            },
                            muiTableBodyCellProps: ({ cell }) => ({
                                sx: {
                                    '&:hover': {
                                        backgroundColor: cell.id === "0_unidades" ? '#bbdefb' : 'white',
                                    },
                                    backgroundColor: cell.id === "0_unidades" ? '#e3f2fd' : 'white',
                                    pointerEvents: cell.id === "0_unidades" ? 'auto' : 'none'
                                },
                            }),
                            Cell: ({ cell, row }) => (
                                <Typography
                                    variant="body1"
                                >
                                    {cell.id === '0_unidades' ? `${cell.getValue()} %` : `${cell.getValue()} €`}
                                </Typography>
                            ),
                            size: 50
                        },
                    ]}
                    data={tableData2}
                    enableTopToolbar={false}
                    muiTableBodyCellProps={({ cell }) => ({
                        // onChange: (event) => {
                        //     handleChangeCell2(cell, event);
                        // },
                        // onBlur: () => {
                        //     handleExitCell2(cell);
                        // },                       
                    })}
                    initialState={{ density: 'compact', columnPinning: { left: null } }}
                />
            </TableContainer>
        </>
    );
}

export default LateralInfCotizacion;
