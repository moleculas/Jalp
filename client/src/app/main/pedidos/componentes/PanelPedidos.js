import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import _ from '@lodash';
import MaterialReactTable from 'material-react-table';
import TableContainer from '@mui/material/TableContainer';
import Typography from '@mui/material/Typography';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import clsx from 'clsx';

//constantes
import { REDONDEADO, PRODUCTOS } from 'constantes';

//importacion acciones
import {
    generarPropsTabla,
    formateado,
    removeArrayByIndex,
    LightTooltip
} from 'app/logica/produccion/logicaProduccion';
import {
    setAnadirFilaId,
    selectAnadirFilaId,
    updatePedido
} from 'app/redux/produccion/pedidoSlice';
import { showMessage } from 'app/redux/fuse/messageSlice';

function PanelPedidos(props) {
    const { datosPedido, semana, anyo, pedidoProducto, proveedor } = props;
    const dispatch = useDispatch();
    const anadirFilaId = useSelector(selectAnadirFilaId);
    const [tableColumns, setTableColumns] = useState(null);
    const [tableData, setTableData] = useState(null);
    const [disabledButton, setDisabledButton] = useState(true);
    const [changedData, setChangedData] = useState({ estado: false, item: null });

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
        if (datosPedido) {
            datosPedido.linea.length > 0 && (setDisabledButton(false));
        };
    }, [datosPedido]);

    useEffect(() => {
        if (anadirFilaId) {
            if (anadirFilaId === datosPedido._id) {
                const arrayDatos = [...tableData];
                let objetoDatos = {
                    producto: "",
                    unidades: 0,
                    vol_unitario: 0,
                    vol_total: 0,
                };
                arrayDatos.push(objetoDatos);
                setTableData(arrayDatos);
                dispatch(setAnadirFilaId(null));
            };
        };
    }, [anadirFilaId]);

    //funciones

    const generarColumnas = () => {
        const arrayColumnas = [
            {
                header: 'Producto',
                accessorKey: 'producto',
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
                Cell: ({ cell, row, table }) => {
                    const retornaProducto = (produ) => {
                        let textoTooltipVar;
                        const producto = pedidoProducto[pedidoProducto.findIndex(prod => prod.producto === produ)];
                        if (producto === undefined) {
                            textoTooltipVar = "";
                        } else {
                            textoTooltipVar = `Largo: ${producto.largo}, Ancho: ${producto.ancho}, Grueso: ${producto.grueso}`;
                        };
                        return textoTooltipVar
                    };
                    const [textoTooltip, setTextoTooltip] = useState(retornaProducto(cell.getValue()));
                    return (
                        <LightTooltip title={textoTooltip} placement="top-end">
                            <FormControl variant="standard" className="-my-12" sx={{ minWidth: "150px" }}>
                                <Select
                                    value={cell.getValue()}
                                    onChange={(event) => handleChangeSelectProducto(row, table, event)}
                                    onOpen={() => setTextoTooltip("")}
                                    onClose={(selected) => setTextoTooltip(retornaProducto(selected.target.dataset.value))}
                                >
                                    <MenuItem value="">
                                        <em>Producto</em>
                                    </MenuItem>
                                    {pedidoProducto.map((option) => (
                                        <MenuItem key={option.producto} value={option.producto}>
                                            {option.producto}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </LightTooltip>
                    )
                },
                size: 50
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
                    onClick: () => {
                        table.options.data[Number(cell.row.id)].producto && (clickCelda(cell, table));
                    },
                    sx: {
                        '&:hover': {
                            backgroundColor: '#e5e9ec',
                        },
                        backgroundColor: 'white',
                        pointerEvents: table.options.data[Number(cell.row.id)].producto ? 'auto' : 'none'
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
                header: 'Vol.Unitario',
                accessorKey: 'vol_unitario',
                enableSorting: false,
                enableColumnFilter: false,
                enableEditing: false,
                Cell: ({ cell, row }) => (
                    <Typography
                        variant="body1"
                        color={cell.getValue() < 0 && "error"}
                        className="whitespace-nowrap"
                    >
                        {formateado(cell.getValue()) + " m³"}
                    </Typography>
                ),
                size: 50,
            },
            {
                header: 'Vol.Total',
                accessorKey: 'vol_total',
                enableSorting: false,
                enableColumnFilter: false,
                enableEditing: false,
                Cell: ({ cell, row }) => (
                    <Typography
                        variant="body1"
                        color={cell.getValue() < 0 && "error"}
                        className="whitespace-nowrap"
                    >
                        {formateado(cell.getValue()) + " m³"}
                    </Typography>
                ),
                size: 50,
                Footer: ({ table }) => retornaTotales(table, 'vol_total'),
            }
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
            case 'vol_total':
                if (table.options.data[0].vol_total > 0) {
                    const sumatorioTotales = table.options.data.reduce((sum, { vol_total }) => sum + vol_total, 0);
                    return (
                        <Typography variant="body1">
                            <span className="font-bold whitespace-nowrap">
                                {`${formateado(sumatorioTotales)} m³`}
                            </span>
                        </Typography>
                    )
                };
                break;
            default:
        };
    };

    const handleChangeSelectProducto = (row, table, event) => {
        let obj = table.options.data.find(item => item.producto === event.target.value);
        if (!obj) {
            const arrayTabla = [...table.options.data];
            arrayTabla[row.index].producto = event.target.value;
            arrayTabla[row.index].unidades = 0;
            arrayTabla[row.index].vol_unitario = 0;
            arrayTabla[row.index].vol_total = 0;
            setTableData(arrayTabla);
        } else {
            dispatch(showMessage({ message: `El producto ${event.target.value} ya ha sido registrado esta semana.`, variant: "error", autoHideDuration: 6000 }));
        };
    };

    const generarDatos = () => {
        const arrayDatos = [];
        let objetoDatos;
        if (datosPedido.linea.length > 0) {
            datosPedido.linea.forEach((linea, index) => {
                objetoDatos = {
                    producto: linea.producto,
                    unidades: linea.unidades,
                    vol_unitario: linea.vol_unitario,
                    vol_total: linea.vol_total,
                };
                arrayDatos.push(objetoDatos);
            });
        } else {
            objetoDatos = {
                producto: "",
                unidades: 0,
                vol_unitario: 0,
                vol_total: 0,
            };
            arrayDatos.push(objetoDatos);
        };
        setTableData(arrayDatos);
    };

    const calculosTabla = (tabla, indice, update, item) => {
        let objetoFila;
        const arrayTabla = [];
        tabla.map((fila) => {
            objetoFila = { ...fila };
            const producto = pedidoProducto[pedidoProducto.findIndex(prod => prod.producto === fila.producto)];
            objetoFila.unidades = Number(objetoFila.unidades);
            objetoFila.vol_unitario = _.round(((producto.largo * producto.ancho * producto.grueso) / 1000000000), REDONDEADO);
            objetoFila.vol_total = _.round((Number(objetoFila.unidades) * objetoFila.vol_unitario), REDONDEADO);
            arrayTabla.push(objetoFila);
        });
        setTableData(arrayTabla);
        if (update) {
            actualizarTabla(arrayTabla, item);
        };
    };

    const actualizarTabla = (arrayTabla, item) => {
        let itemFila, itemConcepto;
        if (item) {
            [itemFila, itemConcepto] = item.split("_");
        };
        let updProduccionTabla = { estado: false, obj: null };
        let datosPedidoUpdate = {
            _id: datosPedido._id,
            proveedor: proveedor._id,
            semana: semana.numeroSemana,
            mes: semana.mes,
            anyo,
            linea: [],
            updProduccionTabla
        };
        const arrayLinea = arrayTabla.map(({ producto, unidades, vol_unitario, vol_total }) => ({ producto, unidades, vol_unitario, vol_total }));
        datosPedidoUpdate.linea = arrayLinea;
        const producto = arrayLinea[itemFila].producto;
        const productoPedidoActualizar = PRODUCTOS.find(prod => prod.producto === producto);
        if (productoPedidoActualizar) {
            const familia = pedidoProducto[pedidoProducto.findIndex(prod => prod.producto === producto)].familia;
            const unidades = arrayLinea[itemFila].unidades;           
            updProduccionTabla = {
                estado: true,
                obj: {
                    producto,
                    familia,
                    unidades
                }
            };
            datosPedidoUpdate.updProduccionTabla = updProduccionTabla;
        };
        dispatch(updatePedido(datosPedidoUpdate));
    };

    const handleChangeCell = (cell, event) => {
        setChangedData({ estado: true, item: cell.id });
        const tabla = [...tableData];
        const rowIndex = Number(cell.row.id);
        const columna = cell.column.id;
        let valor = event.target.value;
        !valor && (valor = 0);
        tabla[rowIndex][columna] = valor;
        calculosTabla(tabla, rowIndex, false, null);
    };

    const handleExitCell = (cell) => {
        const tabla = [...tableData];
        const rowIndex = Number(cell.row.id);
        if (changedData.estado) {
            calculosTabla(tabla, rowIndex, true, changedData.item);
            setChangedData({ estado: false, item: null });
        } else {
            if (!cell.getValue() && cell.id.includes("unidades")) {
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

    if (!tableData) {
        return null
    };

    return (
        <TableContainer className="rounded-2xl">
            <MaterialReactTable
                {...dispatch(generarPropsTabla(
                    false,
                    false,
                    `${_.capitalize(proveedor.codigo)} Sem: ${semana.numeroSemana} - ${semana.nombre} ${datosPedido.anyo}`,
                    '',
                    null,
                    `${_.upperFirst(semana.mes)} ${anyo}`,
                    { id: datosPedido._id, disabled: disabledButton, type: 'pedido' }
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
                        overflowX: "auto",
                        '&::after': {
                            content: '"Totales"',
                            paddingLeft: '24px',
                            paddingTop: '8px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            position: 'absolute'
                        },
                    }
                }}
                muiTablePaperProps={{
                    sx: {
                        minHeight: "330px!important",
                    }
                }}
            />
        </TableContainer>
    );
}

export default PanelPedidos;
