import mongoose from "mongoose";

const UsuariosSchema = new mongoose.Schema(
    {
        displayName: {
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
        password: {
            type: String,
            required: true,
            trim: true
        },
        photoURL: {
            type: String
        },
        shortcuts: {
            type: [String], default: []
        },
        role: {
            type: [String], default: []
        },
        telefono: {
            type: [{
                telefono: {
                    type: String                 
                },
                etiqueta: {
                    type: String
                }
            }]
        },
        direccion: {
            type: String
        },
        fechaNacimiento: {
            type: Date
        },
        descripcion: {
            type: String
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export default mongoose.model('Usuario', UsuariosSchema);