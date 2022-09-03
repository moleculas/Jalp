import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
    {
        usuario: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Usuario'
        },
        contactId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'UsuarioChat'
        },
        unreadCountUsuario: {
            type: Number,
        },
        mutedUsuario: {
            type: Boolean,
        },
        unreadCountContactId: {
            type: Number,
        },
        mutedContactId: {
            type: Boolean,
        },
        lastMessage: {
            type: String
        },
        lastMessageAt: {
            type: Date
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export default mongoose.model('Chat', ChatSchema);