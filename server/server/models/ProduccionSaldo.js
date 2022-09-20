import mongoose from "mongoose";

const ProduccionSaldoSchema = new mongoose.Schema(
    {
        producto: {
            type: [String],
            required: true,
        },
        familia: {
            type: String,
            enum: ['patin', 'palet', 'taco'],
        },
        semana: {
            type: Number,
        },
        mes: {
            type: String,
        },
        anyo: {
            type: Number,
        },
        saldoInicial: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export default mongoose.model('ProduccionSaldo', ProduccionSaldoSchema);