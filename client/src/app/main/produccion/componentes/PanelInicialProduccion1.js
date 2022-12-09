import Paper from '@mui/material/Paper';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
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

function PanelInicialProduccion1(props) {
    const { mesActualLetra, datosInicial, datosSaldo, producto } = props;
    const dispatch = useDispatch();
    const [tableData, setTableData] = useState([
        {
            stockInicial: datosInicial.stockInicial,
            unidades: producto.unidades,
            stock: datosInicial.stockInicial / producto.unidades,
            saldoInicial: datosSaldo.saldoInicial,
        }
    ]);
    const [changedData, setChangedData] = useState(false);

    //useEffect  

    //funciones

    const calculosTabla = (tabla, update) => {
        const arrayTabla = [];
        let objetoFila = null;
        tabla.map((fila, index) => {
            objetoFila = { ...fila };
            objetoFila.stock = Number(objetoFila.stockInicial / objetoFila.unidades);
            arrayTabla.push(objetoFila);
        });
        const datosInicialUpdate = {
            idInicial: datosInicial._id,
            idSaldo: datosSaldo._id,
            stockInicial: arrayTabla[0].stockInicial,
            saldoInicial: arrayTabla[0].saldoInicial,
            mensaje: false
        };
        setTableData(arrayTabla);
        if (update) {
            dispatch(updateProduccionInicial(datosInicialUpdate));
        };
    };

    const handleChangeCell = (cell, event) => {
        setChangedData(true);
        const tabla = [...tableData];
        const rowIndex = Number(cell.row.id);
        const columna = cell.column.id;
        let valor = event.target.value;
        !valor && (valor = 0);
        tabla[rowIndex][columna] = valor;
        calculosTabla(tabla, false);
    };

    const handleExitCell = (cell) => {
        const tabla = [...tableData];
        if (changedData) {
            calculosTabla(tabla, true);
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

    return (
        <TableContainer component={Paper} className="rounded-2xl relative flex flex-col flex-auto w-full overflow-hidden">
            <MaterialReactTable
                {...dispatch(generarPropsTabla(false, false, 'Datos iniciales producción ', '', null, _.capitalize(mesActualLetra).replaceAll("/", " "), false))}
                columns={[
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
                ]}
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
    );
}

export default PanelInicialProduccion1;
