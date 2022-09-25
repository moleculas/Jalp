import Paper from '@mui/material/Paper';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import _ from '@lodash';
import MaterialReactTable from 'material-react-table';
import TableContainer from '@mui/material/TableContainer';
import Typography from '@mui/material/Typography';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

//importacion acciones
import { generarPropsTabla } from 'app/logica/produccion/logicaProduccion';
import { updateProduccionInicial } from 'app/redux/produccion/produccionSlice';

function PanelInicialProduccion1(props) {
    const { mesActual, datosInicial, datosSaldo, producto } = props;
    const dispatch = useDispatch();
    const [tableData, setTableData] = useState([
        {
            stockInicial: datosInicial.stockInicial,
            unidades: producto.unidades,
            stock: datosInicial.stockInicial / producto.unidades,
            saldoInicial: datosSaldo.saldoInicial,
        }
    ]);

    //useEffect  

    //funciones

    const calculosTabla = (tabla) => {
        const arrayTabla = [];
        let objetoFila = null;
        tabla.map((fila, index) => {
            objetoFila = { ...fila };
            objetoFila.stockInicial = Number(objetoFila.stock * objetoFila.unidades);
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
        dispatch(updateProduccionInicial(datosInicialUpdate));
    };

    const handleSaveRow = ({ exitEditingMode, row, values }) => {
        for (const key in values) {
            if (values[key] === '') {
                values[key] = 0;
            };
        };
        const tabla = [...tableData];
        tabla[row.index] = values;
        calculosTabla(tabla);
        exitEditingMode();
    };

    const retornaIcono = () => {
        const hayVacio = tableData.find(row => row.stockInicial === 0 || row.saldoInicial === 0);
        if (hayVacio) {
            return (<FuseSvgIcon className="shrink-0 fill-current opacity-25 text-red-500" size={96}>heroicons-outline:exclamation-circle</FuseSvgIcon>)
        } else {
            return (<FuseSvgIcon className="shrink-0 fill-current opacity-25 text-green-500" size={96}>heroicons-outline:check-circle</FuseSvgIcon>)
        };
    };

    return (
        <TableContainer component={Paper} className="rounded-2xl relative flex flex-col flex-auto w-full overflow-hidden">
            <MaterialReactTable
                {...dispatch(generarPropsTabla(false, false, 'Datos iniciales producción ', '', null, _.capitalize(mesActual).replaceAll("/", " "), false))}
                columns={[
                    {
                        header: 'Stock inicial',
                        size: 50,
                        accessorKey: 'stockInicial',
                        enableSorting: false,
                        enableColumnFilter: false,    
                        enableEditing: false,                                           
                        Cell: ({ cell, row }) => (
                            <Typography
                                variant="body1"
                                color={cell.getValue() < 0 && "error"}
                            >
                                {cell.getValue()}
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
                            >
                                {cell.getValue()}
                            </Typography>
                        ),
                    },
                    {
                        header: 'Stock',
                        size: 50,
                        accessorKey: 'stock',
                        enableSorting: false,
                        enableColumnFilter: false,   
                        muiTableBodyCellEditTextFieldProps: {
                            type: 'number',
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
                    },
                    {
                        header: 'Saldo inicial',
                        size: 50,
                        accessorKey: 'saldoInicial',
                        enableSorting: false,
                        enableColumnFilter: false,
                        enableEditing: producto.posicion === 1 ? true : false,
                        muiTableBodyCellEditTextFieldProps: {
                            type: 'number',
                        }, 
                        Header: ({ column }) => (
                            <div className='flex flex-row items-center'>
                                {producto.posicion === 1 && <FuseSvgIcon className="mr-4" size={20}>material-outline:edit_note</FuseSvgIcon>}
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
                    }
                ]}
                data={tableData}
                onEditingRowSave={handleSaveRow}
            />
            <div className="absolute bottom-0 ltr:right-0 rtl:left-0 w-96 h-96 -m-24 z-99">
                {retornaIcono()}
            </div>
        </TableContainer>
    );
}

export default PanelInicialProduccion1;
