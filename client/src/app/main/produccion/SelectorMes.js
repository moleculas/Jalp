import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';
import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import format from 'date-fns/format';
import { es } from 'date-fns/locale';

//importacion acciones
import { setMesActual } from 'app/redux/produccion/inicioSlice';
import { setSemanasAnyo } from 'app/redux/produccion/produccionSlice';

function SelectorMes(props) {
    const dispatch = useDispatch();
    const [maxDate, setMaxDate] = useState(false);
    const [value, setValue] = useState(new Date());

    //useEffect

    useEffect(() => {
        const d = new Date();
        const anyo = d.getFullYear();
        setMaxDate(new Date(anyo + '-12'));
    }, []);

    //funciones

    const handleChangeSelectorMes = (val) => {
        const elMes = format(new Date(val), 'MMMM/yyyy', { locale: es })
        dispatch(setMesActual(elMes));
        setValue(val);
        dispatch(setSemanasAnyo(null));
    };

    return (
        <DatePicker
            views={['month', 'year']}
            label="Mes a gestionar"
            minDate={new Date('2022-1')}
            maxDate={maxDate}
            value={value}
            onChange={(e) => { }}
            onYearChange={(newValue) => {
                handleChangeSelectorMes(newValue);
            }}
            inputProps={{ style: { textTransform: "capitalize" } }}
            renderInput={(params) => <TextField {...params} helperText={null} />}
        />
    );
}

export default SelectorMes;
