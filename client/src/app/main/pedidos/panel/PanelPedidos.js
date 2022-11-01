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

//importacion acciones
import { generarPropsTabla } from 'app/logica/produccion/logicaProduccion';
import {
    setAnadirFilaId,
    selectAnadirFilaId,
    updatePedido
} from 'app/redux/produccion/pedidoSlice';

function PanelPedidos(props) {
    const { datosPedido, semana, productos, anyo } = props;
    const dispatch = useDispatch();
    const anadirFilaId = useSelector(selectAnadirFilaId);
    const [tableColumns, setTableColumns] = useState(null);
    const [tableData, setTableData] = useState(null);
    const [disabledButton, setDisabledButton] = useState(true);
    const [changedData, setChangedData] = useState(false);

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
                    medidas: "",
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
                Cell: ({ cell, row, table }) => (
                    <FormControl variant="standard" className="-my-12" sx={{ minWidth: 200 }}>
                        <Select
                            value={cell.getValue()}
                            onChange={(event) => handleChangeSelectProducto(row, table, event)}
                        >
                            <MenuItem value="">
                                <em>Producto</em>
                            </MenuItem>
                            {productos.map((option) => (
                                <MenuItem key={option.producto} value={option.producto}>
                                    {option.producto}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                ),
            },
            {
                header: 'Medidas',
                accessorKey: 'medidas',
                enableSorting: false,
                enableColumnFilter: false,
                enableEditing: false,
                Cell: ({ cell, row }) => (
                    <Typography variant="body1">
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
                        {cell.getValue()}
                    </Typography>
                ),
                size: 75,
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
                    >
                        {cell.getValue() + " m³"}
                    </Typography>
                ),
                size: 75,
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
                    >
                        {cell.getValue() + " m³"}
                    </Typography>
                ),
                size: 75,
                Footer: ({ table }) => retornaTotales(table, 'vol_total'),
            }
        ];
        setTableColumns(arrayColumnas);
    };

    const retornaTotales = (table, columna) => {
        switch (columna) {
            case 'vol_total':
                if (table.options.data[0].vol_total > 0) {
                    const sumatorioTotales = table.options.data.reduce((sum, { vol_total }) => sum + vol_total, 0);
                    return (
                        <Typography variant="body1">
                            <span className="font-bold">
                                {`${sumatorioTotales} m³`}
                            </span>
                        </Typography>
                    )
                };
                break;
            default:
        };
    };

    const handleChangeSelectProducto = (row, table, event) => {
        const arrayTabla = [...table.options.data];
        arrayTabla[row.index].producto = event.target.value;
        if (event.target.value !== "") {
            const producto = productos[productos.findIndex(prod => prod.producto === event.target.value)];
            arrayTabla[row.index].medidas = `Largo: ${producto.largo}, Ancho: ${producto.ancho}, Grueso: ${producto.grueso}`;
        } else {
            arrayTabla[row.index].medidas = "";
        };
        arrayTabla[row.index].unidades = 0;
        arrayTabla[row.index].vol_unitario = 0;
        arrayTabla[row.index].vol_total = 0;
        setTableData(arrayTabla);
    };

    const generarDatos = () => {
        const arrayDatos = [];
        let objetoDatos;
        if (datosPedido.linea.length > 0) {
            datosPedido.linea.forEach((linea, index) => {
                const producto = productos[productos.findIndex(prod => prod.producto === linea.producto)];
                objetoDatos = {
                    producto: linea.producto,
                    medidas: `Largo: ${producto.largo}, Ancho: ${producto.ancho}, Grueso: ${producto.grueso}`,
                    unidades: linea.unidades,
                    vol_unitario: linea.vol_unitario,
                    vol_total: linea.vol_total,
                };
                arrayDatos.push(objetoDatos);
            });
        } else {
            objetoDatos = {
                producto: "",
                medidas: "",
                unidades: 0,
                vol_unitario: 0,
                vol_total: 0,
            };
            arrayDatos.push(objetoDatos);
        };
        setTableData(arrayDatos);
    };

    const calculosTabla = (tabla, indice, update) => {
        let objetoFila;
        const arrayTabla = [];
        tabla.map((fila) => {
            objetoFila = { ...fila };
            const producto = productos[productos.findIndex(prod => prod.producto === fila.producto)];
            objetoFila.unidades = Number(objetoFila.unidades);
            objetoFila.vol_unitario = _.round(((producto.largo * producto.ancho * producto.grueso) / 1000000000), 4);
            objetoFila.vol_total = _.round((Number(objetoFila.unidades) * objetoFila.vol_unitario), 4);
            arrayTabla.push(objetoFila);
        });
        setTableData(arrayTabla);
        if (update) {
            actualizarTabla(arrayTabla);
        };
    };

    const actualizarTabla = (arrayTabla) => {
        let datosPedidoUpdate = { _id: datosPedido._id, linea: [] };
        datosPedidoUpdate._id = datosPedido._id;
        const arrayLinea = arrayTabla.map(({ producto, unidades, vol_unitario, vol_total }) => ({ producto, unidades, vol_unitario, vol_total }));
        datosPedidoUpdate.linea = arrayLinea;
        dispatch(updatePedido(datosPedidoUpdate));
    };

    const handleChangeCell = (cell, event) => {
        setChangedData(true);
        const tabla = [...tableData];
        const rowIndex = Number(cell.row.id);
        const columna = cell.column.id;
        let valor = event.target.value;
        !valor && (valor = 0);
        tabla[rowIndex][columna] = valor;
        calculosTabla(tabla, rowIndex, false);
    };

    const handleExitCell = (cell) => {
        const tabla = [...tableData];
        const rowIndex = Number(cell.row.id);
        if (changedData) {
            calculosTabla(tabla, rowIndex, true);
            setChangedData(false);
        };
    };

    if (!tableData) {
        return null
    };

    return (
        <TableContainer className="rounded-2xl relative w-full overflow-hidden h-full">
            <MaterialReactTable
                {...dispatch(generarPropsTabla(
                    false,
                    false,
                    `Pedido ${_.upperFirst(datosPedido.tipo)} Semana: ${semana.numeroSemana} - ${semana.nombre} ${datosPedido.anyo}`,
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
            />
        </TableContainer>
    );
}

export default PanelPedidos;
