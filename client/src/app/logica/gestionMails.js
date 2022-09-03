import axios from 'axios';

//importación acciones
import { showMessage } from 'app/redux/fuse/messageSlice';

export const sendMail = (email) => async (dispatch, getState) => {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("origen", "recuperacion_pass");
    formData.append("aplicacion", "Gestión Integral de Producción");
    try {
        const response = await axios.post('/mails/send-mail', formData);
        const data = await response.data;
        dispatch(showMessage({ message: data.message, variant: "success" }));
        return;
    } catch (err) {
        dispatch(showMessage({ message: err.response.data.message, variant: "error" }));
        return;
    };
};