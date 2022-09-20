import Typography from '@mui/material/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import _ from '@lodash';
import { motion } from 'framer-motion';
import Button from '@mui/material/Button';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';

//importacion acciones
import {
    selectObjetivos,
    getObjetivos,
    updateObjetivos
} from 'app/redux/produccion/objetivosSlice';

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

function ObjetivosForm() {
    const dispatch = useDispatch();
    const objetivos = useSelector(selectObjetivos);
    const [objetivosControllers, setObjetivosControllers] = useState([]);
    const item1 = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { delay: 0.1 } },
    };
    const { control, watch, reset, handleSubmit, formState, getValues, setValue } = useForm({
        mode: 'onChange',
        resolver: yupResolver(schema),
    });
    const { isValid, dirtyFields, errors } = formState;
    const form = watch();
    const [resetForm, setResetForm] = useState(false);

    //useEffect

    useEffect(() => {
        if (!objetivos) {
            dispatch(getObjetivos());
        } else {
            const arrayObjetivos = [];
            objetivos.forEach((objetivo) => {
                arrayObjetivos.push({ ...objetivo, modificado: false });
                setValue(`palets-${objetivo.producto}`, objetivo.palets, { shouldDirty: true });
                setValue(`saldo-${objetivo.producto}`, objetivo.saldo, { shouldDirty: true });
            });
            setObjetivosControllers(arrayObjetivos);
            resetForm && setResetForm(false);
        };
    }, [objetivos, resetForm]);

    //funciones   

    const onChangeFirst = (e) => {
        const arrayObjetivos = [...objetivosControllers];
        const string = e.target.name;
        let stringModificado;
        if (string.includes("palets-")) {
            stringModificado = string.replace("palets-", "");
        } else {
            stringModificado = string.replace("saldo-", "");
        };
        arrayObjetivos[arrayObjetivos.findIndex(el => el.producto === stringModificado)].modificado = true;
        setObjetivosControllers(arrayObjetivos);
        consultaModificado();
    };

    const consultaModificado = () => {
        const existeModificado = objetivosControllers.some(el => el.modificado === true);
        return existeModificado
    };

    function onSubmit(data) {
        const modificados = objetivosControllers.filter(el => el.modificado === true);
        let modificadosActualizar = [...modificados];
        modificadosActualizar.map((item, index) => {
            for (const clave in data) {
                let incluido = false;
                let arrayHistorico = [];
                if (clave.includes("palets-") && clave.includes(item.producto)) {
                    incluido = true;
                    item.palets = data[clave];
                    if (item.historicoPalets[item.historicoPalets.length - 1].palets !== data[clave]) {
                        arrayHistorico = [...item.historicoPalets];
                        arrayHistorico.push({ palets: data[clave], fecha: new Date() });
                        item.historicoPalets = arrayHistorico;
                    };
                };
                if (clave.includes("saldo-") && clave.includes(item.producto)) {
                    incluido = true;
                    item.saldo = data[clave];
                    if (item.historicoSaldo[item.historicoSaldo.length - 1].saldo !== data[clave]) {
                        arrayHistorico = [...item.historicoSaldo];
                        arrayHistorico.push({ saldo: data[clave], fecha: new Date() });
                        item.historicoSaldo = arrayHistorico;
                    };
                };
                incluido && (modificadosActualizar[index] = item);
            };
        });
        dispatch(updateObjetivos(modificadosActualizar)).then(({ payload }) => {
            dispatch(getObjetivos());
        });
    };

    if (!objetivos) {
        return null
    };

    return (
        <div className="flex flex-wrap w-full p-12">
            <div className="flex flex-col sm:flex-row flex-1 items-center px-12 justify-between mb-24 space-y-16 sm:space-y-0">
                <div>
                    <Typography className="text-2xl font-extrabold tracking-tight leading-tight">
                        Objetivos producción
                    </Typography>
                    <div className="mt-2 font-medium">
                        <Typography>Variables para cálculo de objetivos mensuales.</Typography>
                    </div>
                </div>
            </div>
            <motion.div variants={item1} className="w-full flex flex-col">
                <Paper className="flex flex-col flex-auto shadow rounded-2xl overflow-hidden px-36 py-24">
                    {objetivosControllers.map((objetivo, index) => {
                        return (
                            <div className="flex flex-col md:flex-row items-center justify-between py-12 w-full" key={`item-${index}`}>
                               <div className="w-full md:w-1/3 mb-16 md:mb-0">
                                <Typography color="text.primary">{objetivo.producto}</Typography>
                                </div>
                                <div className="flex space-x-16 w-full md:w-2/3">
                                    <Controller
                                        control={control}
                                        name={`palets-${objetivo.producto}`}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                className="w-full md:w-2/3"
                                                label='Palets'
                                                placeholder="Palets"
                                                id={`palets-${objetivo.producto}`}
                                                error={!!errors[`palets-${objetivo.producto}`]}
                                                helperText={errors[`palets-${objetivo.producto}`]?.message}
                                                variant="outlined"
                                                fullWidth
                                                onChange={e => {
                                                    onChangeFirst(e);
                                                    field.onChange(e);
                                                }}
                                            />
                                        )}
                                    />
                                    <Controller
                                        control={control}
                                        name={`saldo-${objetivo.producto}`}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                className="w-full md:w-2/3"
                                                label='Saldo'
                                                placeholder="Saldo"
                                                id={`saldo-${objetivo.producto}`}
                                                error={!!errors[`saldo-${objetivo.producto}`]}
                                                helperText={errors[`saldo-${objetivo.producto}`]?.message}
                                                variant="outlined"
                                                fullWidth
                                                onChange={e => {
                                                    onChangeFirst(e);
                                                    field.onChange(e);
                                                }}
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        )
                    })}
                </Paper>
                <div className="grid grid-cols-2 gap-16 w-full mt-24">
                    <Button
                        variant="contained"
                        color="secondary"
                        disabled={!isValid || _.isEmpty(form) || !consultaModificado()}
                        onClick={handleSubmit(onSubmit)}
                        size="large"
                    >
                        Actualizar
                    </Button>
                    <Button
                        className="flex-auto"
                        onClick={() => setResetForm(true)}
                    >
                        Cancelar
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}

export default ObjetivosForm;
