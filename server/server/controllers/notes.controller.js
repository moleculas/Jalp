import LabelNote from "../models/LabelNote";
import Note from "../models/Note";
import { RUTA_FILES_NOTES } from "../config";
import fs from "fs-extra";
import path from "path";

export const getLabels = async (req, res) => {
    const { usuario } = req.params;
    try {
        const labels = await LabelNote.find({}, {
            createdAt: 0,
            updatedAt: 0,
            usuario: 0
        }).where('usuario').equals(usuario);
        const labelsARetornar = labels.map(({ _id, title }) => ({ id: _id, title: title }));
        return res.json(labelsARetornar);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};

export const addLabel = async (req, res) => {
    const { title, usuario } = JSON.parse(req.body.datos);
    try {
        const newLabel = new LabelNote({
            title: title,
            usuario: usuario
        });
        await newLabel.save();
        const labelARetornar = { id: newLabel._id, title: newLabel.title };
        return res.json(labelARetornar);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};

export const updateLabel = async (req, res) => {
    const { title } = JSON.parse(req.body.datos);
    const { id } = req.params;
    try {
        const updatedLabel = await LabelNote.findByIdAndUpdate(
            id,
            { $set: { title: title } },
            {
                new: true,
            }
        );
        if (!updatedLabel) return res.sendStatus(404);
        await updatedLabel.save();
        const updatedLabelARetornar = { id: updatedLabel._id, title: updatedLabel.title };
        return res.json(updatedLabelARetornar);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};

export const removeLabel = async (req, res) => {
    const { id } = req.params;
    try {
        const label = await LabelNote.findByIdAndDelete(id);
        if (!label) return res.sendStatus(404);
        res.status(200).send({ message: "Etiqueta eliminada con éxito." });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};

export const createNote = async (req, res) => {
    const { title, usuario, content, tasks, reminder, labels, archived, image } = JSON.parse(req.body.datos);
    let objetoNota = {};
    objetoNota['title'] = title;
    objetoNota['usuario'] = usuario;
    objetoNota['content'] = content;
    tasks && (objetoNota['tasks'] = tasks);
    reminder && (objetoNota['reminder'] = reminder);
    labels && (objetoNota['labels'] = labels);
    objetoNota['archived'] = archived;
    image && (objetoNota['image'] = image);
    try {
        const newNote = new Note(objetoNota);
        const noteId = newNote._id.toString();
        if (req.files?.file) {
            const { file } = req.files;
            if (file) {
                const extension = path.extname(file.name);
                const nombreImagenNota = noteId + extension;
                await file.mv(RUTA_FILES_NOTES + nombreImagenNota);
                await fs.remove(file.tempFilePath);
                const urlImage = `assets/images/notes/${nombreImagenNota}`;
                newNote.image = urlImage;
            };
        };
        image && (newNote.image = "");
        await newNote.save();
        const noteARetornar = {
            id: newNote._id,
            title: newNote.title,
            content: newNote.content,
            tasks: newNote.tasks,
            image: newNote.image,
            reminder: newNote.reminder,
            labels: newNote.labels,
            archived: newNote.archived,
            createdAt: newNote.createdAt,
            updatedAt: newNote.updatedAt
        };
        return res.json(noteARetornar);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};

export const getNotes = async (req, res) => {
    const { usuario } = req.params;
    try {
        const notes = await Note.find({}, {
            usuario: 0
        }).where('usuario').equals(usuario);
        const notesARetornar = notes.map(({ _id, title, content, tasks, image, reminder, labels, archived, createdAt, updatedAt }) => ({
            id: _id,
            title: title,
            content: content,
            tasks: tasks.length > 0 ? (
                tasks.map(({ _id, content, completed }) => ({
                    id: _id,
                    content: content,
                    completed: completed
                }))
            ) : [],
            image: image,
            reminder: reminder,
            labels: labels,
            archived: archived,
            createdAt: createdAt,
            updatedAt: updatedAt
        }));
        return res.json(notesARetornar);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};

export const getNotesReminders = async (req, res) => {
    const { usuario } = req.params;
    try {
        const notes = await Note.find({ reminder: { $ne: null } }, {
            usuario: 0
        }).where('usuario').equals(usuario);
        const notesARetornar = notes.map(({ _id, title, content, tasks, image, reminder, labels, archived, createdAt, updatedAt }) => ({
            id: _id,
            title: title,
            content: content,
            tasks: tasks.length > 0 ? (
                tasks.map(({ _id, content, completed }) => ({
                    id: _id,
                    content: content,
                    completed: completed
                }))
            ) : [],
            image: image,
            reminder: reminder,
            labels: labels,
            archived: archived,
            createdAt: createdAt,
            updatedAt: updatedAt
        }));
        return res.json(notesARetornar);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};

export const getNotesArchive = async (req, res) => {
    const { usuario } = req.params;
    try {
        const notes = await Note.find({ archived: true }, {
            usuario: 0
        }).where('usuario').equals(usuario);
        const notesARetornar = notes.map(({ _id, title, content, tasks, image, reminder, labels, archived, createdAt, updatedAt }) => ({
            id: _id,
            title: title,
            content: content,
            tasks: tasks.length > 0 ? (
                tasks.map(({ _id, content, completed }) => ({
                    id: _id,
                    content: content,
                    completed: completed
                }))
            ) : [],
            image: image,
            reminder: reminder,
            labels: labels,
            archived: archived,
            createdAt: createdAt,
            updatedAt: updatedAt
        }));
        return res.json(notesARetornar);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};

export const getNotesLabel = async (req, res) => {
    const { label, usuario } = req.params;
    try {
        const notes = await Note.find({ labels: { _id: label } }, {
            usuario: 0
        }).where('usuario').equals(usuario);
        const notesARetornar = notes.map(({ _id, title, content, tasks, image, reminder, labels, archived, createdAt, updatedAt }) => ({
            id: _id,
            title: title,
            content: content,
            tasks: tasks.length > 0 ? (
                tasks.map(({ _id, content, completed }) => ({
                    id: _id,
                    content: content,
                    completed: completed
                }))
            ) : [],
            image: image,
            reminder: reminder,
            labels: labels,
            archived: archived,
            createdAt: createdAt,
            updatedAt: updatedAt
        }));
        return res.json(notesARetornar);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};

export const updateNote = async (req, res) => {
    const { title, content, tasks, reminder, labels, archived, image } = JSON.parse(req.body.datos);
    const { id } = req.params;
    let objetoNota = {};
    objetoNota['title'] = title;
    objetoNota['content'] = content;
    tasks && (objetoNota['tasks'] = tasks);
    objetoNota['reminder'] = reminder;
    labels && (objetoNota['labels'] = labels);
    image && (objetoNota['image'] = image);
    objetoNota['archived'] = archived;
    try {
        const updatedNote = await Note.findByIdAndUpdate(
            id,
            {
                $set: objetoNota
            },
            {
                new: true,
            }
        );
        if (!updatedNote) return res.sendStatus(404);
        if (req.files?.file) {
            const { file } = req.files;
            if (file) {
                const extension = path.extname(file.name);
                const nombreImagenNota = updatedNote._id.toString() + extension;
                await file.mv(RUTA_FILES_NOTES + nombreImagenNota);
                await fs.remove(file.tempFilePath);
                const urlImage = `assets/images/notes/${nombreImagenNota}`;
                updatedNote.image = urlImage;
            };
        };
        image && (updatedNote.image = "");
        await updatedNote.save();
        const updatedNoteARetornar = {
            id: updatedNote._id,
            title: updatedNote.title,
            content: updatedNote.content,
            tasks: updatedNote.tasks.length > 0 ? (
                updatedNote.tasks.map(({ _id, content, completed }) => ({
                    id: _id,
                    content: content,
                    completed: completed
                }))
            ) : [],
            image: updatedNote.image,
            reminder: updatedNote.reminder,
            labels: updatedNote.labels,
            archived: updatedNote.archived,
            createdAt: updatedNote.createdAt,
            updatedAt: updatedNote.updatedAt
        };
        return res.json(updatedNoteARetornar);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};

export const removeNote = async (req, res) => {
    const { id } = req.params;
    try {
        const note = await Note.findByIdAndDelete(id);
        if (!note) return res.sendStatus(404);
        if (note.image) {
            const imagenABorrar = note.image.replace("assets/images/notes/", "");
            fs.unlink(RUTA_FILES_NOTES + imagenABorrar, (err) => {
                if (err) console.log(error);
            });
        };
        res.status(200).send({ message: "Nota eliminada con éxito." });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};

export const getNotesDia = async (req, res) => {
    const { usuario } = req.params;
    const fecha = new Date();
    const hoy = fecha.toISOString().split('T')[0];
    try {
        const notes = await Note.find({
            $and: [
                { reminder: { $gte: `${hoy}T00:00:00.000Z` } },
                { reminder: { $lt: `${hoy}T23:59:59.999Z` } }
            ]
        }, {
            usuario: 0,
            tasks: 0,
            image: 0,
            labels: 0,
            archived: 0,
            createdAt: 0,
            updatedAt: 0
        }).where('usuario').equals(usuario);
        const notesARetornar = notes.map(({ _id, title, content, reminder }) => ({
            id: _id,
            title: title ? title : content ? content : 'Nota',
            detail: reminder
        }));
        return res.json(notesARetornar);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};

export const getNotesMes = async (req, res) => {
    const { usuario } = req.params;
    const hoy = new Date();
    const ultimoDiaMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
    const hoyVar = hoy.toISOString().split('T')[0];
    const ultimoDiaMesVar = ultimoDiaMes.toISOString().split('T')[0];
    try {
        const notes = await Note.find({
            reminder: {
                $gte: `${hoyVar}T00:00:00.000Z`,
                $lt: `${ultimoDiaMesVar}T23:59:59.999Z`
            }
        }, {
            usuario: 0,
            tasks: 0,
            image: 0,
            labels: 0,
            archived: 0,
            createdAt: 0,
            updatedAt: 0,
            title: 0,
            content: 0,
            reminder: 0
        }).where('usuario').equals(usuario);
        const notesARetornar = notes.map(({ _id }) => ({
            id: _id
        }));
        return res.json(notesARetornar);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};