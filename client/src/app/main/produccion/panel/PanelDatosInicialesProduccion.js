import Paper from '@mui/material/Paper';
import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import _ from '@lodash';
import MaterialReactTable from 'material-react-table';
import TableContainer from '@mui/material/TableContainer';
import Typography from '@mui/material/Typography';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

//importacion acciones
import { generarPropsTabla } from 'app/logica/produccion/logicaProduccion';
import { updateProduccionInicial, getProduccionInicial } from 'app/redux/produccion/produccionSlice';

function PanelDatosInicialesProduccion(props) {
    const { datos, familia, productos, mes, anyo } = props;
    const dispatch = useDispatch();
    const [tableData, setTableData] = useState(null);

    //useEffect  

    useEffect(() => {
        if (datos) {
            generarDatos();
        };
    }, [datos]);

    //funciones

    const generarDatos = () => {
        const arrayDatos = [];
        let objetoDatos;
        datos.inicial.map((producto) => {
            const unidades = productos[productos.findIndex(prod => prod.producto === producto.producto)].unidades;
            objetoDatos = {
                producto: producto.producto,
                stockInicial: producto.stockInicial,
                unidades,
                stock: producto.stockInicial / unidades,
                saldoInicial: datos.saldo[0].saldoInicial,
            };
            arrayDatos.push(objetoDatos);
        });
        setTableData(arrayDatos);
    };

    const calculosTabla = (tabla, indice) => {
        const arrayTabla = [];
        let objetoFila = null;
        let objetoActualizar = {};
        tabla.map((fila, index) => {
            objetoFila = { ...fila };
            if (index === indice) {
                objetoFila.stockInicial = Number(objetoFila.stock * objetoFila.unidades);
                objetoActualizar.stockInicial = objetoFila.stockInicial;
                objetoActualizar.saldoInicial = Number(objetoFila.saldoInicial);
                objetoActualizar.producto = objetoFila.producto;
            };
            arrayTabla.push(objetoFila);
        });
        setTableData(arrayTabla);
        const idInicial = datos.inicial[datos.inicial.findIndex(dato => dato.producto === objetoActualizar.producto)]._id;
        const idSaldo = datos.saldo[0]._id;
        const datosInicialUpdate = {
            idInicial,
            idSaldo,
            stockInicial: objetoActualizar.stockInicial,
            saldoInicial: objetoActualizar.saldoInicial,
            mensaje: true
        };
        dispatch(updateProduccionInicial(datosInicialUpdate)).then(() => {
            dispatch(getProduccionInicial({ mes, anyo, productos }));
        });
    };

    const handleSaveRow = ({ exitEditingMode, row, values }) => {
        for (const key in values) {
            if (values[key] === '') {
                values[key] = 0;
            };
        };
        const tabla = [...tableData];
        tabla[row.index] = values;
        calculosTabla(tabla, row.index);
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

    if (!tableData) {
        return null
    };

    return (
        <TableContainer component={Paper} className="rounded-2xl relative flex flex-col flex-auto w-full overflow-hidden">
            <MaterialReactTable
                {...dispatch(generarPropsTabla(false, false, 'Datos iniciales producción ', 'Configuración datos Stock y Saldo para cáculos mensuales.', null, "Familia productos: " + _.upperCase(familia), false))}
                columns={[
                    {
                        header: 'Producto',
                        accessorKey: 'producto',
                        enableSorting: false,
                        enableColumnFilter: false,
                        enableEditing: false,
                        Cell: ({ cell, row }) => (
                            <Typography>
                                {cell.getValue()}
                            </Typography>
                        ),
                        size: 75
                    },
                    {
                        header: 'Stock inicial',
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
                        size: 75
                    },
                    {
                        header: 'Unidades',
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
                        size: 75
                    },
                    {
                        header: 'Stock',
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
                        size: 75
                    },
                    {
                        header: 'Saldo inicial',
                        accessorKey: 'saldoInicial',
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
                        size: 75
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

export default PanelDatosInicialesProduccion;
