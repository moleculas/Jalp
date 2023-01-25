import Paper from '@mui/material/Paper';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import _ from '@lodash';
import MaterialReactTable from 'material-react-table';
import TableContainer from '@mui/material/TableContainer';
import Typography from '@mui/material/Typography';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Box from '@mui/system/Box';
import Button from '@mui/material/Button';

//constantes
import { REDONDEADO } from 'constantes';

//importacion acciones
import {
    generarPropsTabla,
    formateado
} from 'app/logica/produccion/logicaProduccion';
import {
    selectActualizandoCotizacion,
    setActualizandoCotizacion
} from 'app/redux/produccion/cotizacionSlice';
import {
    calculosTablaLateralInf,
    actualizarTablaLateralInf
} from 'app/logica/produccion/logicaCotizacion';
//importacion acciones
import { showMessage } from 'app/redux/fuse/messageSlice';

function LateralInfCotizacion(props) {
    const { cotizacionLateralInf, cotizacionLateralSup, cotizacionCabecera, cotizacionCuerpo } = props;
    const dispatch = useDispatch();
    const [tableData, setTableData] = useState(null);
    const [changedData, setChangedData] = useState(false);
    const actualizandoCotizacion = useSelector(selectActualizandoCotizacion);
    const [totales, setTotales] = useState({ precio: 0 });
    const [reCalculado, setReCalculado] = useState({ estado: false, tipo: null });

    //useEffect  

    useEffect(() => {
        if (!tableData) {
            setTableData(null);
            generarDatos();
        };
    }, [tableData]);

    useEffect(() => {
        if (cotizacionLateralSup && cotizacionCabecera && cotizacionCuerpo) {
            calculosTabla(tableData, true, reCalculado);
        };
    }, [cotizacionLateralSup, cotizacionCabecera, cotizacionCuerpo]);

    useEffect(() => {
        if (actualizandoCotizacion.estado) {
            setTableData(null);
            generarDatos();
        };
    }, [actualizandoCotizacion]);

    //funciones

    const generarDatos = () => {
        const arrayDatos = [];
        let objetoDatos;
        let precio = 0;
        if (actualizandoCotizacion.estado) {
            objetoDatos = {
                cu: cotizacionLateralInf.cu,
                precio_venta: cotizacionLateralInf.precio_venta,
                mc: cotizacionLateralInf.mc,
                mc_porcentaje: cotizacionLateralInf.mc_porcentaje
            };
            dispatch(setActualizandoCotizacion({ ...actualizandoCotizacion, estado: false }));
        } else {
            objetoDatos = {
                cu: 0,
                precio_venta: 0,
                mc: 0,
                mc_porcentaje: 0
            };
        };
        precio = _.round((objetoDatos.cu / (100 - objetoDatos.mc_porcentaje) * 100), REDONDEADO);
        setTotales({
            precio
        });
        arrayDatos.push(objetoDatos);
        setTableData(arrayDatos);
    };

    const calculosTabla = (tabla, update, objetoReCalculado) => {
        setReCalculado(objetoReCalculado);
        const { arrayTabla, precio } = dispatch(calculosTablaLateralInf(tabla, objetoReCalculado));
        setTotales({
            precio
        });
        setTableData(arrayTabla);
        if (update) {
            dispatch(actualizarTablaLateralInf(arrayTabla, precio));
        };
    };

    const handleChangeCell = (cell, event) => {
        setChangedData(true);
        const tabla = [...tableData];
        const rowIndex = Number(cell.row.id);
        const columna = cell.column.id;
        let valor = Number(event.target.value);
        !valor && (valor = 0);
        if (columna === "mc_porcentaje") {
            if (valor > 100) {
                dispatch(showMessage({ message: "El porcentaje de margen de contribución debe ser menor que 100.", variant: "error", autoHideDuration: 6000 }));
                valor = 0
            };
        };
        tabla[rowIndex][columna] = valor;
        let objetoReCalculado;
        switch (columna) {
            case "precio_venta":
                objetoReCalculado = { estado: true, tipo: "precioVenta" };
                break;
            case "mc":
                objetoReCalculado = { estado: true, tipo: "mc" };
                break;
            case "mc_porcentaje":
                objetoReCalculado = { estado: true, tipo: "mcPorcentaje" };
                break;
            default:
        };
        calculosTabla(tabla, true, objetoReCalculado);
    };

    const handleExitCell = (cell) => {
        const tabla = [...tableData];
        const columna = cell.column.id;
        if (changedData) {
            let objetoReCalculado;
            switch (columna) {
                case "precio_venta":
                    objetoReCalculado = { estado: true, tipo: "precioVenta" };
                    break;
                case "mc":
                    objetoReCalculado = { estado: true, tipo: "mc" };
                    break;
                case "mc_porcentaje":
                    objetoReCalculado = { estado: true, tipo: "mcPorcentaje" };
                    break;
                default:
            };
            calculosTabla(tabla, true, objetoReCalculado);
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

    const retornaDisplay = () => {
        if (actualizandoCotizacion.objeto) {
            return ""
        } else {
            if (
                cotizacionCabecera &&
                cotizacionCabecera.cliente &&
                cotizacionCabecera.of &&
                cotizacionCabecera.unidades > 0 &&
                cotizacionCuerpo &&
                cotizacionCuerpo.sumCuerpo
            ) {
                return ""
            } else {
                return "none!important"
            };
        };
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

    const handleClickReset = () => {
        const tabla = [{
            cu: tableData[0].cu,
            precio_venta: 0,
            mc: 0,
            mc_porcentaje: 0
        }];
        calculosTabla(tabla, true, { estado: false, tipo: null });
    };

    if (!tableData) {
        return null
    };

    return (
        <>
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
                                    cursor: 'default'
                                },
                            },
                            Cell: ({ cell, row }) => (
                                <Typography
                                    variant="body1"
                                    className="whitespace-nowrap"
                                >
                                    {`${formateado(cell.getValue())} €`}
                                </Typography>
                            ),
                            size: 50
                        },
                        {
                            header: 'Precio.V',
                            accessorKey: 'precio_venta',
                            enableSorting: false,
                            enableColumnFilter: false,
                            enableEditing: true,
                            muiTableBodyCellEditTextFieldProps: {
                                type: 'number',
                                autoFocus: true
                            },
                            muiTableBodyCellProps: ({ cell, table }) => ({
                                onClick: () => {
                                    clickCelda(cell, table);
                                },
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
                                    {`${formateado(cell.getValue())} €`}
                                </Typography>
                            ),
                            size: 50
                        },
                        {
                            header: 'M.C.',
                            accessorKey: 'mc',
                            enableSorting: false,
                            enableColumnFilter: false,
                            enableEditing: true,
                            muiTableBodyCellEditTextFieldProps: {
                                type: 'number',
                                autoFocus: true
                            },
                            muiTableBodyCellProps: ({ cell, table }) => ({
                                onClick: () => {
                                    clickCelda(cell, table);
                                },
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
                                    {`${formateado(cell.getValue())} €`}
                                </Typography>
                            ),
                            size: 50,
                        },
                        {
                            header: 'M.C.%',
                            accessorKey: 'mc_porcentaje',
                            enableSorting: false,
                            enableColumnFilter: false,
                            enableEditing: true,
                            muiTableBodyCellEditTextFieldProps: {
                                type: 'number',
                                autoFocus: true
                            },
                            muiTableBodyCellProps: ({ cell, table }) => ({
                                onClick: () => {
                                    clickCelda(cell, table);
                                },
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
                                    {`${formateado(cell.getValue())} %`}
                                </Typography>
                            ),
                            size: 50,
                        }
                    ]}
                    data={tableData}
                    enableTopToolbar={false}
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
                    enableBottomToolbar={false}
                    muiTableHeadCellProps={{
                        sx: {
                            paddingBottom: '5px'
                        },
                    }}
                    muiTableProps={{
                        sx: {
                            display: retornaDisplay(),
                        }
                    }}
                />
                <Box className="flex flex-row items-center w-full py-16 px-24 justify-between" >
                    <div className="flex flex-row gap-8">
                        <Typography className="text-2xl font-extrabold tracking-tight leading-tight pb-8"
                            sx={{
                                display: retornaDisplay(),
                            }}
                        >
                            {`Precio venta: ${formateado(totales.precio)} €`}
                        </Typography>
                    </div>
                    <Button
                        color="primary"
                        disableElevation
                        onClick={handleClickReset}
                        size="small"
                        className="-mt-8"
                        sx={{
                            display: retornaDisplay(),
                        }}
                        disabled={reCalculado.estado ? false : true}
                    >
                        <span className="mx-12">
                            Resetear cálculos
                        </span>
                    </Button>
                </Box>
            </TableContainer>
        </>
    );
}

export default LateralInfCotizacion;
