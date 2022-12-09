import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import _ from '@lodash';
import MaterialReactTable from 'material-react-table';
import Typography from '@mui/material/Typography';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

//constantes
import { REDONDEADO } from 'constantes';

//importacion acciones
import {
    generarPropsTabla,
    formateado
} from 'app/logica/produccion/logicaProduccion';
import {
    selectObjetoCotizacionActualizado,
    setObjetoCotizacionCuerpo,
    selectObjetoCotizacionCuerpo,
    setRegistraIntervencionDialog
} from 'app/redux/produccion/cotizacionSlice';

function MermaCuerpoCotDialog(props) {
    const { index } = props;
    const dispatch = useDispatch();
    const [tableColumns, setTableColumns] = useState(null);
    const [tableData, setTableData] = useState(null);
    const [changedData, setChangedData] = useState(false);
    const cotizacionActualizado = useSelector(selectObjetoCotizacionActualizado);
    const cotizacionCuerpo = useSelector(selectObjetoCotizacionCuerpo);
    const [updateState, setUpdateState] = useState({ estado: false, objeto: null });
    const [variablesCalculoMerma, setVariablesCalculoMerma] = useState({ vol_total: null, precio: null });

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
        setTableData(null);
        generarDatos();
    }, [cotizacionActualizado]);

    useEffect(() => {
        if (updateState.estado) {
            const delayDebounceFn = setTimeout(() => {
                actualizarTabla(updateState.objeto);
                setUpdateState({ estado: false, objeto: null });
            }, 250);
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
        if (cotizacionActualizado || cotizacionCuerpo) {
            let arrayFilas;
            if (cotizacionActualizado && !cotizacionCuerpo) {
                arrayFilas = cotizacionActualizado.filasCuerpo;
            } else {
                arrayFilas = cotizacionCuerpo.filasCuerpo;
            };
            setVariablesCalculoMerma({
                vol_total: arrayFilas[index].vol_total,
                precio: arrayFilas[index].precio
            });
            objetoDatos = {
                unidades: arrayFilas[index].vol_merma !== 0 ? arrayFilas[index].vol_merma.unidades : 0,
                largo: arrayFilas[index].vol_merma !== 0 ? arrayFilas[index].vol_merma.largo : 0,
                ancho: arrayFilas[index].ancho,
                grueso: arrayFilas[index].grueso,
                mat_prima: arrayFilas[index].vol_merma !== 0 ? arrayFilas[index].vol_merma.mat_prima : 0,
                vol_merma: arrayFilas[index].vol_merma !== 0 ? arrayFilas[index].vol_merma.vol_merma : 0,
                precio_merma: arrayFilas[index].vol_merma !== 0 ? arrayFilas[index].vol_merma.precio_merma : 0
            };
        };
        arrayDatos.push(objetoDatos);
        setTableData(arrayDatos);
    };

    const calculosTabla = (tabla) => {
        const arrayTabla = [];
        let objetoFila = null;
        tabla.map((fila, index) => {
            objetoFila = { ...fila };
            objetoFila.unidades = Number(objetoFila.unidades);
            objetoFila.largo = Number(objetoFila.largo);
            objetoFila.mat_prima = _.round((objetoFila.unidades * ((objetoFila.largo * objetoFila.ancho * objetoFila.grueso) / 1000000000)), REDONDEADO);
            if (objetoFila.unidades > 0 && objetoFila.largo > 0) {
                objetoFila.vol_merma = objetoFila.mat_prima - variablesCalculoMerma.vol_total;
                objetoFila.precio_merma = objetoFila.vol_merma * variablesCalculoMerma.precio;
            };
            arrayTabla.push(objetoFila);
        });
        setTableData(arrayTabla);
        if (arrayTabla[0].precio_merma > 0) {
            setUpdateState({ estado: true, objeto: arrayTabla });
        };
    };

    const actualizarTabla = (arrayTabla) => {
        const datosMermaUpdate = {
            unidades: arrayTabla[0].unidades,
            largo: arrayTabla[0].largo,
            mat_prima: arrayTabla[0].mat_prima,
            vol_merma: arrayTabla[0].vol_merma,
            precio_merma: arrayTabla[0].precio_merma
        };
        let datosCotizacionUpdate = {};
        let objetoFilasCuerpo = {};
        let arrayFilasCuerpo = [];
        if (cotizacionActualizado && !cotizacionCuerpo) {
            arrayFilasCuerpo = [...cotizacionActualizado.filasCuerpo];
        } else {
            arrayFilasCuerpo = [...cotizacionCuerpo.filasCuerpo];
        };
        objetoFilasCuerpo = { ...arrayFilasCuerpo[index] };
        objetoFilasCuerpo.vol_merma = datosMermaUpdate;
        arrayFilasCuerpo[index] = objetoFilasCuerpo;
        datosCotizacionUpdate.filasCuerpo = arrayFilasCuerpo;
        datosCotizacionUpdate.sumCuerpo = cotizacionCuerpo.sumCuerpo;
        dispatch(setObjetoCotizacionCuerpo(datosCotizacionUpdate));
        dispatch(setRegistraIntervencionDialog('merma'));
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
            {...dispatch(generarPropsTabla(false, false, `Cálculo merma cotización Fila ${index + 1}`, '', null, null, false))}
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
