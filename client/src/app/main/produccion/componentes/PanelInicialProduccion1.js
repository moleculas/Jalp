import Paper from '@mui/material/Paper';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import _ from '@lodash';
import MaterialReactTable from 'material-react-table';
import TableContainer from '@mui/material/TableContainer';
import Typography from '@mui/material/Typography';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

//importacion acciones
import {
    generarPropsTabla,
    formateado
} from 'app/logica/produccion/logicaProduccion';
import { updateProduccionInicial } from 'app/redux/produccion/produccionSlice';
import { selectObjSocket } from 'app/redux/socketSlice';

function PanelInicialProduccion1(props) {
    const { datosInicial, datosSaldo, producto, mes, anyo } = props;
    const dispatch = useDispatch();
    const socket = useSelector(selectObjSocket);
    const [tableData, setTableData] = useState(null);
    const [tableColumns, setTableColumns] = useState(null);
    const [changedData, setChangedData] = useState({ estado: false, item: null });

    //useEffect    

    useEffect(() => {
        generarColumnas();
    }, []);

    useEffect(() => {
        if (tableColumns && datosInicial && datosSaldo) {            
            setTableData(null);
            generarDatos();
        };
    }, [tableColumns, datosInicial, datosSaldo]);

    //funciones    

    const generarColumnas = () => {
        const arrayColumnas = [
            {
                header: 'Stock inicial',
                size: 50,
                accessorKey: 'stockInicial',
                enableSorting: false,
                enableColumnFilter: false,
                muiTableHeadCellProps: {
                    sx: {
                        paddingLeft: '24px',
                        fontSize: '1.5rem',
                        fontWeight: 700,
                    },
                },
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
                        paddingLeft: '24px',
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
            },
            {
                header: 'Unidades',
                size: 50,
                accessorKey: 'unidades',
                enableSorting: false,
                enableColumnFilter: false,
                enableEditing: false,
                Cell: ({ cell, row }) => (
                    <Typography
                        variant="body1"
                        color={cell.getValue() < 0 && "error"}
                        className="whitespace-nowrap"
                    >
                        {formateado(cell.getValue())}
                    </Typography>
                ),
            },
            {
                header: 'Stock',
                size: 50,
                accessorKey: 'stock',
                enableSorting: false,
                enableColumnFilter: false,
                enableEditing: false,
                Cell: ({ cell, row }) => (
                    <Typography
                        variant="body1"
                        color={cell.getValue() < 0 && "error"}
                        className="whitespace-nowrap"
                    >
                        {formateado(cell.getValue())}
                    </Typography>
                ),
            },
            {
                header: 'Saldo inicial',
                size: 50,
                accessorKey: 'saldoInicial',
                enableSorting: false,
                enableColumnFilter: false,
                enableEditing: true,
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
            }
        ];
        setTableColumns(arrayColumnas);
    };

    const generarDatos = () => {
        setTableData([
            {
                stockInicial: datosInicial[0].stockInicial,
                unidades: producto.unidades,
                stock: datosInicial[0].stockInicial / producto.unidades,
                saldoInicial: datosSaldo[0].saldoInicial,
            }
        ]);
    };

    const calculosTabla = (tabla, update, item) => {
        const arrayTabla = [];
        let objetoFila = null;
        let itemFila, itemConcepto;
        if (item) {
            [itemFila, itemConcepto] = item.split("_");
        };
        tabla.map((fila, index) => {
            objetoFila = { ...fila };
            objetoFila.stock = Number(objetoFila.stockInicial / objetoFila.unidades);
            arrayTabla.push(objetoFila);
        });
        const datosInicialUpdate = {
            idInicial: datosInicial[0]._id,
            idSaldo: datosSaldo[0]._id,
            stockInicial: Number(arrayTabla[0].stockInicial),
            saldoInicial: Number(arrayTabla[0].saldoInicial),
            mes,
            anyo,
            producto: producto.producto,
            familia: producto.familia,
            mensaje: false
        };
        setTableData(arrayTabla);        
        if (update) {
            dispatch(updateProduccionInicial(datosInicialUpdate)).then(({ payload }) => {
                if (item) {
                    socket.emit("comunicacion", {
                        tabla: "updateProduccionInicial",
                        pantalla: producto.producto,
                        item: itemConcepto
                    });
                };
            });
        };
    };

    const handleChangeCell = (cell, event) => {
        setChangedData({ estado: true, item: cell.id });
        const tabla = [...tableData];
        const rowIndex = Number(cell.row.id);
        const columna = cell.column.id;
        let valor = event.target.value;
        !valor && (valor = 0);
        tabla[rowIndex][columna] = valor;
        calculosTabla(tabla, false, null);
    };

    const handleExitCell = (cell) => {
        const tabla = [...tableData];
        if (changedData.estado) {
            calculosTabla(tabla, true, changedData.item);
            setChangedData({ estado: false, item: null });
        } else {
            if (!cell.getValue()) {
                const rowIndex = Number(cell.row.id);
                const columna = cell.column.id;
                tabla[rowIndex][columna] = 0;
                setTableData(tabla);
            };
        };
    };

    const retornaIcono = () => {
        const hayVacio = tableData.find(row => row.stockInicial === 0 || row.saldoInicial === 0);
        if (hayVacio) {
            return (<FuseSvgIcon className="shrink-0 fill-current opacity-25 text-red-500" size={96}>heroicons-outline:exclamation-circle</FuseSvgIcon>)
        } else {
            return (<FuseSvgIcon className="shrink-0 fill-current opacity-25 text-green-500" size={96}>heroicons-outline:check-circle</FuseSvgIcon>)
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

    if (!tableData && !tableColumns) {
        return null
    };

    return (
        (tableColumns && tableData) && (
            <TableContainer component={Paper} className="rounded-2xl relative flex flex-col flex-auto w-full overflow-hidden">
                <MaterialReactTable
                    {...dispatch(generarPropsTabla(
                        false,
                        false,
                        'Datos iniciales producción ',
                        '',
                        null,
                        `${_.capitalize(mes)} ${anyo}`,
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
                />
                <div className="absolute bottom-0 ltr:right-0 rtl:left-0 w-96 h-96 -m-24 z-99">
                    {retornaIcono()}
                </div>
            </TableContainer>
        )
    );
}

export default PanelInicialProduccion1;
