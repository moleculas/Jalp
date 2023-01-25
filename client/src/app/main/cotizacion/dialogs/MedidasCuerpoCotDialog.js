import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import _ from '@lodash';
import MaterialReactTable from 'material-react-table';
import Typography from '@mui/material/Typography';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

//importacion acciones
import {
    generarPropsTabla,
    formateado
} from 'app/logica/produccion/logicaProduccion';
import {
    selectActualizandoCotizacion,
    selectObjetoCotizacionCuerpo
} from 'app/redux/produccion/cotizacionSlice';
import {
    calculosTablaMedidas,
    actualizarTablaMedidas
} from 'app/logica/produccion/logicaCotizacion';

function MedidasCuerpoCotDialog(props) {
    const { index } = props;
    const dispatch = useDispatch();
    const [tableColumns, setTableColumns] = useState(null);
    const [tableData, setTableData] = useState(null);
    const [changedData, setChangedData] = useState(false);
    const actualizandoCotizacion = useSelector(selectActualizandoCotizacion);
    const cotizacionCuerpo = useSelector(selectObjetoCotizacionCuerpo);
    const [updateState, setUpdateState] = useState({ estado: false, objeto: null });

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
        if (actualizandoCotizacion.estado) {
            setTableData(null);
            generarDatos();
        };
    }, [actualizandoCotizacion]);

    useEffect(() => {
        if (updateState.estado) {
            const delayDebounceFn = setTimeout(() => {
                dispatch(actualizarTablaMedidas(updateState.objeto, index));
                setUpdateState({ estado: false, objeto: null });
            }, 50);
            return () => clearTimeout(delayDebounceFn)
        };
    }, [updateState]);

    //funciones

    const generarColumnas = () => {
        const arrayColumnas = [
            {
                header: 'Largo',
                accessorKey: 'largo',
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
                            backgroundColor: '#e5e9ec',
                        },
                        paddingLeft: '24px',
                        backgroundColor: 'white',
                    },
                }),
                Header: ({ column }) => (
                    <div className='flex flex-row items-center'>
                        <FuseSvgIcon className="mr-4" size={20}>material-outline:edit_note</FuseSvgIcon>
                        <div className='flex flex-row items-center'>
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
                header: 'Ancho',
                accessorKey: 'ancho',
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
                            backgroundColor: '#e5e9ec',
                        },
                        backgroundColor: 'white',

                    },
                }),
                Header: ({ column }) => (
                    <div className='flex flex-row items-center'>
                        <FuseSvgIcon className="mr-4" size={20}>material-outline:edit_note</FuseSvgIcon>
                        <div className='flex flex-row items-center'>
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
                header: 'Grueso',
                accessorKey: 'grueso',
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
                            backgroundColor: '#e5e9ec',
                        },
                        backgroundColor: 'white',
                    },
                }),
                Header: ({ column }) => (
                    <div className='flex flex-row items-center'>
                        <FuseSvgIcon className="mr-4" size={20}>material-outline:edit_note</FuseSvgIcon>
                        <div className='flex flex-row items-center'>
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

    const generarDatos = () => {
        const arrayDatos = [];
        let objetoDatos;
        if (cotizacionCuerpo) {
            let arrayFilas = cotizacionCuerpo.filasCuerpo;
            objetoDatos = {
                largo: arrayFilas[index].largo ? arrayFilas[index].largo : 0,
                ancho: arrayFilas[index].ancho ? arrayFilas[index].ancho : 0,
                grueso: arrayFilas[index].grueso ? arrayFilas[index].grueso : 0
            };
        } else {
            objetoDatos = {
                largo: 0,
                ancho: 0,
                grueso: 0
            };
        };
        arrayDatos.push(objetoDatos);
        setTableData(arrayDatos);
    };

    const calculosTabla = (tabla) => {
        const objetoMedidas = { 
            largo: Number(tabla[0].largo),
            ancho: Number(tabla[0].ancho),
            grueso: Number(tabla[0].grueso)
         };
        const arrayTabla = dispatch(calculosTablaMedidas(objetoMedidas));
        setTableData(arrayTabla);
        setUpdateState({ estado: true, objeto: arrayTabla });
    };

    const handleChangeCell = (cell, event) => {
        setChangedData(true);
        const tabla = [...tableData];
        const rowIndex = Number(cell.row.id);
        const columna = cell.column.id;
        let valor = event.target.value;
        !valor && (valor = 0);
        tabla[rowIndex][columna] = valor;
        calculosTabla(tabla);
    };

    const handleExitCell = (cell) => {
        const tabla = [...tableData];
        if (changedData) {
            calculosTabla(tabla);
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

    if (!tableData && !tableColumns) {
        return null
    };

    return (
        (tableColumns && tableData) && (
            <MaterialReactTable
                {...dispatch(generarPropsTabla(false, false, `Selección medidas cotización Fila ${index + 1}`, '', null, null, false))}
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
                muiTablePaperProps={{
                    elevation: 0,
                    sx: {
                        height: 200,
                        overflow: 'hidden'
                    },
                }}
            />
        )
    );
}

export default MedidasCuerpoCotDialog;
