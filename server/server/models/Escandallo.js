import mongoose from "mongoose";

const EscandalloSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true,
        },
        cubico: {
            type: Number,
        },
        unidades: {
            type: Number,
        },
        familia: {
            type: String,
            enum: ['patin', 'palet'],
        },
        subFamilia: {
            type: String,
            enum: ['patin derecho', 'patin izquierdo', 'patin central'],
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export default mongoose.model('Escandallo', EscandalloSchema);