import Paper from '@mui/material/Paper';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import _ from '@lodash';
import MaterialReactTable from 'material-react-table';
import TableContainer from '@mui/material/TableContainer';
import Typography from '@mui/material/Typography';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

//importacion acciones
import { generarPropsTabla } from 'app/logica/produccion/logicaProduccion';
import {
    setObjetoCotizacionLateralSup,
    selectObjetoCotizacionActualizado
} from 'app/redux/produccion/cotizacionSlice';

function LateralSupCotizacion(props) {
    const { cotizacionLateralSup, cotizacionCabecera, cotizacionCuerpo } = props;
    const dispatch = useDispatch();
    const [tableData, setTableData] = useState(null);
    const [changedData, setChangedData] = useState(false);
    const conceptos = ["madera", "clavos", "corte_madera", "montaje", "patines", "transporte", "tratamiento", "desperdicio", "varios"];
    const cotizacionActualizado = useSelector(selectObjetoCotizacionActualizado);

    //useEffect  

    useEffect(() => {
        if (!tableData) {
            setTableData(null);
            generarDatos();
        };
    }, [tableData]);

    useEffect(() => {
        if (cotizacionCabecera && cotizacionCuerpo) {
            calculosTabla(tableData, true);
        };
    }, [cotizacionCabecera, cotizacionCuerpo]);

    useEffect(() => {
        setTableData(null);
        generarDatos();
    }, [cotizacionActualizado]);

    //funciones

    const generarDatos = () => {
        let arrayDatos = [];
        let objetoDatos;
        if (cotizacionActualizado) {
            arrayDatos = [
                {
                    concepto: 'madera',
                    unidad: null,
                    total: cotizacionActualizado.sumCuerpo
                },
                {
                    concepto: 'clavos',
                    unidad: (cotizacionActualizado.clavos /cotizacionActualizado.unidades),
                    total: cotizacionActualizado.clavos
                },
                {
                    concepto: 'corte_madera',
                    unidad: cotizacionActualizado.corte_madera,
                    total: cotizacionActualizado.corte_madera
                },
                {
                    concepto: 'montaje',
                    unidad: cotizacionActualizado.montaje,
                    total: cotizacionActualizado.montaje
                },
                {
                    concepto: 'patines',
                    unidad: (cotizacionActualizado.patines / (cotizacionActualizado.unidades * 3)),
                    total: cotizacionActualizado.patines
                },
                {
                    concepto: 'transporte',
                    unidad: (cotizacionActualizado.transporte / cotizacionActualizado.unidades),
                    total: cotizacionActualizado.transporte
                },
                {
                    concepto: 'tratamiento',
                    unidad: (cotizacionActualizado.tratamiento / cotizacionActualizado.unidades),
                    total: cotizacionActualizado.tratamiento
                },
                {
                    concepto: 'desperdicio',
                    unidad: (cotizacionActualizado.desperdicio / cotizacionActualizado.unidades),
                    total: cotizacionActualizado.desperdicio
                },
                {
                    concepto: 'varios',
                    unidad: cotizacionActualizado.varios,
                    total: cotizacionActualizado.varios
                },
            ];
        } else {
            conceptos.forEach((concepto, index) => {
                objetoDatos = {
                    concepto,
                    total: 0,
                };
                if (index === 0) {
                    objetoDatos.unidad = null;
                } else {
                    objetoDatos.unidad = 0;
                };
                arrayDatos.push(objetoDatos);
            });
        };
        setTableData(arrayDatos);
    };

    const calculosTabla = (tabla, update) => {
        const arrayTabla = [];
        let objetoFila = null;
        let sumCuerpo, unidades;
        if (cotizacionActualizado) {
            cotizacionCuerpo && cotizacionCuerpo.sumCuerpo ? sumCuerpo = cotizacionCuerpo.sumCuerpo : sumCuerpo = cotizacionActualizado.sumCuerpo;
            cotizacionCabecera && cotizacionCabecera.unidades ? unidades = cotizacionCabecera.unidades : unidades = cotizacionActualizado.unidades;
        } else {
            cotizacionCuerpo && cotizacionCuerpo.sumCuerpo ? sumCuerpo = cotizacionCuerpo.sumCuerpo : sumCuerpo = 0;
            cotizacionCabecera && cotizacionCabecera.unidades ? unidades = cotizacionCabecera.unidades : unidades = 0;
        };
        tabla.map((fila, index) => {
            objetoFila = { ...fila };
            if (index === 0) {
                objetoFila.unidad = null;
            } else {
                objetoFila.unidad = Number(objetoFila.unidad);
            };
            switch (objetoFila.concepto) {
                case "madera":
                    objetoFila.total = sumCuerpo;
                    break;
                case "clavos":
                    objetoFila.total = unidades * objetoFila.unidad;
                    break;
                case "corte_madera":
                    objetoFila.total = objetoFila.unidad;
                    break;
                case "montaje":
                    objetoFila.total = objetoFila.unidad;
                    break;
                case "patines":
                    objetoFila.total = objetoFila.unidad * 3 * unidades;
                    break;
                case "transporte":
                    objetoFila.total = unidades * objetoFila.unidad;
                    break;
                case "tratamiento":
                    objetoFila.total = unidades * objetoFila.unidad;
                    break;
                case "desperdicio":
                    objetoFila.total = unidades * objetoFila.unidad;
                    break;
                case "varios":
                    objetoFila.total = objetoFila.unidad;
                    break;
                default:
            };
            arrayTabla.push(objetoFila);
        });
        setTableData(arrayTabla);
        if (update) {
            actualizarTabla(arrayTabla);
        };
    };

    const actualizarTabla = (arrayTabla) => {
        let datosCotizacionUpdate = {};
        if (cotizacionLateralSup) {
            datosCotizacionUpdate = { ...cotizacionLateralSup };
        };
        datosCotizacionUpdate.clavos = arrayTabla[1].total;
        datosCotizacionUpdate.corte_madera = arrayTabla[2].total;
        datosCotizacionUpdate.montaje = arrayTabla[3].total;
        datosCotizacionUpdate.patines = arrayTabla[4].total;
        datosCotizacionUpdate.transporte = arrayTabla[5].total;
        datosCotizacionUpdate.tratamiento = arrayTabla[6].total;
        datosCotizacionUpdate.desperdicio = arrayTabla[7].total;
        datosCotizacionUpdate.varios = arrayTabla[8].total;
        const sumLateralSup = arrayTabla.reduce((sum, { total }) => sum + total, 0);
        datosCotizacionUpdate.sumLateralSup = _.round(sumLateralSup, 5);
        dispatch(setObjetoCotizacionLateralSup(datosCotizacionUpdate));
    };

    const handleChangeCell = (cell, event) => {
        setChangedData(true);
        const tabla = [...tableData];
        const rowIndex = Number(cell.row.id);
        const columna = cell.column.id;
        let valor = event.target.value;
        !valor && (valor = 0);
        tabla[rowIndex][columna] = valor;
        calculosTabla(tabla, false);
    };

    const handleExitCell = (cell) => {
        const tabla = [...tableData];
        if (changedData) {
            calculosTabla(tabla, true);
            setChangedData(false);
        };
    };

    const retornaTotales = (table, columna) => {
        switch (columna) {
            case 'total':
                if (table.options.data[0].total > 0) {
                    const sumatorioTotales = _.round((table.options.data.reduce((sum, { total }) => sum + total, 0)), 5);
                    return (
                        <Typography variant="body1">
                            <span className="font-bold">
                                {`${sumatorioTotales} €`}
                            </span>
                        </Typography>
                    )
                };
                break;
            default:
        };
    };

    if (!tableData) {
        return null
    };

    return (
        <TableContainer
            component={Paper}
            className="relative flex flex-col flex-auto w-full overflow-hidden"
            style={{
                borderTopLeftRadius: '16px',
                borderTopRightRadius: '16px',
                borderBottomLeftRadius: '0px',
                borderBottomRightRadius: '0px'
            }}
        >
            <MaterialReactTable
                {...dispatch(generarPropsTabla(
                    false,
                    false,
                    '',
                    '',
                    null,
                    '',
                    false
                ))}
                columns={[
                    {
                        header: '',
                        accessorKey: 'concepto',
                        enableSorting: false,
                        enableColumnFilter: false,
                        enableEditing: false,
                        muiTableHeadCellProps: {
                            sx: {
                                paddingLeft: '24px'
                            },
                        },
                        muiTableBodyCellProps: {
                            sx: {
                                paddingLeft: '24px',
                                backgroundColor: 'white',
                                cursor: 'default',
                            },
                        },
                        Cell: ({ cell, row }) => (
                            <Typography
                                variant="body1"
                            >
                                <span className="font-bold">
                                    {_.capitalize(cell.getValue()).replaceAll("_", " ")}
                                </span>
                            </Typography>
                        ),
                        size: 50
                    },
                    {
                        header: 'Unidad',
                        accessorKey: 'unidad',
                        enableSorting: false,
                        enableColumnFilter: false,
                        muiTableBodyCellEditTextFieldProps: {
                            type: 'number',
                        },
                        muiTableBodyCellProps: ({ cell }) => ({
                            sx: {
                                '&:hover': {
                                    backgroundColor: '#ebebeb',
                                },
                                backgroundColor: 'white',
                                pointerEvents: cell.id === "0_unidad" ? 'none' : 'auto'
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
                        Cell: ({ cell, row }) => {
                            if (cell.getValue() !== null) {
                                return (
                                    <Typography
                                        variant="body1"
                                        color={cell.getValue() < 0 && "error"}
                                    >
                                        {`${cell.getValue()} €`}
                                    </Typography>
                                )
                            };
                        },
                        size: 50
                    },
                    {
                        header: 'Total',
                        accessorKey: 'total',
                        enableSorting: false,
                        enableColumnFilter: false,
                        enableEditing: false,
                        Cell: ({ cell, row }) => (
                            <Typography
                                variant="body1"
                                color={cell.getValue() < 0 && "error"}
                            >
                                {`${cell.getValue()} €`}
                            </Typography>
                        ),
                        size: 50,
                        Footer: ({ table }) => retornaTotales(table, 'total'),
                    }
                ]}
                data={tableData}
                enableTopToolbar={false}
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
                muiBottomToolbarProps={{
                    sx: {
                        backgroundColor: 'white',
                        minHeight: '10px',
                    }
                }}
                muiTableHeadCellProps={{
                    sx: {
                        paddingY: '10px'
                    },
                }}
                muiTableFooterCellProps={{
                    sx: {
                        paddingY: '10px'
                    },
                }}
                initialState={{ density: 'compact', columnPinning: { left: null } }}
            />
        </TableContainer>
    );
}

export default LateralSupCotizacion;
