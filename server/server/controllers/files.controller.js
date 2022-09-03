import File from "../models/File";
import { RUTA_FILES_FILES, RUTA_PUBLIC } from "../config";
import fs from "fs-extra";

export const getFiles = async (req, res) => {
    const { folderId } = req.params;
    try {
        let elFolder;
        folderId === 'root' ? (elFolder = null) : (elFolder = folderId);
        const files = await File.find({ folderId: elFolder });
        const filesARetornar = files.map(({ _id, name, nameServer, folderId, createdBy, size, type, description, ruta, createdAt, updatedAt }) => ({
            id: _id,
            name: name,
            nameServer: nameServer,
            folderId: folderId,
            createdBy: createdBy,
            size: size,
            type: type,
            description: description,
            ruta: ruta,
            createdAt: createdAt,
            updatedAt: updatedAt
        }));
        const path = [];
        if (elFolder) {
            let parentPathfileARetornar = null;
            let parentPathfile = null;
            parentPathfile = await File.findOne({ _id: elFolder, type: 'folder' });
            parentPathfileARetornar = {
                id: parentPathfile._id,
                name: parentPathfile.name,
                nameServer: parentPathfile.nameServer,
                folderId: parentPathfile.folderId,
                createdBy: parentPathfile.createdBy,
                size: parentPathfile.size,
                type: parentPathfile.type,
                description: parentPathfile.description,
                ruta: parentPathfile.ruta,
                createdAt: parentPathfile.createdAt,
                updatedAt: parentPathfile.updatedAt
            };
            path.push(parentPathfileARetornar);
            while (parentPathfile?.folderId) {
                parentPathfile = await File.findOne({ _id: parentPathfile.folderId, type: 'folder' });
                if (parentPathfile) {
                    parentPathfileARetornar = {
                        id: parentPathfile._id,
                        name: parentPathfile.name,
                        nameServer: parentPathfile.nameServer,
                        folderId: parentPathfile.folderId,
                        createdBy: parentPathfile.createdBy,
                        size: parentPathfile.size,
                        type: parentPathfile.type,
                        description: parentPathfile.description,
                        ruta: parentPathfile.ruta,
                        createdAt: parentPathfile.createdAt,
                        updatedAt: parentPathfile.updatedAt
                    };
                    path.unshift(parentPathfileARetornar);
                };
            };
        };
        return res.json({ items: filesARetornar, path: path });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};

export const addFileFolder = async (req, res) => {
    const { name, nameServer, folderId, createdBy, size, type, description, ruta } = JSON.parse(req.body.datos);
    try {
        const oldFile = await File.findOne({ name });
        if (oldFile) {
            return res.status(404).send({ message: "Ya hay una carpeta registrada con el nombre " + name + "." });
        };
        const newFile = new File({
            name: name,
            nameServer: nameServer,
            folderId: folderId,
            createdBy: createdBy,
            size: size,
            type: type,
            description: description,
        });
        let dir;
        if (ruta) {
            newFile.ruta = 'assets/files/' + ruta + "/" + nameServer;
            dir = RUTA_FILES_FILES + ruta + "/" + nameServer;
        } else {
            newFile.ruta = 'assets/files/' + nameServer;
            dir = RUTA_FILES_FILES + nameServer;
        };
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        };
        await newFile.save();
        const fileARetornar = {
            id: newFile._id,
            name: newFile.name,
            nameServer: newFile.nameServer,
            folderId: newFile.folderId,
            createdBy: newFile.createdBy,
            size: newFile.size,
            type: newFile.type,
            description: newFile.description,
            ruta: newFile.ruta,
            createdAt: newFile.createdAt,
            updatedAt: newFile.updatedAt
        };
        return res.json(fileARetornar);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};

export const updateFileFolder = async (req, res) => {
    const objetoFile = JSON.parse(req.body.datos);
    const { id } = req.params;
    const name = objetoFile.name;
    try {
        const oldFile = await File.findOne({ name, _id: { $ne: id } });
        if (oldFile) {
            return res.status(404).send({ message: "Ya hay una carpeta registrada con el nombre " + name + "." });
        };
        const updatedFile = await File.findByIdAndUpdate(
            id,
            {
                $set: objetoFile
            },
            {
                new: true,
            }
        );
        if (!updatedFile) return res.sendStatus(404);
        await updatedFile.save();
        const updatedFileARetornar = {
            id: updatedFile._id,
            name: updatedFile.name,
            nameServer: updatedFile.nameServer,
            folderId: updatedFile.folderId,
            createdBy: updatedFile.createdBy,
            size: updatedFile.size,
            type: updatedFile.type,
            description: updatedFile.description,
            ruta: updatedFile.ruta,
            createdAt: updatedFile.createdAt,
            updatedAt: updatedFile.updatedAt
        };
        return res.json(updatedFileARetornar);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};

export const addFileFile = async (req, res) => {
    const { name, nameServer, folderId, createdBy, size, type, description, ruta } = JSON.parse(req.body.datos);
    const { file } = req.files;
    try {
        const oldFile = await File.findOne({ name });
        if (oldFile) {
            return res.status(404).send({ message: "Ya hay un archivo registrado con el nombre " + name + "." });
        };
        const newFile = new File({
            name: name,
            nameServer: res.locals.nombreArchivo,
            folderId: folderId,
            createdBy: createdBy,
            size: size,
            type: type,
            description: description,
        });
        let dir;
        if (ruta) {
            newFile.ruta = 'assets/files/' + ruta + "/" + res.locals.nombreArchivo;
            dir = RUTA_FILES_FILES + ruta + "/" + res.locals.nombreArchivo;
        } else {
            newFile.ruta = 'assets/files/' + res.locals.nombreArchivo;
            dir = RUTA_FILES_FILES + res.locals.nombreArchivo;
        };
        await file.mv(dir);
        await fs.remove(file.tempFilePath);
        await newFile.save();
        const fileARetornar = {
            id: newFile._id,
            name: newFile.name,
            nameServer: newFile.nameServer,
            folderId: newFile.folderId,
            createdBy: newFile.createdBy,
            size: newFile.size,
            type: newFile.type,
            description: newFile.description,
            ruta: newFile.ruta,
            createdAt: newFile.createdAt,
            updatedAt: newFile.updatedAt
        };
        return res.json(fileARetornar);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};

export const updateFileFile = async (req, res) => {
    const { name, nameServer, folderId, createdBy, size, type, description, ruta } = JSON.parse(req.body.datos);
    const { id } = req.params;
    let file = null;
    if (req.files) {
        file = req.files.file;
    };
    try {
        const oldFile = await File.findOne({ name, _id: { $ne: id } });
        if (oldFile) {
            return res.status(404).send({ message: "Ya hay un archivo registrado con el nombre " + name + "." });
        };
        const updatedFile = await File.findByIdAndUpdate(
            id,
            {
                $set: {
                    name: name,
                    folderId: folderId,
                    createdBy: createdBy,
                    size: size,
                    type: type,
                    description: description,
                }
            },
            {
                new: true,
            }
        );
        if (!updatedFile) return res.sendStatus(404);
        if (file) {
            const preUpdatedFile = await File.findOne({ _id: id });
            const dirToDelete = RUTA_PUBLIC + preUpdatedFile.ruta;
            try {
                fs.unlinkSync(dirToDelete);
            } catch (err) {
                console.error(err);
            };
            let dir;
            if (ruta) {
                updatedFile.ruta = 'assets/files/' + ruta + "/" + res.locals.nombreArchivo;
                dir = RUTA_FILES_FILES + ruta + "/" + res.locals.nombreArchivo;
            } else {
                updatedFile.ruta = 'assets/files/' + res.locals.nombreArchivo;
                dir = RUTA_FILES_FILES + res.locals.nombreArchivo;
            };
            await file.mv(dir);
            await fs.remove(file.tempFilePath);
            updatedFile.nameServer = res.locals.nombreArchivo;
        } else {
            updatedFile.nameServer = nameServer;
        };
        await updatedFile.save();
        const updatedFileARetornar = {
            id: updatedFile._id,
            name: updatedFile.name,
            nameServer: updatedFile.nameServer,
            folderId: updatedFile.folderId,
            createdBy: updatedFile.createdBy,
            size: updatedFile.size,
            type: updatedFile.type,
            description: updatedFile.description,
            ruta: updatedFile.ruta,
            createdAt: updatedFile.createdAt,
            updatedAt: updatedFile.updatedAt
        };
        return res.json(updatedFileARetornar);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};

export const deleteFile = async (req, res) => {
    const { id } = req.params;
    try {
        const file = await File.findById(id);
        if (!file) return res.sendStatus(404);
        if (file.type === 'folder') {
            let descendants = [];
            let stack = [];
            let item = await File.findOne({ _id: id, type: 'folder' });
            stack.push(item);
            descendants.push(item._id);
            while (stack.length > 0) {
                let currentNode = stack.pop();
                let children = await File.find({ folderId: { $in: currentNode._id } });
                children.forEach(child => {
                    descendants.push(child._id);
                    if (child) {
                        stack.push(child);
                    };
                });
            };
            await File.deleteMany({ _id: { $in: descendants } });
            const dirToDelete = RUTA_PUBLIC + item.ruta;
            try {
                fs.rmdirSync(dirToDelete, { recursive: true });
            } catch (err) {
                console.error(err);
            };
            res.status(200).send({ message: "Carpeta eliminada con éxito." });
        } else {
            const fileSolo = await File.findByIdAndDelete(id);
            const dirToDelete = RUTA_PUBLIC + fileSolo.ruta;
            try {
                fs.unlinkSync(dirToDelete);
            } catch (err) {
                console.error(err);
            };
            if (!fileSolo) return res.sendStatus(404);
            res.status(200).send({ message: "Archivo eliminado con éxito." });
        };
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};