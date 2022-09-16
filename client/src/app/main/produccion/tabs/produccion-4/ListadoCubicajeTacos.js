import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import Table from '@mui/material/Table';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { IconButton } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import Checkbox from '@mui/material/Checkbox';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import _ from '@lodash';
import { motion } from 'framer-motion';

//importacion acciones
import {
    selectEscandallo,
    getEscandallo,
    setOpenFormEscandallo
} from 'app/redux/produccion/escandalloSlice';

const rows = [
    {
        id: 'madera',
        align: 'left',
        disablePadding: false,
        label: 'Madera',
        width: '55%'
    },
    {
        id: 'unidades',
        align: 'left',
        disablePadding: false,
        label: 'Unidades',
        width: '20%'
    },
    {
        id: 'cubico',
        align: 'left',
        disablePadding: false,
        label: 'Cúbico',
        width: '20%'
    }
];

const getHeight = () => (window.innerHeight) || (document.documentElement.clientHeight) || (document.body.clientHeight);

function ListadoCubicajeTacos() {
    const dispatch = useDispatch();
    const escandallo = useSelector(selectEscandallo);
    const [openPatines, setOpenPatines] = useState(true);
    const [openTacos, setOpenTacos] = useState(true);
    const [openPalets, setOpenPalets] = useState(true);
    const [height, setHeight] = useState(getHeight());
    const [varsEscandallo, setVarsEscandallo] = useState(null);
    const item1 = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { delay: 0.1 } },
    };

    //useEffect

    useEffect(() => {
        if (!escandallo) {
            dispatch(getEscandallo());
        } else {
            calculoVariablesEscandallo();
        };
    }, [escandallo]);

    useEffect(() => {
        const resizeListener = () => {
            setHeight(getHeight());
        };
        window.addEventListener('resize', resizeListener);
        return () => {
            window.removeEventListener('resize', resizeListener);
        }
    }, []);

    //funciones

    const calculoVariablesEscandallo = () => {
        let arrayPatines = [];
        escandallo.arrayPatines.forEach((patin) => {
            arrayPatines.push(patin.cubico);
        });
        let arrayPatinDerecho = [];
        escandallo.arrayPatinDerecho.forEach((patin) => {
            arrayPatinDerecho.push(patin.cubico);
        });
        arrayPatinDerecho.push(escandallo.mermaPatinDerecho.cubico);
        let arrayPatinIzquierdo = [];
        escandallo.arrayPatinIzquierdo.forEach((patin) => {
            arrayPatinIzquierdo.push(patin.cubico);
        });
        arrayPatinIzquierdo.push(escandallo.mermaPatinIzquierdo.cubico);
        let arrayPatinCentral = [];
        escandallo.arrayPatinCentral.forEach((patin) => {
            arrayPatinCentral.push(patin.cubico);
        });
        arrayPatinCentral.push(escandallo.mermaPatinCentral.cubico);
        let arrayPalets = [];
        escandallo.arrayPalets.forEach((palet) => {
            arrayPalets.push(palet.cubico);
        });
        let objetoEscandallo = {
            arrayPatines,
            arrayPatinDerecho,
            arrayPatinIzquierdo,
            arrayPatinCentral,
            arrayPalets
        };
        setVarsEscandallo(objetoEscandallo);
    };

    const calculoCasillas = (posicion) => {
        let sumatorioPd, sumatorioPi, sumatorioPc, sumatorioPa, sumatorioPl, sumatorioTotal;
        switch (posicion) {
            case 'pd':
                sumatorioPd = varsEscandallo.arrayPatinDerecho.reduce((a, b) => a + b, 0);
                return sumatorioPd > 0 ? `${_.round(sumatorioPd, 4)} m³` : null;
                break;
            case 'pi':
                sumatorioPi = varsEscandallo.arrayPatinIzquierdo.reduce((a, b) => a + b, 0);
                return sumatorioPi > 0 ? `${_.round(sumatorioPi, 4)} m³` : null;
                break;
            case 'pc':
                sumatorioPc = varsEscandallo.arrayPatinCentral.reduce((a, b) => a + b, 0);
                return sumatorioPc > 0 ? `${_.round(sumatorioPc, 4)} m³` : null;
                break;
            case 'ta':
                sumatorioPd = varsEscandallo.arrayPatinDerecho.reduce((a, b) => a + b, 0);
                sumatorioPc = varsEscandallo.arrayPatinCentral.reduce((a, b) => a + b, 0);
                sumatorioTotal = sumatorioPd + sumatorioPc + varsEscandallo.arrayPatinIzquierdo[0];
                return sumatorioTotal > 0 ? `${_.round(sumatorioTotal, 4)} m³` : null;
                break;
            case 'pa':
                sumatorioPa = varsEscandallo.arrayPatines.reduce((a, b) => a + b, 0);
                sumatorioPd = varsEscandallo.arrayPatinDerecho.reduce((a, b) => a + b, 0);
                sumatorioPc = varsEscandallo.arrayPatinCentral.reduce((a, b) => a + b, 0);
                sumatorioTotal = sumatorioPa + sumatorioPd + sumatorioPc + varsEscandallo.arrayPatinIzquierdo[0];
                return sumatorioTotal > 0 ? `${_.round(sumatorioTotal, 4)} m³` : null;
                break;
            case 'pl':
                sumatorioPl = varsEscandallo.arrayPalets.reduce((a, b) => a + b, 0);
                return sumatorioPl > 0 ? `${_.round(sumatorioPl, 4)} m³` : null;
                break;
            case 'to':
                sumatorioPa = varsEscandallo.arrayPatines.reduce((a, b) => a + b, 0);
                sumatorioPd = varsEscandallo.arrayPatinDerecho.reduce((a, b) => a + b, 0);
                sumatorioPc = varsEscandallo.arrayPatinCentral.reduce((a, b) => a + b, 0);
                sumatorioPl = varsEscandallo.arrayPalets.reduce((a, b) => a + b, 0);
                sumatorioTotal = sumatorioPa + sumatorioPd + sumatorioPc + sumatorioPl + varsEscandallo.arrayPatinIzquierdo[0]
                return sumatorioTotal > 0 ? `${_.round(sumatorioTotal, 4)} m³` : null;
                break;
            default:
        }
    };

    const handleCheckin = (event) => {
        let objetoEscandallo = { ...varsEscandallo };
        let arrayTraspaso = [];
        const nameSplt = _.split(event.target.name, '-');
        if (nameSplt[1]) {
            if (!event.target.checked) {
                objetoEscandallo[nameSplt[0]][nameSplt[1]] = 0;
            } else {
                if (nameSplt[2]) {
                    switch (nameSplt[0]) {
                        case "arrayPatinDerecho":
                            objetoEscandallo[nameSplt[0]][nameSplt[1]] = escandallo.mermaPatinDerecho.cubico;
                            break;
                        case "arrayPatinIzquierdo":
                            objetoEscandallo[nameSplt[0]][nameSplt[1]] = escandallo.mermaPatinIzquierdo.cubico;
                            break;
                        case "arrayPatinCentral":
                            objetoEscandallo[nameSplt[0]][nameSplt[1]] = escandallo.mermaPatinCentral.cubico;
                            break;
                        default:
                    };
                } else {
                    objetoEscandallo[nameSplt[0]][nameSplt[1]] = escandallo[nameSplt[0]][nameSplt[1]].cubico;
                };
            };
        } else {
            switch (nameSplt[0]) {
                case 'patinDerecho':
                    if (!event.target.checked) {
                        objetoEscandallo.arrayPatinDerecho.forEach((patin) => {
                            arrayTraspaso.push(0);
                        });
                    } else {
                        objetoEscandallo.arrayPatinDerecho.forEach((patin, index) => {
                            if (index + 1 < escandallo['arrayPatinDerecho'].length) {
                                arrayTraspaso.push(escandallo['arrayPatinDerecho'][index].cubico);
                            } else {
                                arrayTraspaso.push(escandallo.mermaPatinDerecho.cubico);
                            };
                        });
                    };
                    objetoEscandallo.arrayPatinDerecho = arrayTraspaso;
                    break;
                case 'patinIzquierdo':
                    if (!event.target.checked) {
                        objetoEscandallo.arrayPatinIzquierdo.forEach((patin) => {
                            arrayTraspaso.push(0);
                        });
                    } else {
                        objetoEscandallo.arrayPatinIzquierdo.forEach((patin, index) => {
                            if (index + 1 < escandallo['arrayPatinIzquierdo'].length) {
                                arrayTraspaso.push(escandallo['arrayPatinIzquierdo'][index].cubico);
                            } else {
                                arrayTraspaso.push(escandallo.mermaPatinIzquierdo.cubico);
                            };
                        });
                    };
                    objetoEscandallo.arrayPatinIzquierdo = arrayTraspaso;
                    break;
                case 'patinCentral':
                    if (!event.target.checked) {
                        objetoEscandallo.arrayPatinCentral.forEach((patin) => {
                            arrayTraspaso.push(0);
                        });
                    } else {
                        objetoEscandallo.arrayPatinCentral.forEach((patin, index) => {
                            if (index + 1 < escandallo['arrayPatinCentral'].length) {
                                arrayTraspaso.push(escandallo['arrayPatinCentral'][index].cubico);
                            } else {
                                arrayTraspaso.push(escandallo.mermaPatinCentral.cubico);
                            };
                        });
                    };
                    objetoEscandallo.arrayPatinCentral = arrayTraspaso;
                    break;
                default:
            };
        };
        setVarsEscandallo(objetoEscandallo);
    };

    const retornaChecked = (name) => {
        let sumatorioPd, sumatorioPc;
        const nameSplt = _.split(name, '-');
        if (nameSplt[1]) {
            if (varsEscandallo[nameSplt[0]][nameSplt[1]]) {
                return true
            } else {
                return false
            };
        } else {
            switch (nameSplt[0]) {
                case 'patinDerecho':
                    sumatorioPd = varsEscandallo.arrayPatinDerecho.reduce((a, b) => a + b, 0);
                    if (sumatorioPd > 0) {
                        return true
                    } else {
                        return false
                    };
                    break;
                case 'patinIzquierdo':
                    if (varsEscandallo.arrayPatinIzquierdo[0]) {
                        return true
                    } else {
                        return false
                    };
                    break;
                case 'patinCentral':
                    sumatorioPc = varsEscandallo.arrayPatinCentral.reduce((a, b) => a + b, 0);
                    if (sumatorioPc > 0) {
                        return true
                    } else {
                        return false
                    };
                    break;
                default:
            };
        };
    };

    if (!escandallo || !varsEscandallo) {
        return null
    };

    return (
        <div className="flex flex-wrap w-full p-12">
            <div className="flex flex-col sm:flex-row flex-1 items-center px-12 justify-between mb-24 space-y-16 sm:space-y-0">
                <div>
                    <Typography className="text-2xl font-extrabold tracking-tight leading-tight">
                        Escandallo LX Pino
                    </Typography>
                    <div className="mt-2 font-medium">
                        <Typography>Datos según producción.</Typography>
                    </div>
                </div>
                <Button
                    className="mx-8 whitespace-nowrap"
                    variant="contained"
                    color="secondary"
                    onClick={() => dispatch(setOpenFormEscandallo(true))}
                >
                    <FuseSvgIcon size={20}>heroicons-outline:pencil</FuseSvgIcon>
                    <span className="mx-8">Editar datos</span>
                </Button>
            </div>
            <motion.div variants={item1} className="w-full flex flex-col">
                <TableContainer component={Paper} className="rounded-2xl" sx={{
                    maxHeight: {
                        md: height - 390,
                    }
                }}>
                    <Table stickyHeader className="w-full" aria-labelledby="tableTitle">
                        <TableHead>
                            <TableRow className="w-full">
                                <TableCell colSpan={4} padding="none">
                                    <Table>
                                        <TableBody>
                                            {/* <TableRow className="h-36" sx={{ backgroundColor: (theme) => lighten(theme.palette.background.default, 0.4) }}> */}
                                            <TableRow className="h-36 bg-white">
                                                <TableCell
                                                    padding="none"
                                                    className="w-64"
                                                >
                                                </TableCell>
                                                {rows.map((row) => {
                                                    return (
                                                        <TableCell
                                                            sx={{ width: row.width }}
                                                            className="p-4 font-semibold"
                                                            key={row.id}
                                                            align={row.align}
                                                            padding={row.disablePadding ? 'none' : 'normal'}
                                                            sortDirection={false}
                                                        >
                                                            {row.label}
                                                        </TableCell>
                                                    );
                                                }, this)}
                                            </TableRow>
                                            <TableRow className="h-48 bg-gray-100 w-full">
                                                <TableCell className="w-64 flex flex-row items-center justify-center p-24">
                                                </TableCell>
                                                <TableCell className="p-4" component="th" scope="row">
                                                    <Typography
                                                        className="text-16 whitespace-nowrap font-bold"
                                                        sx={{ color: !calculoCasillas('to') && 'text.disabled' }}
                                                    >
                                                        Cubicaje (total)
                                                    </Typography>
                                                </TableCell>
                                                <TableCell className="p-4" component="th" scope="row">
                                                </TableCell>
                                                <TableCell className="p-4" component="th" scope="row">
                                                    <Typography className="text-15 whitespace-nowrap font-bold">
                                                        {calculoCasillas('to')}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow className="h-36 bg-gray-50 w-full">
                                <TableCell className="w-64 flex flex-row items-center justify-center p-6">
                                    <IconButton
                                        size="small"
                                        onClick={() => setOpenPatines(!openPatines)}
                                        sx={{ color: !calculoCasillas('pa') && 'text.disabled' }}
                                    >
                                        {openPatines ? <FuseSvgIcon>heroicons-outline:chevron-up</FuseSvgIcon> : <FuseSvgIcon>heroicons-outline:chevron-down</FuseSvgIcon>}
                                    </IconButton>
                                </TableCell>
                                <TableCell className="p-4" sx={{ width: '55%' }} component="th" scope="row">
                                    <Typography
                                        className="text-16 whitespace-nowrap font-bold"
                                        sx={{ color: !calculoCasillas('pa') && 'text.disabled' }}
                                    >
                                        Patines (total)
                                    </Typography>
                                </TableCell>
                                <TableCell className="p-4" sx={{ width: '20%' }} component="th" scope="row">
                                </TableCell>
                                <TableCell className="p-4" sx={{ width: '20%' }} component="th" scope="row">
                                    {calculoCasillas('pa')}
                                </TableCell>
                            </TableRow>
                            <TableRow className="w-full">
                                <TableCell colSpan={4} padding="none">
                                    <Collapse in={openPatines} timeout="auto" unmountOnExit>
                                        <Table>
                                            <TableBody>
                                                {escandallo.arrayPatines.map((patin, index) => {
                                                    return (
                                                        <TableRow
                                                            className="h-36"
                                                            hover
                                                            key={'aP' + index}
                                                            padding="none"
                                                        >
                                                            <TableCell className="w-64 flex flex-row items-center justify-center p-6">
                                                                <Checkbox
                                                                    color="primary"
                                                                    size="small"
                                                                    name={'arrayPatines-' + index}
                                                                    checked={retornaChecked('arrayPatines-' + index)}
                                                                    onChange={handleCheckin}
                                                                />
                                                            </TableCell>
                                                            <TableCell
                                                                sx={{ width: '55%', color: !varsEscandallo.arrayPatines[index] && 'text.disabled' }}
                                                                className="p-4"
                                                                component="th"
                                                                scope="row"
                                                            >
                                                                {patin.nombre}
                                                            </TableCell>
                                                            <TableCell sx={{ width: '20%' }} className="p-4" component="th" scope="row">
                                                                {varsEscandallo.arrayPatines[index] ? patin.unidades : null}
                                                            </TableCell>
                                                            <TableCell sx={{ width: '20%' }} className="p-4" component="th" scope="row">
                                                                {varsEscandallo.arrayPatines[index] ? `${varsEscandallo.arrayPatines[index]} m³` : null}
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                                <TableRow className="h-36 bg-gray-50">
                                                    <TableCell className="w-64 flex flex-row items-center justify-center p-6">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => setOpenTacos(!openTacos)}
                                                            sx={{ color: !calculoCasillas('ta') && 'text.disabled' }}
                                                        >
                                                            {openTacos ? <FuseSvgIcon>heroicons-outline:chevron-up</FuseSvgIcon> : <FuseSvgIcon>heroicons-outline:chevron-down</FuseSvgIcon>}
                                                        </IconButton>
                                                    </TableCell>
                                                    <TableCell className="p-4" component="th" scope="row">
                                                        <Typography
                                                            className="text-16 whitespace-nowrap font-bold"
                                                            sx={{ color: !calculoCasillas('ta') && 'text.disabled' }}
                                                        >
                                                            Tacos (total)
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell className="p-4" component="th" scope="row">
                                                    </TableCell>
                                                    <TableCell className="p-4" component="th" scope="row">
                                                        {calculoCasillas('ta')}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell colSpan={4} padding="none">
                                                        <Collapse in={openTacos} timeout="auto" unmountOnExit>
                                                            <Table>
                                                                <TableBody>
                                                                    <TableRow
                                                                        hover
                                                                        className="h-36"
                                                                    >
                                                                        <TableCell className="w-64 flex flex-row items-center justify-center p-6 ml-24">
                                                                            <Checkbox
                                                                                color="primary"
                                                                                size="small"
                                                                                name='patinDerecho'
                                                                                checked={retornaChecked('patinDerecho')}
                                                                                onChange={handleCheckin}
                                                                            />
                                                                        </TableCell>
                                                                        <TableCell sx={{ width: '51%' }} className="p-4" component="th" scope="row">
                                                                            <Typography
                                                                                sx={{ color: !calculoCasillas('pd') && 'text.disabled' }}
                                                                                className="text-15 whitespace-nowrap font-bold"
                                                                            >
                                                                                Patín derecho
                                                                            </Typography>
                                                                        </TableCell>
                                                                        <TableCell sx={{ width: '20%' }} className="p-4" component="th" scope="row">
                                                                        </TableCell>
                                                                        <TableCell sx={{ width: '20%' }} className="p-4" component="th" scope="row">
                                                                            {calculoCasillas('pd')}
                                                                        </TableCell>
                                                                    </TableRow>
                                                                    {escandallo.arrayPatinDerecho.map((patin, index) => {
                                                                        return (
                                                                            <TableRow
                                                                                className="h-36"
                                                                                hover
                                                                                key={'aPD' + index}
                                                                                padding="none"
                                                                            >
                                                                                <TableCell className="w-64 flex flex-row items-center justify-center p-6 ml-24">
                                                                                    <Checkbox
                                                                                        color="primary"
                                                                                        size="small"
                                                                                        name={'arrayPatinDerecho-' + index}
                                                                                        checked={retornaChecked('arrayPatinDerecho-' + index)}
                                                                                        onChange={handleCheckin}
                                                                                    />
                                                                                </TableCell>
                                                                                <TableCell
                                                                                    sx={{ color: !varsEscandallo.arrayPatinDerecho[index] && 'text.disabled' }}
                                                                                    className="p-4"
                                                                                    component="th"
                                                                                    scope="row"
                                                                                >
                                                                                    {patin.nombre}
                                                                                </TableCell>
                                                                                <TableCell className="p-4" component="th" scope="row">
                                                                                    {varsEscandallo.arrayPatinDerecho[index] ? patin.unidades : null}
                                                                                </TableCell>
                                                                                <TableCell className="p-4" component="th" scope="row">
                                                                                    {varsEscandallo.arrayPatinDerecho[index] ? `${varsEscandallo.arrayPatinDerecho[index]} m³` : null}
                                                                                </TableCell>
                                                                            </TableRow>
                                                                        );
                                                                    })}
                                                                    <TableRow
                                                                        className="h-36"
                                                                        hover
                                                                        key={'aPD' + (varsEscandallo.arrayPatinDerecho.length - 1)}
                                                                        padding="none"
                                                                    >
                                                                        <TableCell className="w-64 flex flex-row items-center justify-center p-6 ml-24">
                                                                            <Checkbox
                                                                                color="primary"
                                                                                size="small"
                                                                                name={'arrayPatinDerecho-' + (varsEscandallo.arrayPatinDerecho.length - 1) + '-merma'}
                                                                                checked={retornaChecked('arrayPatinDerecho-' + (varsEscandallo.arrayPatinDerecho.length - 1))}
                                                                                onChange={handleCheckin}
                                                                            />
                                                                        </TableCell>
                                                                        <TableCell
                                                                            sx={{ color: !varsEscandallo.arrayPatinDerecho[varsEscandallo.arrayPatinDerecho.length - 1] && 'text.disabled' }}
                                                                            className="p-4"
                                                                            component="th"
                                                                            scope="row"
                                                                        >
                                                                            Merma patín derecho
                                                                        </TableCell>
                                                                        <TableCell className="p-4" component="th" scope="row">
                                                                        </TableCell>
                                                                        <TableCell className="p-4" component="th" scope="row">
                                                                            {varsEscandallo.arrayPatinDerecho[varsEscandallo.arrayPatinDerecho.length - 1] ? `${varsEscandallo.arrayPatinDerecho[varsEscandallo.arrayPatinDerecho.length - 1]} m³` : null}
                                                                        </TableCell>
                                                                    </TableRow>
                                                                    <TableRow
                                                                        hover
                                                                        className="h-36"
                                                                    >
                                                                        <TableCell className="w-64 flex flex-row items-center justify-center p-6 ml-24">
                                                                            <Checkbox
                                                                                color="primary"
                                                                                size="small"
                                                                                name='patinIzquierdo'
                                                                                checked={retornaChecked('patinIzquierdo')}
                                                                                onChange={handleCheckin}
                                                                            />
                                                                        </TableCell>
                                                                        <TableCell className="p-4" component="th" scope="row">
                                                                            <Typography
                                                                                sx={{ color: !calculoCasillas('pi') && 'text.disabled' }}
                                                                                className="text-15 whitespace-nowrap font-bold"
                                                                            >
                                                                                Patín izquierdo
                                                                            </Typography>
                                                                        </TableCell>
                                                                        <TableCell className="p-4" component="th" scope="row">
                                                                        </TableCell>
                                                                        <TableCell className="p-4" component="th" scope="row">
                                                                            {calculoCasillas('pi')}
                                                                        </TableCell>
                                                                    </TableRow>
                                                                    {escandallo.arrayPatinIzquierdo.map((patin, index) => {
                                                                        return (
                                                                            <TableRow
                                                                                className="h-36"
                                                                                hover
                                                                                key={'aPI' + index}
                                                                                padding="none"
                                                                            >
                                                                                <TableCell className="w-64 flex flex-row items-center justify-center p-6 ml-24">
                                                                                    <Checkbox
                                                                                        color="primary"
                                                                                        size="small"
                                                                                        name={'arrayPatinIzquierdo-' + index}
                                                                                        checked={retornaChecked('arrayPatinIzquierdo-' + index)}
                                                                                        onChange={handleCheckin}
                                                                                    />
                                                                                </TableCell>
                                                                                <TableCell
                                                                                    sx={{ color: !varsEscandallo.arrayPatinIzquierdo[index] && 'text.disabled' }}
                                                                                    className="p-4"
                                                                                    component="th"
                                                                                    scope="row"
                                                                                >
                                                                                    {patin.nombre}
                                                                                </TableCell>
                                                                                <TableCell className="p-4" component="th" scope="row">
                                                                                    {varsEscandallo.arrayPatinIzquierdo[index] ? patin.unidades : null}
                                                                                </TableCell>
                                                                                <TableCell className="p-4" component="th" scope="row">
                                                                                    {varsEscandallo.arrayPatinIzquierdo[index] ? `${varsEscandallo.arrayPatinIzquierdo[index]} m³` : null}
                                                                                </TableCell>
                                                                            </TableRow>
                                                                        );
                                                                    })}
                                                                    <TableRow
                                                                        className="h-36"
                                                                        hover
                                                                        key={'aPI' + (varsEscandallo.arrayPatinIzquierdo.length - 1)}
                                                                        padding="none"
                                                                    >
                                                                        <TableCell className="w-64 flex flex-row items-center justify-center p-6 ml-24">
                                                                            <Checkbox
                                                                                color="primary"
                                                                                size="small"
                                                                                name={'arrayPatinIzquierdo-' + (varsEscandallo.arrayPatinIzquierdo.length - 1) + '-merma'}
                                                                                checked={retornaChecked('arrayPatinIzquierdo-' + (varsEscandallo.arrayPatinIzquierdo.length - 1))}
                                                                                onChange={handleCheckin}
                                                                            />
                                                                        </TableCell>
                                                                        <TableCell
                                                                            sx={{ color: !varsEscandallo.arrayPatinIzquierdo[varsEscandallo.arrayPatinIzquierdo.length - 1] && 'text.disabled' }}
                                                                            className="p-4"
                                                                            component="th"
                                                                            scope="row"
                                                                        >
                                                                            Merma patín izquierdo
                                                                        </TableCell>
                                                                        <TableCell className="p-4" component="th" scope="row">
                                                                        </TableCell>
                                                                        <TableCell className="p-4" component="th" scope="row">
                                                                            {varsEscandallo.arrayPatinIzquierdo[varsEscandallo.arrayPatinIzquierdo.length - 1] ? `${varsEscandallo.arrayPatinIzquierdo[varsEscandallo.arrayPatinIzquierdo.length - 1]} m³` : null}
                                                                        </TableCell>
                                                                    </TableRow>
                                                                    <TableRow
                                                                        hover
                                                                        className="h-36"
                                                                    >
                                                                        <TableCell className="w-64 flex flex-row items-center justify-center p-6 ml-24">
                                                                            <Checkbox
                                                                                color="primary"
                                                                                size="small"
                                                                                name='patinCentral'
                                                                                checked={retornaChecked('patinCentral')}
                                                                                onChange={handleCheckin}
                                                                            />
                                                                        </TableCell>
                                                                        <TableCell className="p-4" component="th" scope="row">
                                                                            <Typography
                                                                                sx={{ color: !calculoCasillas('pc') && 'text.disabled' }}
                                                                                className="text-15 whitespace-nowrap font-bold"
                                                                            >
                                                                                Patín central
                                                                            </Typography>
                                                                        </TableCell>
                                                                        <TableCell className="p-4" component="th" scope="row">
                                                                        </TableCell>
                                                                        <TableCell className="p-4" component="th" scope="row">
                                                                            {calculoCasillas('pc')}
                                                                        </TableCell>
                                                                    </TableRow>
                                                                    {escandallo.arrayPatinCentral.map((patin, index) => {
                                                                        return (
                                                                            <TableRow
                                                                                className="h-36"
                                                                                hover
                                                                                key={'aPC' + index}
                                                                                padding="none"
                                                                            >
                                                                                <TableCell className="w-64 flex flex-row items-center justify-center p-6 ml-24">
                                                                                    <Checkbox
                                                                                        color="primary"
                                                                                        size="small"
                                                                                        name={'arrayPatinCentral-' + index}
                                                                                        checked={retornaChecked('arrayPatinCentral-' + index)}
                                                                                        onChange={handleCheckin}
                                                                                    />
                                                                                </TableCell>
                                                                                <TableCell
                                                                                    sx={{ color: !varsEscandallo.arrayPatinCentral[index] && 'text.disabled' }}
                                                                                    className="p-4"
                                                                                    component="th"
                                                                                    scope="row"
                                                                                >
                                                                                    {patin.nombre}
                                                                                </TableCell>
                                                                                <TableCell className="p-4" component="th" scope="row">
                                                                                    {varsEscandallo.arrayPatinCentral[index] ? patin.unidades : null}
                                                                                </TableCell>
                                                                                <TableCell className="p-4" component="th" scope="row">
                                                                                    {varsEscandallo.arrayPatinCentral[index] ? `${varsEscandallo.arrayPatinCentral[index]} m³` : null}
                                                                                </TableCell>
                                                                            </TableRow>
                                                                        );
                                                                    })}
                                                                    <TableRow
                                                                        className="h-36"
                                                                        hover
                                                                        key={'aPC' + (varsEscandallo.arrayPatinCentral.length - 1)}
                                                                        padding="none"
                                                                    >
                                                                        <TableCell className="w-64 flex flex-row items-center justify-center p-6 ml-24">
                                                                            <Checkbox
                                                                                color="primary"
                                                                                size="small"
                                                                                name={'arrayPatinCentral-' + (varsEscandallo.arrayPatinCentral.length - 1) + '-merma'}
                                                                                checked={retornaChecked('arrayPatinCentral-' + (varsEscandallo.arrayPatinCentral.length - 1))}
                                                                                onChange={handleCheckin}
                                                                            />
                                                                        </TableCell>
                                                                        <TableCell
                                                                            sx={{ color: !varsEscandallo.arrayPatinCentral[varsEscandallo.arrayPatinCentral.length - 1] && 'text.disabled' }}
                                                                            className="p-4"
                                                                            component="th"
                                                                            scope="row"
                                                                        >
                                                                            Merma patín central
                                                                        </TableCell>
                                                                        <TableCell className="p-4" component="th" scope="row">
                                                                        </TableCell>
                                                                        <TableCell className="p-4" component="th" scope="row">
                                                                            {varsEscandallo.arrayPatinCentral[varsEscandallo.arrayPatinCentral.length - 1] ? `${varsEscandallo.arrayPatinCentral[varsEscandallo.arrayPatinCentral.length - 1]} m³` : null}
                                                                        </TableCell>
                                                                    </TableRow>
                                                                </TableBody>
                                                            </Table>
                                                        </Collapse>
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </Collapse>
                                </TableCell>
                            </TableRow>
                            <TableRow className="w-full h-36 bg-gray-50">
                                <TableCell className="w-64 flex flex-row items-center justify-center p-6">
                                    <IconButton
                                        size="small"
                                        onClick={() => setOpenPalets(!openPalets)}
                                        sx={{ color: !calculoCasillas('pl') && 'text.disabled' }}
                                    >
                                        {openPalets ? <FuseSvgIcon>heroicons-outline:chevron-up</FuseSvgIcon> : <FuseSvgIcon>heroicons-outline:chevron-down</FuseSvgIcon>}
                                    </IconButton>
                                </TableCell>
                                <TableCell className="p-4" component="th" scope="row">
                                    <Typography
                                        className="text-16 whitespace-nowrap font-bold"
                                        sx={{ color: !calculoCasillas('pl') && 'text.disabled' }}
                                    >
                                        Palets (total)
                                    </Typography>
                                </TableCell>
                                <TableCell className="p-4" component="th" scope="row">
                                </TableCell>
                                <TableCell className="p-4" component="th" scope="row">
                                    {calculoCasillas('pl')}
                                </TableCell>
                            </TableRow>
                            <TableRow className="w-full">
                                <TableCell colSpan={4} padding="none">
                                    <Collapse in={openPalets} timeout="auto" unmountOnExit>
                                        <Table>
                                            <TableBody>
                                                {escandallo.arrayPalets.map((patin, index) => {
                                                    return (
                                                        <TableRow
                                                            className="h-36"
                                                            hover
                                                            key={'aPa' + index}
                                                            padding="none"
                                                        >
                                                            <TableCell className="w-64 flex flex-row items-center justify-center p-6">
                                                                <Checkbox
                                                                    color="primary"
                                                                    size="small"
                                                                    name={'arrayPalets-' + index}
                                                                    checked={retornaChecked('arrayPalets-' + index)}
                                                                    onChange={handleCheckin}
                                                                />
                                                            </TableCell>
                                                            <TableCell
                                                                sx={{ width: '55%', color: !varsEscandallo.arrayPalets[index] && 'text.disabled' }}
                                                                className="p-4"
                                                                component="th"
                                                                scope="row"
                                                            >
                                                                {patin.nombre}
                                                            </TableCell>
                                                            <TableCell sx={{ width: '20%' }} className="p-4" component="th" scope="row">
                                                                {varsEscandallo.arrayPalets[index] ? patin.unidades : null}
                                                            </TableCell>
                                                            <TableCell sx={{ width: '20%' }} className="p-4" component="th" scope="row">
                                                                {varsEscandallo.arrayPalets[index] ? `${varsEscandallo.arrayPalets[index]} m³` : null}
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </Collapse>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </motion.div>
        </div>
    );
}

export default ListadoCubicajeTacos;
