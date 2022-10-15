import mongoose from "mongoose";

const ProduccionLXSchema = new mongoose.Schema(
    {
        producto: {
            type: String,
            required: true,
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
        cargas: {
            type: Number,
            default: 0
        },
        cantidad: {
            type: Number,
            default: 0
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export default mongoose.model('ProduccionLX', ProduccionLXSchema);