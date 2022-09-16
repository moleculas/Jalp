import Paper from '@mui/material/Paper';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import _ from '@lodash';
import MaterialReactTable from 'material-react-table';
import TableContainer from '@mui/material/TableContainer';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Typography from '@mui/material/Typography';

//importacion acciones
import { generarPropsTabla, decMesActual } from 'app/logica/produccion/logicaProduccion';
import {
    selectDatosProduccionInicial,
    selectDatosProduccionSaldo,
    updateProduccionTabla
} from 'app/redux/produccion/produccionSlice';
import { showMessage } from 'app/redux/fuse/messageSlice';

function PanelProduccion1(props) {
    const { columnas, semanas, mesActual, datosTabla, datosPalet, producto } = props;
    const dispatch = useDispatch();
    const datosProduccionInicial = useSelector(selectDatosProduccionInicial);
    const datosProduccionSaldo = useSelector(selectDatosProduccionSaldo);
    const [tableColumns, setTableColumns] = useState(null);
    const [tableData, setTableData] = useState(null);

    //useEffect  

    useEffect(() => {
        if (columnas) {
            generarColumnas(columnas);
        };
    }, []);

    useEffect(() => {
        if (tableColumns) {
            setTableData(null);
            generarDatos();
        };
    }, [tableColumns, datosTabla]);

    useEffect(() => {
        if (tableColumns && tableData && datosProduccionInicial && datosProduccionSaldo) {
            calculosTabla(tableData);
        };
    }, [datosProduccionInicial]);

    //funciones

    const calculosTabla = (tabla) => {
        const { mes } = dispatch(decMesActual());
        let sumatorioSaldoInicial = (datosProduccionInicial.stockInicial / producto.unidades) + datosProduccionSaldo.saldoInicial;
        let sumatorioSaldo = 0;
        let objetoFila = null;
        const arrayTabla = [];
        tabla.map((fila, index) => {
            if (semanas[index].mes === mes) {
                objetoFila = { ...fila };
                objetoFila.mp_u_f = Number(objetoFila.serfocat) + Number(objetoFila.masova) + Number(objetoFila.faucher) + Number(objetoFila.sala);
                objetoFila.saldo = Number(sumatorioSaldoInicial) + sumatorioSaldo + Number(objetoFila.mp_u_f) - Number(objetoFila.palets);
                sumatorioSaldo = objetoFila.saldo - sumatorioSaldoInicial;
                arrayTabla.push(objetoFila);
            };
        });
        const datosTablaUpdate = arrayTabla.map(({ serfocat, masova, faucher, sala, mp_u_f, saldo }, index) => ({
            _id: datosTabla[index]._id,
            serfocat,
            masova,
            faucher,
            sala,
            mp_u_f,
            saldo
        }));
        const datosPaletUpdate = arrayTabla.map(({ palets }, index) => ({
            _id: datosPalet[index]._id,
            palets
        }));
        setTableData(arrayTabla);
        dispatch(updateProduccionTabla({ datosTabla: datosTablaUpdate, datosPalet: datosPaletUpdate }));
    };

    const generarColumnas = (columnas) => {
        const arrayColumnas = [];
        let objeto = {};
        columnas.map((columna, index) => {
            objeto = {
                header: columna.nombre,
                accessorKey: _.deburr(columna.nombre).replaceAll(/[ .]/g, "_").toLowerCase(),
                muiTableBodyCellEditTextFieldProps: {
                    type: index !== 0 && 'number',
                },
                Header: ({ column }) => (
                    <div className='flex flex-row items-center'>
                        {columna.tipo === 'input' && <FuseSvgIcon className="mr-4" size={20}>material-outline:edit_note</FuseSvgIcon>}
                        <div>
                            {column.columnDef.header}
                        </div>
                    </div>
                ),
                Cell: ({ cell, row }) => (
                    <div className='flex flex-row items-center'>
                        {index === 0 && <FuseSvgIcon className="mr-8" size={22}>heroicons-outline:calendar</FuseSvgIcon>}
                        <Typography
                            variant="body1"
                            className="truncate"
                            color={cell.getValue() < 0 && "error"}
                        >
                            {cell.getValue()}
                        </Typography>
                    </div>
                ),
                size: 75,
            };
            columna.tipo === 'texto' && (objeto['enableEditing'] = false);
            arrayColumnas.push(objeto);
        });
        setTableColumns(arrayColumnas);
    };

    const generarDatos = () => {
        const arrayDatos = [];
        semanas.map((semana, indexS) => {
            let objeto = {};
            tableColumns.map((columna, indexT) => {
                if (indexT === 0) {
                    objeto = { ...objeto, [columna[Object.keys(columna)[1]]]: `Sem: ${semana.numeroSemana} - ${semana.nombre}` };
                } else {
                    if (columna.accessorKey === "palets") {
                        objeto = {
                            ...objeto,
                            [columna[Object.keys(columna)[1]]]: datosPalet[indexS][columna[Object.keys(columna)[1]]] ? datosPalet[indexS][columna[Object.keys(columna)[1]]] : 0
                        };
                    } else {
                        objeto = {
                            ...objeto,
                            [columna[Object.keys(columna)[1]]]: datosTabla[indexS][columna[Object.keys(columna)[1]]] ? datosTabla[indexS][columna[Object.keys(columna)[1]]] : 0
                        };
                    };
                };
            });
            arrayDatos.push(objeto);
        });
        setTableData(arrayDatos);
    };

    const handleSaveRow = ({ exitEditingMode, row, values }) => {
        for (const key in values) {
            if (values[key] === '') {
                values[key] = 0;
            };
        };
        const tabla = [...tableData];
        tabla[row.index] = values;
        calculosTabla(tabla);
        exitEditingMode();
    };

    const retornaSx = (periodo) => {
        const periodoSplt = _.split(periodo, '/');
        const mes1 = periodoSplt[1];
        const mes2 = mesActual.slice(0, 3);
        let sxRetornar = null;
        if (mes1 === mes2) {
            sxRetornar = {
                backgroundColor: '#f1efef'
            }
        } else {
            sxRetornar = {
                '& button': {
                    pointerEvents: 'none',
                    color: '#cac8c8'
                },
                backgroundColor: 'white'
            }
        };
        return sxRetornar
    };

    if (!tableData) {
        return null
    };

    return (
        <TableContainer component={Paper} className="rounded-2xl">
            <MaterialReactTable
                {...dispatch(generarPropsTabla(true, true, 'Tabla cálculos producción', '', null, null))}
                columns={tableColumns}
                data={tableData}
                onEditingRowSave={handleSaveRow}
                muiTableBodyRowProps={({ row }) => ({
                    onClickCapture: (event) => {
                        if (datosProduccionInicial.stockInicial === 0 || datosProduccionSaldo.saldoInicial === 0) {
                            let mensaje;
                            if (datosProduccionInicial.stockInicial === 0 && datosProduccionSaldo.saldoInicial !== 0) {
                                mensaje = "Falta rellenar los datos Stock inicial";
                            } else if (datosProduccionInicial.stockInicial !== 0 && datosProduccionSaldo.saldoInicial === 0) {
                                mensaje = "Falta rellenar los datos Saldo inicial";
                            } else {
                                mensaje = "Falta rellenar los datos Stock inicial y Saldo inicial";
                            };
                            dispatch(showMessage({ message: mensaje, variant: "warning" }));
                            event.preventDefault();
                            event.stopPropagation();
                        };
                    },
                    sx: semanas.length > 5 ? retornaSx(row.getValue('periodo')) : { backgroundColor: 'white' }
                })}
            />
            {/* {console.log(tableColumns)} */}
        </TableContainer>
    );
}

export default PanelProduccion1;
