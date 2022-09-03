import EventCalendar from "../models/EventCalendar";
import Task from "../models/Task";
import Note from "../models/Note";
import Chat from "../models/Chat";
import File from "../models/File";
import UsuarioChat from "../models/UsuarioChat";

export const getItems = async (req, res) => {
  const { usuario } = req.params;
  try {
    let eventsARetornar = null;
    let tasksARetornar = null;
    let notesARetornar = null;
    let chatsARetornar = null;
    let filesARetornar = null;
    const events = await EventCalendar.find({}, {
      usuario: 0,
      allDay: 0,
      start: 0,
      end: 0,
      label: 0,
      updatedAt: 0
    }).where('usuario').equals(usuario).sort('-_id').limit(2);
    if (events) {
      eventsARetornar = events.map(({ _id, title, desc, createdAt }) => ({
        id: _id,
        title: title,
        desc: desc,
        fecha: createdAt,
        tipo: 'event'
      }));
    };
    const tasks = await Task.find({}, {
      usuario: 0,
      type: 0,
      priority: 0,
      tags: 0,
      order: 0,
      subTasks: 0,
      updatedAt: 0
    }).where('usuario').equals(usuario).sort('-_id').limit(2);
    if (tasks) {
      tasksARetornar = tasks.map(({ _id, title, createdAt }) => ({
        id: _id,
        title: title,
        fecha: createdAt,
        tipo: 'task'
      }));
    };
    const notes = await Note.find({}, {
      usuario: 0,
      tasks: 0,
      reminder: 0,
      labels: 0,
      archived: 0,
      updatedAt: 0
    }).where('usuario').equals(usuario).sort('-_id').limit(2);
    if (notes) {
      notesARetornar = notes.map(({ _id, title, content, createdAt }) => ({
        id: _id,
        title: title,
        content: content,
        fecha: createdAt,
        tipo: 'nota'
      }));
    };
    const usuarioChat = await UsuarioChat.findOne({ usuario: usuario });
    const chats = await Chat.find({ lastMessage: { $ne: "" } }, {
      usuario: 0,
      unreadCountUsuario: 0,
      mutedUsuario: 0,
      unreadCountContactId: 0,
      mutedContactId: 0,
      createdAt: 0,
      updatedAt: 0
    }).where('usuario').equals(usuarioChat._id.toString()).sort('-_id').limit(2);
    if (chats) {
      chatsARetornar = [];
      let objetoChat = {};
      chats.map(async (chat) => {
        const contactUser = await UsuarioChat.findOne({ _id: chat.contactId });
        objetoChat = {
          id: chat._id,
          contactId: contactUser.usuario.toString(),
          lastMessage: chat.lastMessage,
          fecha: chat.lastMessageAt,
          tipo: 'chat'
        };
        chatsARetornar.push(objetoChat);
      });
    };
    const files = await File.find({}, {
      usuario: 0,
      size: 0,
      description: 0,
      ruta: 0,
      updatedAt: 0
    }).sort('-_id').limit(2);
    if (files) {
      filesARetornar = files.map(({ _id, name, createdBy, type, createdAt, folderId }) => ({
        id: _id,
        name: name,
        createdBy: createdBy,
        type: type,
        fecha: createdAt,
        folderId: folderId,
        tipo: 'file'
      }));
    };
    const arrayADevolver = [];
    eventsARetornar && (arrayADevolver.push(...eventsARetornar));
    tasksARetornar && (arrayADevolver.push(...tasksARetornar));
    notesARetornar && (arrayADevolver.push(...notesARetornar));
    chatsARetornar && (arrayADevolver.push(...chatsARetornar));
    filesARetornar && (arrayADevolver.push(...filesARetornar));
    arrayADevolver.sort((a, b) => Date.parse(b.fecha) - Date.parse(a.fecha));
    return res.json(arrayADevolver);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  };
};