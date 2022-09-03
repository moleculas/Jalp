import mongoose from "mongoose";

const UsuarioChatSchema = new mongoose.Schema(
    {
        usuario: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Usuario'
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique: true
        },
        avatar: {
            type: String
        },
        about: {
            type: String
        },
        status: {
            type: String,
            enum: ['online','away','do-not-disturb','offline'],
            default: 'offline'
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export default mongoose.model('UsuarioChat', UsuarioChatSchema);