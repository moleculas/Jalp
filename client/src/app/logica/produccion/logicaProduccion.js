import _ from '@lodash';
import moment from 'moment';
import format from 'date-fns/format';
import { es } from 'date-fns/locale';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Box from '@mui/material/Box';
import clsx from 'clsx';

//importación acciones
import { setSemanasAnyo } from 'app/redux/produccion/inicioSlice';
import { setAnadirFilaId } from 'app/redux/produccion/pedidoSlice';

export const decMesActual = () => (dispatch, getState) => {
    const mesActual = getState().produccionSeccion.inicio.produccion.mesActual;
    const mesSplt = _.split(mesActual.letra, '/');
    const mesNumSplt = _.split(mesActual.numero, '/');
    const mes = mesSplt[0];
    const anyo = Number(mesSplt[1]);
    const mesNumero = mesNumSplt[0];
    return { mes, anyo, mesNumero }
};

export const calculoSemanaAnyoActual = () => (dispatch, getState) => {
    const ahora = format(new Date(), 'MM-dd-yyyy');
    const weekNumber = moment(ahora, "MMDDYYYY").isoWeek();
    return weekNumber
};

export const calculoSemanasAnyo = () => (dispatch, getState) => {
    const semanas = [];
    const { anyo } = dispatch(decMesActual());
    let diaActual = moment([anyo, 1]).startOf('year');
    let semanasEnAnyo = moment(`${anyo}-01-01`).isoWeeksInYear();
    for (let numeroSemana = 1; numeroSemana <= semanasEnAnyo + 1; numeroSemana++) {
        let lunes = moment(diaActual).startOf('isoweek');
        if (moment(lunes).year() === anyo) {
            let nombre = format(new Date(lunes.toDate()), 'dd/MMM', { locale: es });
            let mes = format(new Date(lunes.toDate()), 'MMMM', { locale: es });
            semanas.push({ numeroSemana: semanas.length + 1, nombre, mes });
        };
        diaActual = moment(diaActual).add(7, 'days');
    };
    dispatch(setSemanasAnyo(semanas));
};

export const obtenerMesAnterior = (mes, anyo) => (dispatch, getState) => {
    const menos1Mes = moment([anyo, mes, 1]).subtract(2, "month")._d;
    const mesAnterior = format(new Date(menos1Mes), 'MMMM', { locale: es });
    const anyoAnterior = format(new Date(menos1Mes), 'yyyy');
    return { mesAnterior, anyoAnterior }
};

export const calculoSemanasPeriodo = (periodo) => (dispatch, getState) => {
    const semanasAnyo = getState().produccionSeccion.inicio.semanasAnyo;
    const { mes } = dispatch(decMesActual());
    let semanas;
    switch (periodo) {
        case 1:
            semanas = semanasAnyo.filter(semana => semana.mes === mes);
            return semanas
            break;
        case 3:
            if (mes === 'enero' || mes === 'febrero' || mes === 'marzo') {
                semanas = semanasAnyo.filter(semana => {
                    return semana.mes === 'enero' || semana.mes === 'febrero' || semana.mes === 'marzo'
                });
            };
            if (mes === 'abril' || mes === 'mayo' || mes === 'junio') {
                semanas = semanasAnyo.filter(semana => {
                    return semana.mes === 'abril' || semana.mes === 'mayo' || semana.mes === 'junio'
                });
            };
            if (mes === 'julio' || mes === 'agosto' || mes === 'septiembre') {
                semanas = semanasAnyo.filter(semana => {
                    return semana.mes === 'julio' || semana.mes === 'agosto' || semana.mes === 'septiembre'
                });
            };
            if (mes === 'octubre' || mes === 'noviembre' || mes === 'diciembre') {
                semanas = semanasAnyo.filter(semana => {
                    return semana.mes === 'octubre' || semana.mes === 'noviembre' || semana.mes === 'diciembre'
                });
            };
            return semanas
            break;
        case 6:
            if (mes === 'enero' || mes === 'febrero' || mes === 'marzo' || mes === 'abril' || mes === 'mayo' || mes === 'junio') {
                semanas = semanasAnyo.filter(semana => {
                    return semana.mes === 'enero' || semana.mes === 'febrero' || semana.mes === 'marzo' || semana.mes === 'abril' || semana.mes === 'mayo' || semana.mes === 'junio'
                });
            };
            if (mes === 'julio' || mes === 'agosto' || mes === 'septiembre' || mes === 'octubre' || mes === 'noviembre' || mes === 'diciembre') {
                semanas = semanasAnyo.filter(semana => {
                    return semana.mes === 'julio' || semana.mes === 'agosto' || semana.mes === 'septiembre' || semana.mes === 'octubre' || semana.mes === 'noviembre' || semana.mes === 'diciembre'
                });
            };
            return semanas
            break;
        case 12:
            semanas = semanasAnyo;
            return semanas
            break;
        default:
    };
};

