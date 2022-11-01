import mongoose from "mongoose";

const ProduccionSaldoSchema = new mongoose.Schema(
    {
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