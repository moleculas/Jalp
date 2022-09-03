import TagTask from "../models/TagTask";
import Task from "../models/Task";

export const createTag = async (req, res) => {
    const { title } = req.body;
    try {
        const newTagTask = new TagTask({
            title: title,
        });
        await newTagTask.save();
        const tagTaskARetornar = { id: newTagTask._id, title: newTagTask.title };
        return res.json(tagTaskARetornar);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};

export const getTags = async (req, res) => {
    try {
        const tags = await TagTask.find({}, {
            createdAt: 0,
            updatedAt: 0
        });
        const tagsARetornar = tags.map(({ _id, title }) => ({ id: _id, title: title }));
        return res.json(tagsARetornar);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};

export const addTask = async (req, res) => {
    const task = JSON.parse(req.body.datos);
    try {
        const newTask = new Task(task);
        await newTask.save();
        const taskARetornar = {
            id: newTask._id,
            title: newTask.title,
            type: newTask.type,
            notes: newTask.notes,
            completed: newTask.completed,
            dueDate: newTask.dueDate,
            priority: newTask.priority,
            tags: newTask.tags,
            order: newTask.order
        };
        return res.json(taskARetornar);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};

export const getTasks = async (req, res) => {
    const { usuario } = req.params;
    try {
        const tasks = await Task.find({}, {
            usuario: 0
        }).where('usuario').equals(usuario);
        const tasksOrdenadas = tasks.sort((a, b) => a.order - b.order);
        const tasksARetornar = tasksOrdenadas.map(({ _id, title, type, notes, completed, dueDate, priority, tags, order }) => ({
            id: _id,
            title: title,
            type: type,
            notes: notes,
            completed: completed,
            dueDate: dueDate,
            priority: priority,
            tags: tags,
            order: order
        }));
        return res.json(tasksARetornar);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};

export const getTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findById(id);
        if (!task) return res.sendStatus(404);
        const taskARetornar = {
            id: task._id,
            title: task.title,
            type: task.type,
            notes: task.notes,
            completed: task.completed,
            dueDate: task.dueDate,
            priority: task.priority,
            tags: task.tags,
            order: task.order
        };
        return res.json(taskARetornar);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};

export const updateTask = async (req, res) => {
    const task = JSON.parse(req.body.datos);
    const { id } = req.params;
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            id,
            {
                $set: task
            },
            {
                new: true,
            }
        );
        if (!updatedTask) return res.sendStatus(404);
        await updatedTask.save();
        const updatedTaskARetornar = {
            id: updatedTask._id,
            title: updatedTask.title,
            type: updatedTask.type,
            notes: updatedTask.notes,
            completed: updatedTask.completed,
            dueDate: updatedTask.dueDate,
            priority: updatedTask.priority,
            tags: updatedTask.tags,
            order: updatedTask.order
        };
        return res.json(updatedTaskARetornar);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};

export const removeTask = async (req, res) => {
    const { id } = req.params;
    try {
        const task = await Task.findByIdAndDelete(id);
        if (!task) return res.sendStatus(404);
        task.type === 'section' ? (
            res.status(200).send({ message: "Sección eliminada con éxito." })
        ) : (
            res.status(200).send({ message: "Tarea eliminada con éxito." })
        );
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};

export const reorderList = async (req, res) => {
    const { nuevoArray, usuario } = JSON.parse(req.body.datos);
    try {
        nuevoArray.map(async (elemento, index) => {
            const updatedTask = await Task.findByIdAndUpdate(
                elemento,
                {
                    $set: { order: index }
                },
                {
                    new: true,
                }
            );
            if (!updatedTask) return res.sendStatus(404);
            await updatedTask.save();
        });
        const tasks = await Task.find({}, {
            usuario: 0
        }).where('usuario').equals(usuario);
        const tasksARetornar = tasks.map(({ _id, title, type, notes, completed, dueDate, priority, tags, order }) => ({
            id: _id,
            title: title,
            type: type,
            notes: notes,
            completed: completed,
            dueDate: dueDate,
            priority: priority,
            tags: tags,
            order: order
        }));
        tasksARetornar.sort((a, b) => a.order - b.order);
        return res.json(tasksARetornar);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};

export const getTasksDia = async (req, res) => {
    const { usuario } = req.params;
    const fecha = new Date();
    const hoy = fecha.toISOString().split('T')[0];
    try {
        const tasks = await Task.find({
            $and: [
                { dueDate: { $gte: `${hoy}T00:00:00.000Z` } },
                { dueDate: { $lt: `${hoy}T23:59:59.999Z` } },
                { completed: false }
            ],
        }, {
            usuario: 0,
            type: 0,
            notes: 0,
            completed: 0,
            tags: 0,
            order: 0,
            priority: 0
        }).where('usuario').equals(usuario);
        const tasksARetornar = tasks.map(({ _id, title, dueDate }) => ({
            id: _id,
            title: title,
            dueDate: dueDate
        }));
        return res.json(tasksARetornar);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};

export const getTasksMes = async (req, res) => {
    const { usuario } = req.params;
    const hoy = new Date();
    const ultimoDiaMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
    const hoyVar = hoy.toISOString().split('T')[0];
    const ultimoDiaMesVar = ultimoDiaMes.toISOString().split('T')[0];
    try {
        const tasks = await Task.find({
            dueDate: {
                $gte: `${hoyVar}T00:00:00.000Z`,
                $lt: `${ultimoDiaMesVar}T23:59:59.999Z`
            },
            completed: false
        }, {
            usuario: 0,
            type: 0,
            notes: 0,
            completed: 0,
            tags: 0,
            order: 0,
            priority: 0,
            title: 0,
            dueDate: 0,
        }).where('usuario').equals(usuario);
        const tasksARetornar = tasks.map(({ _id }) => ({
            id: _id
        }));
        return res.json(tasksARetornar);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};