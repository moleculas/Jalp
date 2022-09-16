import mongoose from "mongoose";

const ProduccionInicialSchema = new mongoose.Schema(
    {
        producto: {
            type: String,
            required: true,
        },
        familia: {
            type: String,
            enum: ['patin', 'palet', 'taco'],
        },
        mes: {
            type: String,
        },
        anyo: {
            type: Number,
        },
        stockInicial: {
            type: Number,
            default: 0
        },              
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export default mongoose.model('ProduccionInicial',ProduccionInicialSchema);