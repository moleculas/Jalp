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
            objetoFila.stock = Number(objetoFila.stockInicial / producto.unidades);
            arrayTabla.push(objetoFila);
        });
        const datosInicialUpdate = {
            idInicial: datosInicial._id,
            idSaldo: datosSaldo._id,
            stockInicial: arrayTabla[0].stockInicial,
            saldoInicial: arrayTabla[0].saldoInicial,
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

    return (
        <TableContainer component={Paper} className="rounded-2xl">
            <MaterialReactTable
                {...dispatch(generarPropsTabla(false, false, 'Datos iniciales producción ', '', null, _.capitalize(mesActual).replaceAll("/", " ")))}
                columns={[
                    {
                        header: 'Stock inicial',
                        size: 50,
                        accessorKey: 'stockInicial',
                        enableSorting: false,
                        enableColumnFilter: false,
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
                        header: 'Saldo inicial',
                        size: 50,
                        accessorKey: 'saldoInicial',
                        enableSorting: false,
                        enableColumnFilter: false,
                        enableEditing: producto.posicion === 1 ? true : false,
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
        </TableContainer>
    );
}

export default PanelInicialProduccion1;
