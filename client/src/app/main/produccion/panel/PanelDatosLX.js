import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import _ from '@lodash';
import MaterialReactTable from 'material-react-table';
import TableContainer from '@mui/material/TableContainer';
import Typography from '@mui/material/Typography';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Box from '@mui/system/Box';
import Avatar from '@mui/material/Avatar';

//constantes
import { PRODUCTOSLX } from 'constantes';

//importacion acciones
import { generarPropsTabla } from 'app/logica/produccion/logicaProduccion';
import { updateProduccionLX } from 'app/redux/produccion/produccionSlice';

function PanelDatosLX(props) {
    const { datos, semana, anyo } = props;
    const dispatch = useDispatch();
    const [tableData, setTableData] = useState(null);
    const [tableColumns, setTableColumns] = useState(null);

    //useEffect  

    useEffect(() => {
        generarColumnas();
    }, []);

    useEffect(() => {
        if (datos) {
            generarDatos();
        };
    }, [datos]);

    //funciones

    const generarColumnas = () => {
        const arrayColumnas = [
            {
                header: 'Producto',
                accessorKey: 'producto',
                enableSorting: false,
                enableColumnFilter: false,
                enableEditing: false,
                Cell: ({ cell, row }) => (
                    <Box className='flex flex-row items-center'
                        sx={{
                            minWidth: 150,
                            paddingLeft: 1,
                        }}
                    >
                        <Avatar
                            variant="square"
                            sx={{
                                width: 16,
                                height: 16,
                                marginRight: 1.5,
                                backgroundColor:
                                    cell.getValue().toString().includes("FR") ? 'secondary.main' :
                                        cell.getValue().toString().includes("DE") ? '#000000' :
                                            '#ffd966',
                                color:
                                    cell.getValue().toString().includes("FR") ? '#00b0f0' :
                                        cell.getValue().toString().includes("DE") ? '#000000' :
                                            '#ffd966',
                            }}
                        >.</Avatar>
                        <Typography variant="body1" className="font-semibold">
                            {cell.getValue()}
                        </Typography>
                    </Box >
                ),
                size: 75,
                Footer: ({ cell, row }) => (
                    <>
                        <Box className='flex flex-row items-center mb-28 -mt-4 cursor-default'
                            sx={{
                                minWidth: 150,
                                paddingLeft: 1,
                            }}
                        >
                            <Avatar
                                variant="square"
                                sx={{
                                    width: 16,
                                    height: 16,
                                    marginRight: 1.5,
                                    backgroundColor: '#92d050',
                                    color: '#92d050',
                                }}
                            >.</Avatar>
                            <Typography variant="body1" className="font-semibold">
                                TOTAL LX
                            </Typography>
                        </Box >
                        <Box className='flex flex-row items-center cursor-default'
                            sx={{
                                minWidth: 150,
                                paddingLeft: 1,
                            }}
                        >
                            <Avatar
                                variant="square"
                                sx={{
                                    width: 16,
                                    height: 16,
                                    marginRight: 1.5,
                                    backgroundColor: '#92d050',
                                    color: '#92d050',
                                }}
                            >.</Avatar>
                            <Typography variant="body1" className="font-semibold">
                                TOTAL TL
                            </Typography>
                        </Box >
                    </>
                ),
            },
            {
                header: 'Cargas',
                accessorKey: 'cargas',
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
                size: 75,
                Cell: ({ cell, row }) => (
                    <Typography
                        variant="body1"
                        color={cell.getValue() < 0 && "error"}
                    >
                        {cell.getValue()}
                    </Typography>
                ),
                Footer: ({ table }) => (
                    <>
                        <Box className='flex flex-row items-center mb-28 -mt-4 cursor-default'>
                            {retornaTotales(table, 'cargaLX')}
                        </Box >
                        <Box className='flex flex-row items-center cursor-default'>
                            {retornaTotales(table, 'cargaTL')}
                        </Box >
                    </>
                )
            },
            {
                header: 'Cantidad',
                accessorKey: 'cantidad',
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
                size: 75,
                Footer: ({ table }) => (
                    <>
                        <Box className='flex flex-row items-center mb-28 -mt-4 cursor-default'>
                            {retornaTotales(table, 'cantidadLX')}
                        </Box >
                        <Box className='flex flex-row items-center cursor-default'>
                            {retornaTotales(table, 'cantidadTL')}
                        </Box >
                    </>
                )
            }
        ];
        setTableColumns(arrayColumnas);
    };

    const retornaTotales = (table, tipo) => {
        let sumatorioTotales = 0;
        let elIncludes;
        let elSumando;
        table.options.data.map((fila) => {
            switch (tipo) {
                case 'cargaLX':
                    elIncludes = "LX3";
                    elSumando = Number(fila.cargas);
                    break;
                case 'cargaTL':
                    elIncludes = "TOPLAYER";
                    elSumando = Number(fila.cargas);
                    break;
                case 'cantidadLX':
                    elIncludes = "LX3";
                    elSumando = Number(fila.cantidad);
                    break;
                case 'cantidadTL':
                    elIncludes = "TOPLAYER";
                    elSumando = Number(fila.cantidad);
                    break;
                default:
            };
            if (fila.producto.includes(elIncludes)) {
                sumatorioTotales += elSumando;
            };
        });
        return (
            <Typography variant="body1">
                {sumatorioTotales}
            </Typography>
        )
    };

    const generarDatos = () => {
        const arrayDatos = [];
        let objetoDatos;
        datos.map((producto) => {
            objetoDatos = {
                producto: producto.producto,
                cargas: producto.cargas,
                cantidad: producto.cantidad,
            };
            arrayDatos.push(objetoDatos);
        });
        setTableData(arrayDatos);
    };

    const calculosTabla = (tabla, indice) => {
        const arrayTabla = [];
        let objetoFila = {};
        tabla.map((fila, index) => {
            objetoFila = { ...fila };
            let formula = PRODUCTOSLX[PRODUCTOSLX.findIndex(prod => prod.producto === fila.producto)].formula;
            objetoFila.cargas = Number(fila.cargas);
            objetoFila.cantidad = objetoFila.cargas > 0 ? (formula(objetoFila.cargas)) : 0;
            arrayTabla.push(objetoFila);
        });
        setTableData(arrayTabla);
        actualizarTabla(arrayTabla[indice]);
    };

    const actualizarTabla = (elemento) => {
        const id = datos[datos.findIndex(prod => prod.producto === elemento.producto)]._id;
        const linea = {
            _id: id,
            cargas: elemento.cargas,
            cantidad: elemento.cantidad
        };
        dispatch(updateProduccionLX({ linea }));
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
        const hayVacio = tableData.find(row => row.cantidad === 0);
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
        <TableContainer
            className="rounded-2xl relative w-full overflow-hidden"
            sx={{ height: 488 }}
        >
            <MaterialReactTable
                {...dispatch(generarPropsTabla(
                    false,
                    false,
                    `Datos iniciales semana: ${semana.semana} - ${semana.nombre} ${anyo}`,
                    '',
                    null,
                    `${_.upperFirst(semana.mes)} ${anyo}`,
                    false
                ))}
                columns={tableColumns}
                data={tableData}
                onEditingRowSave={handleSaveRow}
            />
            <div className="absolute bottom-0 ltr:right-0 rtl:left-0 w-96 h-96 -m-24 z-10">
                {retornaIcono()}
            </div>
        </TableContainer>
    );
}

export default PanelDatosLX;
