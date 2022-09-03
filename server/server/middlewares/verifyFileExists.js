import fs from "fs-extra";
import { RUTA_FILES_AVATARS } from "../config";

const verifyFileExists = (req, res, next) => {
    if (!req.files) {
        next();
    } else {
        try {
            const { file } = req.files;
            const rutaImagen = RUTA_FILES_AVATARS + file.name;
            if (fs.existsSync(rutaImagen)) {
                res.locals.nombreImagen = 'Copia-' + file.name;
            } else {
                res.locals.nombreImagen = file.name;
            };
            next();
        } catch (err) {
            return res.status(500).json({ message: error.message });
        };
    };
};

export default verifyFileExists;