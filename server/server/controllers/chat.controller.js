import UsuarioChat from "../models/UsuarioChat";
import Chat from "../models/Chat";
import MessageChat from "../models/MessageChat";

export const getUserData = async (req, res) => {
    const { usuario } = req.params;
    try {
        const usuarioChat = await UsuarioChat.findOne({ usuario: usuario });
        if (!usuarioChat) return res.sendStatus(404);
        const usuarioChatARetornar = {
            id: usuarioChat._id,
            name: usuarioChat.name,
            email: usuarioChat.email,
            avatar: usuarioChat.avatar,
            about: usuarioChat.about,
            status: usuarioChat.status
        };
        return res.json(usuarioChatARetornar);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};

export const registrarUsuarioChat = async (req, res) => {
    const { usuario, name, email, avatar, about } = JSON.parse(req.body.datos);
    try {
        const newUsuarioChat = new UsuarioChat({
            usuario: usuario,
            name: name,
            email: email,
            avatar: avatar,
            about: about
        });
        await newUsuarioChat.save();
        return res.json(newUsuarioChat);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};

export const updateUserData = async (req, res) => {
    const { about, status } = JSON.parse(req.body.datos);
    const { id } = req.params;
    try {
        const updatedUsuarioChat = await UsuarioChat.findByIdAndUpdate(
            id,
            { $set: { about: about, status: status } },
            {
                new: true,
            }
        );
        if (!updatedUsuarioChat) return res.sendStatus(404);
        await updatedUsuarioChat.save();
        const updatedUsuarioChatARetornar = {
            id: updatedUsuarioChat._id,
            name: updatedUsuarioChat.name,
            email: updatedUsuarioChat.email,
            avatar: updatedUsuarioChat.avatar,
            about: updatedUsuarioChat.about,
            status: updatedUsuarioChat.status
        };
        return res.json(updatedUsuarioChatARetornar);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};

export const getUsuariosChat = async (req, res) => {
    try {
        const usuarios = await UsuarioChat.find({}, {
            createdAt: 0,
            updatedAt: 0
        });
        const usuariosARetornar = usuarios.map(({ _id, usuario, name, email, avatar, about, status }) => ({
            id: _id,
            usuario: usuario,
            name: name,
            email: email,
            avatar: avatar,
            about: about,
            status: status
        }));
        return res.json(usuariosARetornar);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};

export const getChat = async (req, res) => {
    const { usuario, usuarioChatContacto } = JSON.parse(req.body.datos);
    try {
        const usuarioChat = await UsuarioChat.findOne({ usuario: usuario });
        const chat = await Chat.findOne({ $or: [{ usuario: usuarioChatContacto, contactId: usuarioChat._id.toString() }, { usuario: usuarioChat._id.toString(), contactId: usuarioChatContacto }] });
        let objetoARetornar = null;
        if (!chat) {
            const newChat = new Chat({
                usuario: usuarioChat,
                contactId: usuarioChatContacto,
                unreadCountUsuario: 0,
                mutedUsuario: false,
                unreadCountContactId: 0,
                mutedContactId: false,
                lastMessage: '',
                lastMessageAt: Date.now()
            });
            await newChat.save();
            objetoARetornar = {
                datos: {
                    id: newChat._id,
                    mutedUsuario: newChat.mutedUsuario,
                    mutedContactId: newChat.mutedContactId
                },
                mensajes: []
            };
            return res.json(objetoARetornar);
        } else {
            const elChatId = chat._id.toString();
            const updatedChat = await Chat.findByIdAndUpdate(
                elChatId,
                {
                    $set: {
                        unreadCountUsuario: 0,
                        unreadCountContactId: 0
                    }
                },
                {
                    new: true,
                }
            );
            if (!updatedChat) return res.sendStatus(404);
            const messagesChat = await MessageChat.find({}, {
                updatedAt: 0
            }).where('chatId').equals((chat._id).toString());
            const messagesChatARetornar = messagesChat.map(({ _id, chatId, contactId, value, createdAt }) => ({
                id: _id,
                chatId: chatId,
                contactId: contactId,
                value: value,
                createdAt: createdAt
            }));
            objetoARetornar = {
                datos: {
                    id: chat._id,
                    mutedUsuario: chat.mutedUsuario,
                    mutedContactId: chat.mutedContactId
                },
                mensajes: messagesChatARetornar
            };
            return res.json(objetoARetornar);
        };
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};

export const getActualizacionChat = async (req, res) => {
    const { chatId } = JSON.parse(req.body.datos);
    try {
        const messagesChat = await MessageChat.find({}, {
            updatedAt: 0
        }).where('chatId').equals(chatId);
        const messagesChatARetornar = messagesChat.map(({ _id, chatId, contactId, value, createdAt }) => ({
            id: _id,
            chatId: chatId,
            contactId: contactId,
            value: value,
            createdAt: createdAt
        }));
        return res.json(messagesChatARetornar);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};

export const getChats = async (req, res) => {
    const { usuarioChat } = JSON.parse(req.body.datos);
    try {
        const chats = await Chat.find({ $or: [{ usuario: usuarioChat }, { contactId: usuarioChat }] }, {
            createdAt: 0,
            updatedAt: 0
        });
        const chatsARetornar = chats.map(({ _id, usuario, contactId, unreadCountUsuario, mutedUsuario, unreadCountContactId, mutedContactId, lastMessage, lastMessageAt }) => ({
            id: _id,
            usuario: usuario,
            contactId: contactId,
            unreadCountUsuario: unreadCountUsuario,
            mutedUsuario: mutedUsuario,
            unreadCountContactId: unreadCountContactId,
            mutedContactId: mutedContactId,
            lastMessage: lastMessage,
            lastMessageAt: lastMessageAt
        }));
        return res.json(chatsARetornar);
    } catch (error) {
        return res.status(500).json({ message: 'error.message' });
    };
};

export const sendMessage = async (req, res) => {
    const { messageText, chatId, contactId, timeStamp, estadoUsuarioChat } = JSON.parse(req.body.datos);
    let elInc = null;
    if (estadoUsuarioChat === 'usuario') {
        elInc = { unreadCountUsuario: 1 }
    } else {
        elInc = { unreadCountContactId: 1 }
    };
    try {
        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            {
                $set: {
                    lastMessage: messageText,
                    lastMessageAt: timeStamp
                },
                $inc: elInc
            },
            {
                new: true,
            }
        );
        if (!updatedChat) return res.sendStatus(404);
        const newMessageChat = new MessageChat({
            chatId: chatId,
            contactId: contactId,
            value: messageText,
            createdAt: timeStamp
        });
        await newMessageChat.save();
        return res.json(newMessageChat);
    } catch (error) {
        return res.status(500).json({ message: 'error.message' });
    };
};

export const getChatsPendientes = async (req, res) => {
    const { usuario } = req.params;
    try {
        const usuarioChat = await UsuarioChat.findOne({ usuario: usuario });
        const chats = await Chat.find(
            {
                $or: [
                    { usuario: usuarioChat, unreadCountContactId: { $gt: 0 } },
                    { contactId: usuarioChat, unreadCountUsuario: { $gt: 0 } }
                ]
            },
            {
                createdAt: 0,
                updatedAt: 0
            }
        ).where('lastMessage').ne("");
        const chatsIds = chats.map(chat => chat._id.toString());
        return res.json(chatsIds);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'error.message' });
    };
};

export const actualizarChat = async (req, res) => {
    const { chatId, muted, estadoUsuarioChat } = JSON.parse(req.body.datos);
    let elSet = null;
    if (estadoUsuarioChat === 'usuario') {
        elSet = { mutedUsuario: muted }
    } else {
        elSet = { mutedContactId: muted }
    };
    try {
        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            { $set: elSet },
            {
                new: true,
            }
        );
        if (!updatedChat) return res.sendStatus(404);
        const objetoARetornar = {
            id: updatedChat._id,
            mutedUsuario: updatedChat.mutedUsuario,
            mutedContactId: updatedChat.mutedContactId
        };
        return res.json(objetoARetornar);
    } catch (error) {
        return res.status(500).json({ message: 'error.message' });
    };
};