export const calculoSemanasPeriodoMesConcreto = (mes) => (dispatch, getState) => {
    const semanasAnyo = getState().produccionSeccion.inicio.semanasAnyo;
    let semanas = semanasAnyo.filter(semana => semana.mes === mes);
    return semanas
};

export const generarPropsTabla = (enableHiding, enableColumnActions, titulo1, titulo2, pinning, chip, idButton) => (dispatch, getState) => {
    const tableProps = {
        enableDensityToggle: false,
        enableColumnResizing: false,
        enableFullScreenToggle: false,
        enableGlobalFilter: false,
        enablePagination: false,
        enableFilters: false,
        enableHiding: enableHiding,
        enableColumnActions: enableColumnActions,
        initialState: { density: 'spacious', columnPinning: { left: pinning } },
        enableEditing: true,
        editingMode: "cell",
        muiTableHeadRowProps: {
            sx: {
                backgroundColor: 'white',
                cursor: 'default'
            },
        },
        muiTableFooterRowProps: {
            sx: {
                backgroundColor: 'white',
                cursor: 'default'
            },
        },
        muiTopToolbarProps: {
            sx: {
                backgroundColor: 'white',
                borderBottom: '1px solid #e2e8f0',
            },
        },
        muiTableBodyRowProps: {
            sx: {
                backgroundColor: 'white',
            },
        },
        muiTableBodyCellProps: {
            sx: {
                cursor: 'default',
            },
        },
        muiBottomToolbarProps: {
            sx: {
                backgroundColor: 'white',
                minHeight: '25px',
            },
        },
        muiTableHeadCellProps: {
            sx: {
                fontSize: '1.5rem',
                fontWeight: 700,
            },
        },
        displayColumnDefOptions: {
            'mrt-row-actions': {
                muiTableHeadCellProps: {
                    sx: {
                        paddingLeft: '24px',
                        fontSize: '1.5rem',
                        fontWeight: 700,
                    },
                },
                size: 10
            },
        },
        localization: {
            actions: 'Ac',
            cancel: 'Cancelar',
            changeFilterMode: 'Cambia el modo de filtro',
            clearFilter: 'Filtro claro',
            clearSearch: 'Borrar búsqueda',
            clearSort: 'Resetear orden',
            edit: 'Editar',
            expand: 'Expandir',
            expandAll: 'Expandir todo',
            hideAll: 'Ocultar todo',
            hideColumn: 'Ocultar columna {column}',
            rowActions: 'Acciones de fila',
            save: 'Guardar',
            showAll: 'Mostrar todo',
            showAllColumns: 'Mostrar todas las columnas',
            showHideColumns: 'Mostrar/Ocultar columnas',
            sortByColumnAsc: 'Ordenar ascendente {column} ',
            sortByColumnDesc: 'Ordenar descendente {column} ',
            sortedByColumnAsc: 'Ordenado ascendente {column} ',
            sortedByColumnDesc: 'Ordenado descendente {column} ',
            unsorted: 'No ordenado',
            resetOrder: 'Resetear orden',
            move: 'Mover',
            columnActions: 'Acciones columna'
        },
        renderTopToolbarCustomActions: ({ table }) => {
            return (
                <div className='w-full'>
                    <div className='px-20 mt-12 pb-16 flex flex-col sm:flex-row flex-1 items-start justify-between'>
                        <div>
                            <Typography className="text-lg font-medium tracking-tight leading-6 truncate">
                                {titulo1}
                            </Typography>
                            <Typography
                                className="text-sm leading-none"
                                color="text.secondary"
                            >
                                {titulo2}
                            </Typography>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center">
                            {idButton && (
                                <div className={clsx(
                                    idButton.type === 'pedido' && 'md:-mb-16 mt-12 md:mt-0 mr-12'
                                )}
                                >
                                    <Button
                                        onClick={() => idButton.type === 'pedido' && dispatch(setAnadirFilaId(idButton.id))}
                                        color="primary"
                                        variant="outlained"
                                        startIcon={<FuseSvgIcon size={20}>heroicons-outline:plus-circle</FuseSvgIcon>}
                                        size="small"
                                        sx={{
                                            paddingX: 2
                                        }}
                                        disabled={idButton.disabled}
                                    >
                                        Añadir fila
                                    </Button>
                                </div>
                            )}
                            {chip && (
                                <div className='mb:12 md:-mb-16 mt-12 md:mt-0'>
                                    <Chip size="small" color="secondary" className="font-medium text-sm px-6" label={chip} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            );
        },
    };
    return tableProps
};

export const TabPanel = (props) => {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box>
                    <div>{children}</div>
                </Box>
            )}
        </div>
    );
};