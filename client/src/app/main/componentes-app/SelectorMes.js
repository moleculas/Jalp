import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import format from 'date-fns/format';
import { es } from 'date-fns/locale';

//importacion acciones
import { setMesActual, setSemanasAnyo } from 'app/redux/produccion/inicioSlice';
import {
    setDatosProduccionTabla,
    setDatosProduccionPalet,
    setDatosProduccionSaldo,
    setDatosProduccionLX,
    setDatosProduccionLXMesAnterior
} from 'app/redux/produccion/produccionSlice';
import { setPedido } from 'src/app/redux/produccion/pedidoSlice';
import { setProductos } from 'app/redux/produccion/productoSlice';

function SelectorMes(props) {
    const { anyo, mesNumero } = props;
    const dispatch = useDispatch();
    const maxDate = new Date(anyo + '-12');
    const [value, setValue] = useState(new Date(anyo + '-' + mesNumero));

    //useEffect

    //funciones

    const handleChangeSelectorMes = (val) => {
        const letra = format(new Date(val), 'MMMM/yyyy', { locale: es });
        const numero = format(new Date(val), 'MM/yyyy');
        dispatch(setMesActual({ letra, numero }));
        setValue(val);
        dispatch(setSemanasAnyo(null));
        dispatch(setDatosProduccionLX(null));
        dispatch(setDatosProduccionLXMesAnterior(null));
        dispatch(setDatosProduccionTabla(null));
        dispatch(setDatosProduccionPalet(null));
        dispatch(setDatosProduccionSaldo(null));
        dispatch(setProductos(null));
        dispatch(setPedido(null));
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
