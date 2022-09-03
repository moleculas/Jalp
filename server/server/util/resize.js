import fs from "fs-extra";
import sharp from "sharp";

const resize = async (file) => {
    try {
        const readStream = fs.createReadStream(file);
        let transform = sharp();
        transform = transform.toFormat('jpg');
        transform.resize(128, 128);
        const filename = file.split('.').slice(0, -1).join('.');
        transform.toFile(filename + '-Dim.jpg');
        return readStream.pipe(transform)
    } catch (err) {
        return res.status(500).json({ message: error.message });
    };
};

export default resize;