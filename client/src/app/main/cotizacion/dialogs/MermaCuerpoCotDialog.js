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
    selectObjetoCotizacionCuerpo,
} from 'app/redux/produccion/cotizacionSlice';
import {
    calculosTablaMerma,
    actualizarTablaMerma
} from 'app/logica/produccion/logicaCotizacion';

function MermaCuerpoCotDialog(props) {
    const { index } = props;
    const dispatch = useDispatch();
    const [tableColumns, setTableColumns] = useState(null);
    const [tableData, setTableData] = useState(null);
    const [changedData, setChangedData] = useState(false);
    const actualizandoCotizacion = useSelector(selectActualizandoCotizacion);
    const cotizacionCuerpo = useSelector(selectObjetoCotizacionCuerpo);
    const [updateState, setUpdateState] = useState({ estado: false, objeto: null });
    const [variablesCalculoMerma, setVariablesCalculoMerma] = useState({ vol_total: null, precio_m3: null });

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
                dispatch(actualizarTablaMerma(updateState.objeto, index));
                setUpdateState({ estado: false, objeto: null });
            }, 50);
            return () => clearTimeout(delayDebounceFn)
        };
    }, [updateState]);

    //funciones

    const generarColumnas = () => {
        const arrayColumnas = [
            {
                header: 'Unidades',
                accessorKey: 'unidades',
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
                size: 50,
            },
            {
                header: 'Largo',
                accessorKey: 'largo',
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
                size: 50,
            },
            {
                header: 'Ancho',
                accessorKey: 'ancho',
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
                size: 50,
            },
            {
                header: 'Grueso',
                accessorKey: 'grueso',
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
                size: 50,
            },
            {
                header: 'Vol.Mat.Prima',
                accessorKey: 'mat_prima',
                enableSorting: false,
                enableColumnFilter: false,
                enableEditing: false,
                Cell: ({ cell, row }) => (
                    <Typography
                        variant="body1"
                        color={cell.getValue() < 0 && "error"}
                        className="whitespace-nowrap"
                    >
                        {formateado(cell.getValue()) + " m³"}
                    </Typography>
                ),
                size: 50,
            },
            {
                header: 'Vol.Merma',
                accessorKey: 'vol_merma',
                enableSorting: false,
                enableColumnFilter: false,
                enableEditing: false,
                Cell: ({ cell, row }) => (
                    <Typography
                        variant="body1"
                        color={cell.getValue() < 0 && "error"}
                        className="whitespace-nowrap"
                    >
                        {formateado(cell.getValue()) + " m³"}
                    </Typography>
                ),
                size: 50,
            },
            {
                header: 'Precio.Merma',
                accessorKey: 'precio_merma',
                enableSorting: false,
                enableColumnFilter: false,
                enableEditing: false,
                Cell: ({ cell, row }) => (
                    <Typography
                        variant="body1"
                        color={cell.getValue() < 0 && "error"}
                        className="whitespace-nowrap"
                    >
                        {formateado(cell.getValue()) + " €"}
                    </Typography>
                ),
                size: 50,
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
            setVariablesCalculoMerma({
                vol_total: arrayFilas[index].vol_total,
                precio_m3: arrayFilas[index].precio_m3
            });
            objetoDatos = {
                unidades: arrayFilas[index].filaMerma.length > 0 ? arrayFilas[index].filaMerma[0].unidades : 0,
                largo: arrayFilas[index].filaMerma.length > 0 ? arrayFilas[index].filaMerma[0].largo : 0,
                ancho: arrayFilas[index].ancho,
                grueso: arrayFilas[index].grueso,
                mat_prima: arrayFilas[index].filaMerma.length > 0 ? arrayFilas[index].filaMerma[0].mat_prima : 0,
                vol_merma: arrayFilas[index].filaMerma.length > 0 ? arrayFilas[index].filaMerma[0].vol_merma : 0,
                precio_merma: arrayFilas[index].filaMerma.length > 0 ? arrayFilas[index].filaMerma[0].precio_merma : 0
            };
        } else {
            objetoDatos = {
                unidades: 0,
                largo: 0,
                ancho: 0,
                grueso: 0,
                mat_prima: 0,
                vol_merma: 0,
                precio_merma: 0
            };
        };
        arrayDatos.push(objetoDatos);
        setTableData(arrayDatos);
    };

    const calculosTabla = (tabla) => {
        const objetoMerma = {
            unidades: Number(tabla[0].unidades),
            largo: Number(tabla[0].largo),
            ancho: tabla[0].ancho,
            grueso: tabla[0].grueso,
            vol_total: variablesCalculoMerma.vol_total,
            precio_m3: variablesCalculoMerma.precio_m3
        };
        const arrayTabla = dispatch(calculosTablaMerma(objetoMerma));
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

    if (!tableData) {
        return null
    };

    return (
        <MaterialReactTable
            {...dispatch(generarPropsTabla(false, false, `Cálculo Merma cotización Fila ${index + 1}`, '', null, null, false))}
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
    );
}

export default MermaCuerpoCotDialog;
