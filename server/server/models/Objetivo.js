import mongoose from "mongoose";

const ObjetivoSchema = new mongoose.Schema(
    {
        producto: {
            type: String,
            required: true,
        },
        palets: {
            type: Number,
        },
        saldo: {
            type: Number,
        },
        historicoPalets: {
            type: [{
                palets: {
                    type: Number
                },
                fecha: {
                    type: Date
                }
            }]
        },
        historicoSaldo: {
            type: [{
                saldo: {
                    type: Number
                },
                fecha: {
                    type: Date
                }
            }]
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export default mongoose.model('Objetivo', ObjetivoSchema);