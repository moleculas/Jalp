import mongoose from "mongoose";

const MessageChatSchema = new mongoose.Schema(
    {
        chatId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Chat'
        },
        contactId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'UsuarioChat'
        },
        value: {
            type: String
        },
        createdAt: {
            type: Date
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export default mongoose.model('MessageChat', MessageChatSchema);