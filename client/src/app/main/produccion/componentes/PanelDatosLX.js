import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import _ from '@lodash';
import MaterialReactTable from 'material-react-table';
import TableContainer from '@mui/material/TableContainer';
import Typography from '@mui/material/Typography';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Box from '@mui/system/Box';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

//importacion acciones
import {
    generarPropsTabla,
    formateado
} from 'app/logica/produccion/logicaProduccion';
import { updateProduccionLX } from 'app/redux/produccion/produccionSlice';

const formulaLX3FR = (cargas, formula) => {
    switch (formula) {
        case 0:
            return (cargas > 0) ? (((cargas - 1) * 520) + 600) : 0
            break;
        case 1:
            return (cargas > 0) ? (((cargas - 2) * 520) + (600 * 2)) : 0
            break;
        case 2:
            return (cargas > 0) ? (((cargas - 3) * 520) + (600 * 3)) : 0
            break;
        default:
    };
};

const formulaTLFR = (cargas, formula) => {
    switch (formula) {
        case 0:
            return (cargas > 0) ? (cargas * 1508) : 0
            break;
        default:
    };
};

const formulaLX3DE = (cargas, formula) => {
    switch (formula) {
        case 0:
            return (cargas > 0) ? (cargas * 600) : 0
            break;
        default:
    };
};

const formulaLX3ES = (cargas, formula) => {
    switch (formula) {
        case 0:
            return (cargas > 0) ? (cargas * 468) : 0
            break;
        default:
    };
};

const formulaTLES = (cargas, formula) => {
    switch (formula) {
        case 0:
            return (cargas > 0) ? (cargas * 858) : 0
            break;
        default:
    };
};

function PanelDatosLX(props) {
    const { datos, semana, anyo } = props;
    const dispatch = useDispatch();
    const [tableData, setTableData] = useState(null);
    const [tableColumns, setTableColumns] = useState(null);
    const [changedData, setChangedData] = useState(false);
    const configItems = [
        {
            producto: "LX3FR",
            config: [
                { valor: 0, tipo: "C*520+1C*600" },
                { valor: 1, tipo: "C*520+2C*600" },
                { valor: 2, tipo: "C*520+3C*600" }
            ],
            formula: formulaLX3FR
        },
        {
            producto: "TOPLAYERFR",
            config: [
                { valor: 0, tipo: "C*1508" }
            ],
            formula: formulaTLFR
        },
        {
            producto: "LX3DE",
            config: [
                { valor: 0, tipo: "C*600" }
            ],
            formulaLX3DE
        },
        {
            producto: "LX3ES",
            config: [
                { valor: 0, tipo: "C*468" }
            ],
            formula: formulaLX3ES
        },
        {
            producto: "TOPLAYERES",
            config: [
                { valor: 0, tipo: "C*858" }
            ],
            formula: formulaTLES
        },
    ];

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
                muiTableFooterCellProps: {
                    sx: {
                        paddingLeft: '24px',
                        cursor: 'default'
                    },
                },
                Cell: ({ cell, row }) => (
                    <Box className='flex flex-row items-center'
                        sx={{
                            minWidth: 150,
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
                size: 75,
                Cell: ({ cell, row }) => (
                    <Typography
                        variant="body1"
                        color={cell.getValue() < 0 && "error"}
                        className="whitespace-nowrap"
                    >
                        {formateado(cell.getValue())}
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
                header: 'Config',
                accessorKey: 'config',
                enableSorting: false,
                enableColumnFilter: false,
                enableEditing: false,
                size: 75,
                Cell: ({ cell, row, table }) => retornaSelect(cell, row, table),
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
                        className="whitespace-nowrap"
                    >
                        {formateado(cell.getValue())}
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

    const handleChangeSelect = (row, table, event) => {
        const arrayTabla = [...table.options.data];
        arrayTabla[row.index].config = event.target.value;
        setTableData(arrayTabla);
        calculosTabla(arrayTabla, row.index, true);
    };

    const retornaSelect = (cell, row, table) => {
        const configuracion = configItems[configItems.findIndex(prod => prod.producto === row.original.producto)].config;
        return (
            <FormControl
                variant="standard"
                className="-my-12"
                disabled={configuracion.length === 1 ? true : false}
            >
                <Select
                    value={cell.getValue()}
                    onChange={(event) => handleChangeSelect(row, table, event)}
                >
                    {configuracion.map((option) => (
                        <MenuItem key={option.valor} value={option.valor}>
                            {option.tipo}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        )
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
            <Typography variant="body1" className="whitespace-nowrap">
                {formateado(sumatorioTotales)}
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
                config: producto.config,
                cantidad: producto.cantidad,
            };
            arrayDatos.push(objetoDatos);
        });
        setTableData(arrayDatos);
    };

    const calculosTabla = (tabla, indice, update) => {
        const arrayTabla = [];
        let objetoFila = {};
        tabla.map((fila, index) => {
            objetoFila = { ...fila };
            let formula = configItems[configItems.findIndex(prod => prod.producto === fila.producto)].formula;
            objetoFila.cargas = Number(fila.cargas);
            objetoFila.cantidad = objetoFila.cargas > 0 ? (formula(objetoFila.cargas, objetoFila.config)) : 0;
            arrayTabla.push(objetoFila);
        });
        setTableData(arrayTabla);
        if (update) {
            actualizarTabla(arrayTabla[indice]);
        };
    };

    const actualizarTabla = (elemento) => {
        const id = datos[datos.findIndex(prod => prod.producto === elemento.producto)]._id;
        const linea = {
            _id: id,
            cargas: elemento.cargas,
            config: elemento.config,
            cantidad: elemento.cantidad,
            mensaje: true
        };
        dispatch(updateProduccionLX({ linea }));
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
        } else {
            if (!cell.getValue() && cell.id.includes("cargas")) {               
                const columna = cell.column.id;
                tabla[rowIndex][columna] = 0;
                setTableData(tabla);
            };
        };
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
                    `Salida palets semana: ${semana.semana} - ${semana.nombre} ${anyo}`,
                    '',
                    null,
                    `${_.upperFirst(semana.mes)} ${anyo}`,
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
            <div className="absolute bottom-0 ltr:right-0 rtl:left-0 w-96 h-96 -m-24 z-10">
                {retornaIcono()}
            </div>
        </TableContainer>
    );
}

export default PanelDatosLX;
