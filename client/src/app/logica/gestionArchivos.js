import axios from 'axios';
import fileDownload from 'js-file-download';

//importación acciones
import { setFileAActualizar } from 'app/redux/file-manager/itemsSlice';

export const downloadFile = (url, fileName) => async (dispatch, getState) => {
    await axios.get(url, {
        responseType: 'blob',
    }).then((res) => {
        fileDownload(res.data, fileName);
    });
};

export const getFile = (url, fileName) => async (dispatch, getState) => {
    await axios.get(url, {
        responseType: 'blob',
    }).then((res) => {
        const mime = res.data.type;
        const file = new File([res.data], fileName, { type: mime });
        dispatch(setFileAActualizar(file));
    });
};