import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import _ from '@lodash';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';

//importacion acciones
import {
    selectEscandallo,
    getEscandallo
} from 'app/redux/produccion/produccionSlice';

/**
 * Form Validation Schema
 */
const schema = yup.lazy((value) => {
    const shapes = {};
    const keys = Object.keys(value);
    keys.forEach(((parameter) => {
        shapes[parameter] = yup.number().typeError('Debes introducir un valor numérico');
    }));
    return yup.object().shape(shapes);
});

function FormulasCubicajeTacos() {
    const dispatch = useDispatch();
    const escandallo = useSelector(selectEscandallo);
    const defaultValues = {
        "m-135x72": '',
        "m-103x72": '',
        "m-103x94": '',
        "p-135x72": '',
        "p-103x72": '',
        "p-103x94": ''
    };
    const { control, watch, reset, handleSubmit, formState, getValues, setValue } = useForm({
        mode: 'onChange',
        defaultValues,
        resolver: yupResolver(schema),
    });
    const { isValid, dirtyFields, errors } = formState;
    const form = watch();
    const [resultadoCalculosPalets, setResultadoCalculosPalets] = useState({ '135x72': 0, '103x72': 0, '103x94': 0 });
    const [resultadoCalculosM3, setResultadoCalculosM3] = useState({ '135x72': 0, '103x72': 0, '103x94': 0, 'total': 0 });

    //useEffect

    useEffect(() => {
        if (!escandallo) {
            dispatch(getEscandallo());
        };
    }, [escandallo]);

    //funciones

    const handleChangeForm = (e) => {
        let objetoACambiar = {};
        let totalM3;
        switch (e.target.name) {
            case 'm-135x72':
                objetoACambiar = { ...resultadoCalculosPalets };
                objetoACambiar['135x72'] = _.round((e.target.value / escandallo.varPatinCentral), 2);
                setResultadoCalculosPalets(objetoACambiar);
                break;
            case 'm-103x72':
                objetoACambiar = { ...resultadoCalculosPalets };
                objetoACambiar['103x72'] = _.round((e.target.value / escandallo.varPatinDerecho), 2);
                setResultadoCalculosPalets(objetoACambiar);
                break;
            case 'm-103x94':
                objetoACambiar = { ...resultadoCalculosPalets };
                objetoACambiar['103x94'] = _.round((e.target.value / escandallo.varPatinIzquierdo), 2);
                setResultadoCalculosPalets(objetoACambiar);
                break;
            case 'p-135x72':
                objetoACambiar = { ...resultadoCalculosM3 };
                objetoACambiar['135x72'] = _.round((e.target.value * escandallo.varPatinCentral), 2);
                totalM3 = objetoACambiar['135x72'] + objetoACambiar['103x72'] + objetoACambiar['103x94'];
                objetoACambiar['total'] = _.round(totalM3, 2);
                setResultadoCalculosM3(objetoACambiar);
                break;
            case 'p-103x72':
                objetoACambiar = { ...resultadoCalculosM3 };
                objetoACambiar['103x72'] = _.round((e.target.value * escandallo.varPatinDerecho), 2);
                totalM3 = objetoACambiar['135x72'] + objetoACambiar['103x72'] + objetoACambiar['103x94'];
                objetoACambiar['total'] = _.round(totalM3, 2);
                setResultadoCalculosM3(objetoACambiar);
                break;
            case 'p-103x94':
                objetoACambiar = { ...resultadoCalculosM3 };
                objetoACambiar['103x94'] = _.round((e.target.value * escandallo.varPatinIzquierdo), 2);
                totalM3 = objetoACambiar['135x72'] + objetoACambiar['103x72'] + objetoACambiar['103x94'];
                objetoACambiar['total'] = _.round(totalM3, 2);
                setResultadoCalculosM3(objetoACambiar);
                break;
            default:
        };
    };

    if (!escandallo) {
        return null
    };

    return (
        <div className="flex flex-wrap w-full p-12">
            <div className="flex flex-col sm:flex-row flex-1 items-start px-12 justify-between mb-32">
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
                <Paper elevation={1} className="flex flex-col flex-auto shadow rounded-2xl pb-24">
                    <Box className="flex items-start justify-start px-24 py-16 w-full">
                        <Typography className="text-16 font-bold tracking-tight leading-6 truncate">
                            Palets realizables con m³
                        </Typography>
                    </Box>
                    <Divider />
                    <div className="grid grid-cols-5 gap-x-8 gap-y-12 px-16 mt-24">
                        <div className="bg-gray-100 w-full flex items-center pl-16 py-9 border-b">
                            <Typography className="text-15 font-bold truncate">
                                Patín
                            </Typography>
                        </div>
                        <div className="bg-gray-100 w-full flex items-center pl-16 py-9 border-b">
                            <Typography variant="body1" className="truncate">
                                135x72
                            </Typography>
                        </div>
                        <div className="bg-gray-100 w-full flex items-center pl-16 py-9 border-b">
                            <Typography variant="body1" className="truncate">
                                103x72
                            </Typography>
                        </div>
                        <div className="bg-gray-100 w-full flex items-center pl-16 py-9 border-b">
                            <Typography variant="body1" className="truncate">
                                103x94
                            </Typography>
                        </div>
                        <div></div>
                        <div className="bg-gray-100 w-full flex items-center pl-16 py-9 border-b">
                            <Typography className="text-15 font-bold truncate">
                                Cant. m³
                            </Typography>
                        </div>
                        <Controller
                            control={control}
                            name="m-135x72"
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label='m³'
                                    placeholder="m³"
                                    id="m-135x72"
                                    error={!!errors['m-135x72']}
                                    helperText={errors['m-135x72']?.message}
                                    variant="outlined"
                                    fullWidth
                                    onChange={e => {
                                        field.onChange(e);
                                        handleChangeForm(e);
                                    }}
                                    size="small"
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="m-103x72"
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label='m³'
                                    placeholder="m³"
                                    id="m-103x72"
                                    error={!!errors['m-103x72']}
                                    helperText={errors['m-103x72']?.message}
                                    variant="outlined"
                                    fullWidth
                                    onChange={e => {
                                        field.onChange(e);
                                        handleChangeForm(e);
                                    }}
                                    size="small"
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="m-103x94"
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label='m³'
                                    placeholder="m³"
                                    id="m-103x94"
                                    error={!!errors['m-103x94']}
                                    helperText={errors['m-103x94']?.message}
                                    variant="outlined"
                                    fullWidth
                                    onChange={e => {
                                        field.onChange(e);
                                        handleChangeForm(e);
                                    }}
                                    size="small"
                                />
                            )}
                        />
                        <div></div>
                        <div className="bg-gray-100 w-full flex items-center pl-16 py-9 border-b">
                            <Typography className="text-15 font-bold">
                                Palets
                            </Typography>
                        </div>
                        <Tooltip
                            title="Resultado de dividir m³ introducidos entre sumatorio cúbico Patín central"
                            followCursor
                        >
                            <div className="bg-gray-50 w-full flex items-center pl-16 py-9 border-b cursor-default">
                                <Typography variant="body1" className="truncate">
                                    {`${resultadoCalculosPalets['135x72']} palets`}
                                </Typography>
                            </div>
                        </Tooltip>

                        <Tooltip
                            title="Resultado de dividir m³ introducidos entre sumatorio cúbico Patín derecho"
                            followCursor
                        >
                            <div className="bg-gray-50 w-full flex items-center pl-16 py-9 border-b cursor-default">
                                <Typography variant="body1" className="truncate">
                                    {`${resultadoCalculosPalets['103x72']} palets`}
                                </Typography>
                            </div>
                        </Tooltip>

                        <Tooltip
                            title="Resultado de dividir m³ introducidos entre sumatorio cúbico Patín izquierdo"
                            followCursor
                        >
                            <div className="bg-gray-50 w-full flex items-center pl-16 py-9 border-b cursor-default">
                                <Typography variant="body1" className="truncate">
                                    {`${resultadoCalculosPalets['103x94']} palets`}
                                </Typography>
                            </div>
                        </Tooltip>
                        <div></div>
                    </div>
                </Paper>
            </div>
            <div className="w-full flex flex-col mt-16">
                <Paper elevation={1} className="flex flex-col flex-auto shadow rounded-2xl pb-24">
                    <Box className="flex items-start justify-start px-24 py-16 w-full">
                        <Typography className="text-16 font-bold tracking-tight leading-6 truncate">
                            m³ necesarios para realizar palets
                        </Typography>
                    </Box>
                    <Divider />
                    <div className="grid grid-cols-5 gap-x-8 gap-y-12 px-16 mt-24">
                        <div className="bg-gray-100 w-full flex items-center pl-16 py-9 border-b">
                            <Typography className="text-15 font-bold truncate">
                                Patín
                            </Typography>
                        </div>
                        <div className="bg-gray-100 w-full flex items-center pl-16 py-9 border-b">
                            <Typography variant="body1" className="truncate">
                                135x72
                            </Typography>
                        </div>
                        <div className="bg-gray-100 w-full flex items-center pl-16 py-9 border-b">
                            <Typography variant="body1" className="truncate">
                                103x72
                            </Typography>
                        </div>
                        <div className="bg-gray-100 w-full flex items-center pl-16 py-9 border-b">
                            <Typography variant="body1" className="truncate">
                                103x94
                            </Typography>
                        </div>
                        <div className="bg-gray-100 w-full flex items-center pl-16 py-9 border-b">
                            <Typography variant="body1" className="truncate">
                                Total taco
                            </Typography>
                        </div>
                        <div className="bg-gray-100 w-full flex items-center pl-16 py-9 border-b">
                            <Typography className="text-15 font-bold truncate">
                                Palets
                            </Typography>
                        </div>
                        <Controller
                            control={control}
                            name="p-135x72"
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label='Palets'
                                    placeholder="Palets"
                                    id="p-135x72"
                                    error={!!errors['p-135x72']}
                                    helperText={errors['p-135x72']?.message}
                                    variant="outlined"
                                    fullWidth
                                    onChange={e => {
                                        field.onChange(e);
                                        handleChangeForm(e);
                                    }}
                                    size="small"
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="p-103x72"
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label='Palets'
                                    placeholder="Palets"
                                    id="p-103x72"
                                    error={!!errors['p-103x72']}
                                    helperText={errors['p-103x72']?.message}
                                    variant="outlined"
                                    fullWidth
                                    onChange={e => {
                                        field.onChange(e);
                                        handleChangeForm(e);
                                    }}
                                    size="small"
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="p-103x94"
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label='Palets'
                                    placeholder="Palets"
                                    id="p-103x94"
                                    error={!!errors['p-103x94']}
                                    helperText={errors['p-103x94']?.message}
                                    variant="outlined"
                                    fullWidth
                                    onChange={e => {
                                        field.onChange(e);
                                        handleChangeForm(e);
                                    }}
                                    size="small"
                                />
                            )}
                        />
                        <div></div>
                        <div className="bg-gray-100 w-full flex items-center pl-16 py-9 border-b">
                            <Typography className="text-15 font-bold truncate">
                                Cant. m³
                            </Typography>
                        </div>
                        <Tooltip
                            title="Resultado de multiplicar palets introducidos por sumatorio cúbico Patín central"
                            followCursor
                        >
                            <div className="bg-gray-50 w-full flex items-center pl-16 py-9 border-b cursor-default">
                                <Typography variant="body1" className="truncate">
                                    {`${resultadoCalculosM3['135x72']} m³`}
                                </Typography>
                            </div>
                        </Tooltip>
                        <Tooltip
                            title="Resultado de multiplicar palets introducidos por sumatorio cúbico Patín derecho"
                            followCursor
                        >
                            <div className="bg-gray-50 w-full flex items-center pl-16 py-9 border-b cursor-default">
                                <Typography variant="body1" className="truncate">
                                    {`${resultadoCalculosM3['103x72']} m³`}
                                </Typography>
                            </div>
                        </Tooltip>
                        <Tooltip
                            title="Resultado de multiplicar palets introducidos por sumatorio cúbico Patín izquierdo"
                            followCursor
                        >
                            <div className="bg-gray-50 w-full flex items-center pl-16 py-9 border-b cursor-default">
                                <Typography variant="body1" className="truncate">
                                    {`${resultadoCalculosM3['103x94']} m³`}
                                </Typography>
                            </div>
                        </Tooltip>
                        <Tooltip
                            title="Sumatorio total Taco"
                            followCursor
                        >
                            <div className="bg-gray-50 w-full flex items-center pl-16 py-9 border-b cursor-default">
                                <Typography variant="body1" className="truncate">
                                    {`${resultadoCalculosM3['total']} m³`}
                                </Typography>
                            </div>
                        </Tooltip>
                    </div>
                </Paper>
            </div>
        </div>
    );
}

export default FormulasCubicajeTacos;
