import Paper from '@mui/material/Paper';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import _ from '@lodash';
import MaterialReactTable from 'material-react-table';
import TableContainer from '@mui/material/TableContainer';
import Typography from '@mui/material/Typography';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Box from '@mui/system/Box';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import clsx from 'clsx';

//constantes
import { REDONDEADO } from 'constantes';

//importacion acciones
import {
    generarPropsTabla,
    formateado,
    removeArrayByIndex
} from 'app/logica/produccion/logicaProduccion';
import {
    setObjetoCotizacionLateralSup,
    selectObjetoCotizacionActualizado,
    openNoteDialog,
} from 'app/redux/produccion/cotizacionSlice';

function LateralSupCotizacion(props) {
    const { cotizacionLateralSup, cotizacionCabecera, cotizacionCuerpo } = props;
    const dispatch = useDispatch();
    const [tableData, setTableData] = useState(null);
    const [changedData, setChangedData] = useState(false);
    const conceptos = ["clavos", "corte_madera", "montaje", "patines", "transporte", "tratamiento", "merma"];
    const cotizacionActualizado = useSelector(selectObjetoCotizacionActualizado);
    const [totales, setTotales] = useState({ volumen: 0, precio: 0 });

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
            setTotales({
                volumen: (cotizacionCuerpo.sumVolumen - cotizacionCuerpo.sumVolumenMerma),
                precio: (cotizacionCuerpo.sumCuerpo - cotizacionCuerpo.sumPrecioMerma)
            });
        };
    }, [cotizacionCabecera, cotizacionCuerpo]);

    useEffect(() => {
        if (cotizacionActualizado) {
            setTableData(null);
            generarDatos();
            setTotales({
                volumen: (cotizacionActualizado.sumVolumen - cotizacionActualizado.sumVolumenMerma),
                precio: (cotizacionActualizado.sumCuerpo - cotizacionActualizado.sumPrecioMerma)
            });
        };
    }, [cotizacionActualizado]);

    //funciones   

    const generarDatos = () => {
        let arrayDatos = [];
        let objetoDatos;
        if (cotizacionActualizado) {

        } else {
            conceptos.forEach((concepto, index) => {
                objetoDatos = {
                    concepto,
                    total: 0,
                };
                arrayDatos.push(objetoDatos);
            });
        };
        setTableData(arrayDatos);
    };

    const calculosTabla = (tabla, update) => {
        const arrayTabla = [];
        let objetoFila = null;
        let sumCuerpo, unidades, sumPrecioMerma;
        if (cotizacionActualizado) {
            if (cotizacionCuerpo) {
                sumCuerpo = cotizacionCuerpo.sumCuerpo;
                sumPrecioMerma = cotizacionCuerpo.sumPrecioMerma;
            } else {
                sumCuerpo = cotizacionActualizado.sumCuerpo;
                sumPrecioMerma = cotizacionActualizado.sumPrecioMerma;
            };
            if (cotizacionCabecera) {
                unidades = cotizacionCabecera.unidades;
            } else {
                unidades = cotizacionActualizado.unidades;
            };
        } else {
            if (cotizacionCabecera && cotizacionCuerpo) {
                sumCuerpo = cotizacionCuerpo.sumCuerpo;
                unidades = cotizacionCabecera.unidades;
                sumPrecioMerma = cotizacionCuerpo.sumPrecioMerma;
            } else {
                sumCuerpo = 0;
                unidades = 0;
                sumPrecioMerma = 0;
            };
        };
        tabla.map((fila, index) => {
            objetoFila = { ...fila };
            switch (fila.concepto) {
                case "merma":
                    objetoFila.total = sumPrecioMerma * unidades;
                    break;
                default:
                    objetoFila.total = Number(fila.total);
                    objetoFila.concepto = _.deburr(fila.concepto).replaceAll(/[ .]/g, "_").toLowerCase();;
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
        let datosCotizacionFilasExtra = {};
        arrayTabla.forEach((fila, index) => {
            datosCotizacionFilasExtra[fila.concepto] = arrayTabla[index].total;
        });
        const sumLateralSup = arrayTabla.reduce((sum, { total }) => sum + total, 0);
        datosCotizacionUpdate.sumLateralSup = _.round(sumLateralSup, REDONDEADO);
        datosCotizacionUpdate.filasExtra = datosCotizacionFilasExtra;
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
        } else {
            if (!cell.getValue()) {
                const rowIndex = Number(cell.row.id);
                const columna = cell.column.id;
                if (cell.id.includes("concepto")) {
                    tabla[rowIndex][columna] = "";
                } else {
                    tabla[rowIndex][columna] = 0;
                };
                setTableData(tabla);
            };
        };
    };

    const retornaTotales = (table, columna) => {
        switch (columna) {
            case 'total':
                if (table.options.data[0].total > 0) {
                    const sumatorioTotales = table.options.data.reduce((sum, { total }) => sum + total, 0);
                    return (
                        <Typography variant="body1">
                            <span className="font-bold">
                                {`${formateado(sumatorioTotales)} €`}
                            </span>
                        </Typography>
                    )
                };
                break;
            default:
        };
    };

    const handleOpenNotedialog = (concepto) => {
        dispatch(openNoteDialog(conceptos[concepto]));
    };

    const anadirConcepto = () => {
        const arrayDatos = [...tableData];
        let objetoDatos = {
            concepto: '',
            total: 0,
        };
        arrayDatos.push(objetoDatos);
        setTableData(arrayDatos);
    };

    const borrarColumna = (id) => {
        const myArray = removeArrayByIndex(tableData, id);
        setTableData(myArray);
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

    const gestionCeldaTotales = (rowId, consulta) => {
        switch (consulta) {
            case 'click':
                if (totales.precio === 0) {
                    return false
                } else {
                    handleOpenNotedialog(rowId);
                };
                break;
            case 'pointer':
                if (totales.precio === 0) {
                    return 'none'
                } else {
                    if (rowId === 6) {
                        return 'none'
                    } else {
                        return 'auto'
                    };
                };
                break;
            case 'bg':
                if (totales.precio === 0) {
                    return 'white'
                } else {
                    return '#ebebeb'
                };
                break;
            case 'cursor':
                if (totales.precio === 0) {
                    return 'default'
                } else {
                    return 'pointer'
                };
                break;
            case 'color':
                if (totales.precio === 0) {
                    return '#959CA9'
                } else {
                    return '#111827'
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
            <Box className="flex flex-row items-center w-full pt-16 pb-12 px-24">
                <div className="flex flex-row gap-8">
                    <Typography className="text-[15px] font-bold">
                        Volumen total
                    </Typography>
                    <Typography variant="body1">
                        {`${formateado(totales.volumen)} m³`}
                    </Typography>
                </div>
            </Box>
            <div className="w-full">
                <Accordion
                    disableGutters
                    elevation={0}
                    square
                    className="border-y-1 pl-8"
                    disabled={true}
                >
                    <AccordionSummary
                        expandIcon={<FuseSvgIcon>heroicons-outline:chevron-down</FuseSvgIcon >}
                    >
                        <Typography className="font-bold text-[15px]">Conceptos extra</Typography>
                    </AccordionSummary>
                    <AccordionDetails className="p-0 !-ml-8">
                        <div className="flex justify-end">
                            <Button
                                onClick={anadirConcepto}
                                color="primary"
                                variant="outlained"
                                startIcon={<FuseSvgIcon size={20}>heroicons-outline:plus-circle</FuseSvgIcon>}
                                size="small"
                                className="-mb-12 mr-12 px-16"
                                disabled={totales.precio === 0 ? true : false}
                            >
                                Añadir concepto
                            </Button>
                        </div>
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
                                    muiTableBodyCellEditTextFieldProps: {
                                        autoFocus: true
                                    },
                                    muiTableBodyCellProps: ({ cell, table }) => ({
                                        onClick: () => Number(cell.row.id) > 6 && (table.setEditingCell(cell)),
                                        sx: {
                                            '&:hover': {
                                                backgroundColor: '#ebebeb',
                                            },
                                            backgroundColor: 'white',
                                            pointerEvents: Number(cell.row.id) > 6 ? "auto" : "none",
                                            paddingLeft: '24px'
                                        },
                                    }),
                                    Cell: ({ cell, row }) => (
                                        <Typography>
                                            <span className="font-bold text-[15px]">
                                                {_.capitalize(cell.getValue()).replaceAll("_", " ")}
                                            </span>
                                        </Typography>
                                    ),
                                    size: 50,
                                },
                                {
                                    header: '',
                                    accessorKey: 'total',
                                    enableSorting: false,
                                    enableColumnFilter: false,
                                    muiTableBodyCellEditTextFieldProps: {
                                        type: 'number',
                                        autoFocus: true
                                    },
                                    muiTableBodyCellProps: ({ cell, table }) => ({
                                        onClick: () => {
                                            if (Number(cell.row.id) <= 6) {
                                                gestionCeldaTotales(Number(cell.row.id), 'click');
                                            } else {
                                                clickCelda(cell, table);
                                            };
                                        },
                                        sx: {
                                            '&:hover': {
                                                backgroundColor: gestionCeldaTotales(Number(cell.row.id), 'bg'),
                                            },
                                            backgroundColor: 'white',
                                            cursor: gestionCeldaTotales(Number(cell.row.id), 'cursor'),
                                            color: gestionCeldaTotales(Number(cell.row.id), 'color'),
                                            pointerEvents: gestionCeldaTotales(Number(cell.row.id), 'pointer')
                                        },
                                    }),
                                    Cell: ({ cell, row }) => (
                                        <Typography
                                            variant="body1"
                                            color={cell.getValue() < 0 && "error"}
                                            className="whitespace-nowrap"
                                        >
                                            {`${formateado(cell.getValue())} €`}
                                        </Typography>
                                    ),
                                    size: 50,
                                }
                            ]}
                            data={tableData}
                            enableTopToolbar={false}
                            enableBottomToolbar={false}
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
                            }}
                            enableRowActions={true}
                            positionActionsColumn="last"
                            renderRowActions={({ row, table }) => (
                                <Box className="p-0 m-0">
                                    <Tooltip arrow placement="top-start" title="Borrar fila">
                                        <IconButton
                                            size='small'
                                            className={clsx(Number(row.id) < 7 && 'hidden')}
                                            onClick={() => borrarColumna(Number(row.id))}
                                        >
                                            <FuseSvgIcon>material-outline:delete</FuseSvgIcon>
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            )}
                        />
                    </AccordionDetails>
                </Accordion>
            </div>
            <Box className="flex flex-row items-center w-full py-16 px-24">
                <div className="flex flex-row gap-8">
                    <Typography className="text-[15px] font-bold">
                        Precio total
                    </Typography>
                    <Typography variant="body1">
                        {`${formateado(totales.precio)} €`}
                    </Typography>
                </div>
            </Box>
        </TableContainer>
    );
}

export default LateralSupCotizacion;
