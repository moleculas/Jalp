import Paper from '@mui/material/Paper';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import _ from '@lodash';
import MaterialReactTable from 'material-react-table';
import TableContainer from '@mui/material/TableContainer';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import { motion } from 'framer-motion';

//importacion acciones
import {
    selectEscandallo,
    getEscandallo
} from 'app/redux/produccion/escandalloSlice';
import {
    generarPropsTabla,
    formateado
} from 'app/logica/produccion/logicaProduccion';

function FormulasCubicajeTacos() {
    const dispatch = useDispatch();
    const escandallo = useSelector(selectEscandallo);
    const item2 = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { delay: 0.2 } },
    };
    const item3 = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { delay: 0.3 } },
    };
    const [resultadoCalculosPalets, setResultadoCalculosPalets] = useState({ '135x72': 0, '103x72': 0, '103x94': 0 });
    const [resultadoCalculosM3, setResultadoCalculosM3] = useState({ '135x72': 0, '103x72': 0, '103x94': 0, 'total': 0 });
    const [tableData1, setTableData1] = useState([
        {
            'm-135x72': 0,
            'm-103x72': 0,
            'm-103x94': 0
        }
    ]);
    const [tableData2, setTableData2] = useState([
        {
            'p-135x72': 0,
            'p-103x72': 0,
            'p-103x94': 0,
            'total': ''
        }
    ]);

    //useEffect

    useEffect(() => {
        if (!escandallo) {
            dispatch(getEscandallo());
        };
    }, [escandallo]);

    //funciones 

    const tableColumns1 = [
        {
            header: '135x72',
            size: 50,
            accessorKey: 'm-135x72',
            enableSorting: false,
            enableColumnFilter: false,
            muiTableBodyCellEditTextFieldProps: {
                type: 'number',
                autoFocus: true
            },
            muiTableHeadCellProps: {
                sx: {
                    paddingLeft: '24px',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                },
            },
            muiTableBodyCellProps: ({ cell, table }) => ({
                onClick: () => clickCelda(cell, table, 1),
                sx: {
                    '&:hover': {
                        backgroundColor: '#e5e9ec',
                    },
                    paddingLeft: '24px',
                    backgroundColor: 'white',
                },
            }),
            muiTableFooterCellProps: {
                sx: {
                    paddingLeft: '24px',
                    cursor: 'default'
                },
            },
            Cell: ({ cell, row }) => (
                <Typography
                    variant="body1"
                    color={cell.getValue() < 0 && "error"}
                    className="whitespace-nowrap"
                >
                    {formateado(cell.getValue())}
                </Typography>
            ),
            Footer: () => (
                <Typography
                    variant="body1"
                    className={clsx('whitespace-nowrap', resultadoCalculosPalets['135x72'] < 0 && 'text-red-500')}
                >
                    {`${formateado(resultadoCalculosPalets['135x72'])} palets`}
                </Typography>
            ),
        },
        {
            header: '103x72',
            size: 50,
            accessorKey: 'm-103x72',
            enableSorting: false,
            enableColumnFilter: false,
            muiTableBodyCellEditTextFieldProps: {
                type: 'number',
                autoFocus: true
            },
            muiTableBodyCellProps: ({ cell, table }) => ({
                onClick: () => clickCelda(cell, table, 1),
                sx: {
                    '&:hover': {
                        backgroundColor: '#e5e9ec',
                    },
                    backgroundColor: 'white',
                },
            }),
            Cell: ({ cell, row }) => (
                <Typography
                    variant="body1"
                    color={cell.getValue() < 0 && "error"}
                    className="whitespace-nowrap"
                >
                    {formateado(cell.getValue())}
                </Typography>
            ),
            Footer: () => (
                <Typography
                    variant="body1"
                    className={clsx('whitespace-nowrap', resultadoCalculosPalets['103x72'] < 0 && 'text-red-500')}
                >
                    {`${formateado(resultadoCalculosPalets['103x72'])} palets`}
                </Typography>
            ),

        },
        {
            header: '103x94',
            size: 50,
            accessorKey: 'm-103x94',
            enableSorting: false,
            enableColumnFilter: false,
            muiTableBodyCellEditTextFieldProps: {
                type: 'number',
                autoFocus: true
            },
            muiTableBodyCellProps: ({ cell, table }) => ({
                onClick: () => clickCelda(cell, table, 1),
                sx: {
                    '&:hover': {
                        backgroundColor: '#e5e9ec',
                    },
                    backgroundColor: 'white',
                },
            }),
            Cell: ({ cell, row }) => (
                <Typography
                    variant="body1"
                    color={cell.getValue() < 0 && "error"}
                    className="whitespace-nowrap"
                >
                    {formateado(cell.getValue())}
                </Typography>
            ),
            Footer: () => (
                <Typography
                    variant="body1"
                    className={clsx('whitespace-nowrap', resultadoCalculosPalets['103x94'] < 0 && 'text-red-500')}
                >
                    {`${formateado(resultadoCalculosPalets['103x94'])} palets`}
                </Typography>
            ),
        }
    ];

    const tableColumns2 = [
        {
            header: '135x72',
            size: 50,
            accessorKey: 'p-135x72',
            enableSorting: false,
            enableColumnFilter: false,
            muiTableBodyCellEditTextFieldProps: {
                type: 'number',
                autoFocus: true
            },
            muiTableHeadCellProps: {
                sx: {
                    paddingLeft: '24px',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                },
            },
            muiTableBodyCellProps: ({ cell, table }) => ({
                onClick: () => clickCelda(cell, table, 2),
                sx: {
                    '&:hover': {
                        backgroundColor: '#e5e9ec',
                    },
                    paddingLeft: '24px',
                    backgroundColor: 'white',
                },
            }),
            muiTableFooterCellProps: {
                sx: {
                    paddingLeft: '24px',
                    cursor: 'default'
                },
            },
            Cell: ({ cell, row }) => (
                <Typography
                    variant="body1"
                    color={cell.getValue() < 0 && "error"}
                    className="whitespace-nowrap"
                >
                    {formateado(cell.getValue())}
                </Typography>
            ),
            Footer: () => (
                <Typography
                    variant="body1"
                    className={clsx('whitespace-nowrap', resultadoCalculosM3['135x72'] < 0 && 'text-red-500')}
                >
                    {`${formateado(resultadoCalculosM3['135x72'])} m³`}
                </Typography>
            ),
        },
        {
            header: '103x72',
            size: 50,
            accessorKey: 'p-103x72',
            enableSorting: false,
            enableColumnFilter: false,
            muiTableBodyCellEditTextFieldProps: {
                type: 'number',
                autoFocus: true
            },
            muiTableBodyCellProps: ({ cell, table }) => ({
                onClick: () => clickCelda(cell, table, 2),
                sx: {
                    '&:hover': {
                        backgroundColor: '#e5e9ec',
                    },
                    backgroundColor: 'white',
                },
            }),
            Cell: ({ cell, row }) => (
                <Typography
                    variant="body1"
                    color={cell.getValue() < 0 && "error"}
                    className="whitespace-nowrap"
                >
                    {formateado(cell.getValue())}
                </Typography>
            ),
            Footer: () => (
                <Typography
                    variant="body1"
                    className={clsx('whitespace-nowrap', resultadoCalculosM3['103x72'] < 0 && 'text-red-500')}
                >
                    {`${formateado(resultadoCalculosM3['103x72'])} m³`}
                </Typography>
            ),

        },
        {
            header: '103x94',
            size: 50,
            accessorKey: 'p-103x94',
            enableSorting: false,
            enableColumnFilter: false,
            muiTableBodyCellEditTextFieldProps: {
                type: 'number',
                autoFocus: true
            },
            muiTableBodyCellProps: ({ cell, table }) => ({
                onClick: () => clickCelda(cell, table, 2),
                sx: {
                    '&:hover': {
                        backgroundColor: '#e5e9ec',
                    },
                    backgroundColor: 'white',
                },
            }),
            Cell: ({ cell, row }) => (
                <Typography
                    variant="body1"
                    color={cell.getValue() < 0 && "error"}
                    className="whitespace-nowrap"
                >
                    {formateado(cell.getValue())}
                </Typography>
            ),
            Footer: () => (
                <Typography
                    variant="body1"
                    className={clsx('whitespace-nowrap', resultadoCalculosM3['103x94'] < 0 && 'text-red-500')}
                >
                    {`${formateado(resultadoCalculosM3['103x94'])} m³`}
                </Typography>
            ),
        },
        {
            header: 'Total',
            size: 50,
            accessorKey: 'total',
            enableSorting: false,
            enableColumnFilter: false,
            enableEditing: false,
            Footer: () => (
                <Typography
                    variant="body1"
                    className={clsx('whitespace-nowrap', resultadoCalculosM3['total'] < 0 && 'text-red-500')}                    
                >
                    {`${formateado(resultadoCalculosM3['total'])} m³`}
                </Typography>
            ),
        }
    ];

    const clickCelda = (cell, table, id) => {
        if (cell.getValue() === 0) {
            const tabla = [...table.options.data];
            const rowIndex = Number(cell.row.id);
            const columna = cell.column.id;
            tabla[rowIndex][columna] = "";
            if (id === 1) {
                setTableData1(tabla);
            };
            if (id === 2) {
                setTableData2(tabla);
            };
        };
        table.setEditingCell(cell);
    };

    const handleChangeForm1 = (tabla) => {
        const filaTabla = tabla[0];
        let objetoACambiar = { ...resultadoCalculosPalets };
        for (const key in filaTabla) {
            switch (key) {
                case 'm-135x72':
                    objetoACambiar['135x72'] = filaTabla[key] / escandallo.varPatinCentral;
                    break;
                case 'm-103x72':
                    objetoACambiar['103x72'] = filaTabla[key] / escandallo.varPatinDerecho;
                    break;
                case 'm-103x94':
                    objetoACambiar['103x94'] = filaTabla[key] / escandallo.varPatinIzquierdo;
                    break;
                default:
            };
        };
        setResultadoCalculosPalets(objetoACambiar);
    };

    const handleChangeForm2 = (tabla) => {
        const filaTabla = tabla[0];
        let objetoACambiar = { ...resultadoCalculosM3 };
        for (const key in filaTabla) {
            switch (key) {
                case 'p-135x72':
                    objetoACambiar['135x72'] = filaTabla[key] * escandallo.varPatinCentral;
                    break;
                case 'p-103x72':
                    objetoACambiar['103x72'] = filaTabla[key] * escandallo.varPatinDerecho;
                    break;
                case 'p-103x94':
                    objetoACambiar['103x94'] = filaTabla[key] * escandallo.varPatinIzquierdo;
                    break;
                default:
            };
        };
        const totalM3 = objetoACambiar['135x72'] + objetoACambiar['103x72'] + objetoACambiar['103x94'];
        objetoACambiar['total'] = totalM3;
        setResultadoCalculosM3(objetoACambiar);
    };

    const handleChangeCell = (cell, event, tabla) => {
        const rowIndex = Number(cell.row.id);
        const columna = cell.column.id;
        let valor = event.target.value;
        !valor && (valor = 0);
        if (tabla === 1) {
            const tabla1 = [...tableData1];
            tabla1[rowIndex][columna] = valor;
            setTableData1(tabla1);
            handleChangeForm1(tabla1);
        } else {
            const tabla2 = [...tableData2];
            tabla2[rowIndex][columna] = valor;
            setTableData2(tabla2);
            handleChangeForm2(tabla2);
        };
    };

    const handleExitCell = (cell, tabla) => {
        const rowIndex = Number(cell.row.id);
        const columna = cell.column.id;
        if (tabla === 1) {
            if (!cell.getValue()) {
                const tabla1 = [...tableData1];
                tabla1[rowIndex][columna] = 0;
                setTableData1(tabla1);
            };
        } else {
            if (!cell.getValue()) {
                const tabla2 = [...tableData2];
                tabla2[rowIndex][columna] = 0;
                setTableData2(tabla2);
            };
        };
    };

    if (!escandallo) {
        return null
    };

    return (
        <div className="flex flex-wrap w-full p-12">
            <div className="flex flex-col sm:flex-row flex-1 items-start px-12 justify-between mb-24">
                <div>
                    <Typography className="text-2xl font-extrabold tracking-tight leading-tight">
                        Fórmulas
                    </Typography>
                    <div className="mt-2 font-medium">
                        <Typography>Cálculo de cantidades según datos escandallo.</Typography>
                    </div>
                </div>
            </div>
            <div className="w-full flex flex-col">
                <motion.div variants={item2}>
                    <TableContainer component={Paper} className="rounded-2xl">
                        <MaterialReactTable
                            {...dispatch(generarPropsTabla(false, false, 'Palets realizables con m³', 'Fórmula cálculo datos', null, null, false))}
                            columns={tableColumns1}
                            data={tableData1}
                            muiTableBodyCellProps={({ cell }) => ({
                                onChange: (event) => {
                                    handleChangeCell(cell, event, 1);
                                },
                                onBlur: () => {
                                    handleExitCell(cell, 1);
                                },
                                sx: {
                                    backgroundColor: 'white',
                                    cursor: 'default'
                                }
                            })}
                        />
                    </TableContainer>
                </motion.div>
            </div>
            <div className="w-full flex flex-col mt-24">
                <motion.div variants={item3}>
                    <TableContainer component={Paper} className="rounded-2xl">
                        <MaterialReactTable
                            {...dispatch(generarPropsTabla(false, false, 'm³ necesarios para realizar palets', 'Fórmula cálculo datos', null, null, false))}
                            columns={tableColumns2}
                            data={tableData2}
                            muiTableBodyCellProps={({ cell }) => ({
                                onChange: (event) => {
                                    handleChangeCell(cell, event, 2);
                                },
                                onBlur: () => {
                                    handleExitCell(cell, 2);
                                },
                                sx: {
                                    backgroundColor: 'white',
                                    cursor: 'default'
                                }
                            })}
                        />
                    </TableContainer>
                </motion.div>
            </div>
        </div>
    );
}

export default FormulasCubicajeTacos;
