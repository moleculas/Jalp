import mongoose from "mongoose";

const EscandalloMermaSchema = new mongoose.Schema(
    {
        cubico: {
            type: Number
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

export default mongoose.model('EscandalloMerma', EscandalloMermaSchema);