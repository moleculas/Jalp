import fs from "fs-extra";
import { RUTA_FILES_FILES } from "../config";

const verifyFileExistsFiles = (req, res, next) => {
    if (!req.files) {
        next();
    } else {
        try {
            const { file } = req.files;
            const { ruta } = JSON.parse(req.body.datos);
            let rutaImagen;
            if(ruta){
                rutaImagen = RUTA_FILES_FILES + ruta + "/" + file.name;
            }else{
                rutaImagen = RUTA_FILES_FILES + file.name;
            };            
            if (fs.existsSync(rutaImagen)) {
                res.locals.nombreArchivo = 'Copia-' + file.name;
            } else {
                res.locals.nombreArchivo = file.name;
            };
            next();
        } catch (err) {
            return res.status(500).json({ message: error.message });
        };
    };
};

export default verifyFileExistsFiles;