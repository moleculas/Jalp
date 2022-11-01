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
import { generarPropsTabla } from 'app/logica/produccion/logicaProduccion';

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
                type: 'number'
            },
            muiTableHeadCellProps: {
                sx: {
                    paddingLeft: '24px'
                },
            },
            muiTableBodyCellProps: {
                sx: {
                    '&:hover': {
                        backgroundColor: '#ebebeb',
                    },
                    paddingLeft: '24px',
                    backgroundColor: 'white',
                },
            },
            muiTableFooterCellProps: {
                sx: {
                    paddingLeft: '24px',
                    cursor: 'default'
                },
            },
            Footer: () => (
                <Typography
                    variant="body1"
                    className={clsx('truncate', resultadoCalculosPalets['135x72'] < 0 && 'text-red-500')}
                >
                    {`${resultadoCalculosPalets['135x72']} palets`}
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
                type: 'number'
            },
            muiTableBodyCellProps: {
                sx: {
                    '&:hover': {
                        backgroundColor: '#ebebeb',
                    },
                    backgroundColor: 'white',
                },
            },
            Footer: () => (
                <Typography
                    variant="body1"
                    className={clsx('truncate', resultadoCalculosPalets['103x72'] < 0 && 'text-red-500')}
                >
                    {`${resultadoCalculosPalets['103x72']} palets`}
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
                type: 'number'
            },
            muiTableBodyCellProps: {
                sx: {
                    '&:hover': {
                        backgroundColor: '#ebebeb',
                    },
                    backgroundColor: 'white',
                },
            },
            Footer: () => (
                <Typography
                    variant="body1"
                    className={clsx('truncate', resultadoCalculosPalets['103x94'] < 0 && 'text-red-500')}
                >
                    {`${resultadoCalculosPalets['103x94']} palets`}
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
                type: 'number'
            },
            muiTableHeadCellProps: {
                sx: {
                    paddingLeft: '24px'
                },
            },
            muiTableBodyCellProps: {
                sx: {
                    '&:hover': {
                        backgroundColor: '#ebebeb',
                    },
                    paddingLeft: '24px',
                    backgroundColor: 'white',
                },
            },
            muiTableFooterCellProps: {
                sx: {
                    paddingLeft: '24px',
                    cursor: 'default'
                },
            },
            Footer: () => (
                <Typography
                    variant="body1"
                    className={clsx('truncate', resultadoCalculosM3['135x72'] < 0 && 'text-red-500')}
                >
                    {`${resultadoCalculosM3['135x72']} m³`}
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
                type: 'number'
            },
            muiTableBodyCellProps: {
                sx: {
                    '&:hover': {
                        backgroundColor: '#ebebeb',
                    },
                    backgroundColor: 'white',
                },
            },
            Footer: () => (
                <Typography
                    variant="body1"
                    className={clsx('truncate', resultadoCalculosM3['103x72'] < 0 && 'text-red-500')}
                >
                    {`${resultadoCalculosM3['103x72']} m³`}
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
                type: 'number'
            },
            muiTableBodyCellProps: {
                sx: {
                    '&:hover': {
                        backgroundColor: '#ebebeb',
                    },
                    backgroundColor: 'white',
                },
            },
            Footer: () => (
                <Typography
                    variant="body1"
                    className={clsx('truncate', resultadoCalculosM3['103x94'] < 0 && 'text-red-500')}
                >
                    {`${resultadoCalculosM3['103x94']} m³`}
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
                    className={clsx('truncate', resultadoCalculosM3['total'] < 0 && 'text-red-500')}
                >
                    {`${resultadoCalculosM3['total']} m³`}
                </Typography>
            ),
        }
    ];

    const handleChangeForm1 = (tabla) => {
        const filaTabla = tabla[0];
        let objetoACambiar = { ...resultadoCalculosPalets };
        for (const key in filaTabla) {
            switch (key) {
                case 'm-135x72':
                    objetoACambiar['135x72'] = _.round((filaTabla[key] / escandallo.varPatinCentral), 2);
                    break;
                case 'm-103x72':
                    objetoACambiar['103x72'] = _.round((filaTabla[key] / escandallo.varPatinDerecho), 2);
                    break;
                case 'm-103x94':
                    objetoACambiar['103x94'] = _.round((filaTabla[key] / escandallo.varPatinIzquierdo), 2);
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
                    objetoACambiar['135x72'] = _.round((filaTabla[key] * escandallo.varPatinCentral), 2);
                    break;
                case 'p-103x72':
                    objetoACambiar['103x72'] = _.round((filaTabla[key] * escandallo.varPatinDerecho), 2);
                    break;
                case 'p-103x94':
                    objetoACambiar['103x94'] = _.round((filaTabla[key] * escandallo.varPatinIzquierdo), 2);
                    break;
                default:
            };
        };
        const totalM3 = objetoACambiar['135x72'] + objetoACambiar['103x72'] + objetoACambiar['103x94'];
        objetoACambiar['total'] = _.round(totalM3, 2);
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
