import mongoose from "mongoose";

const ProduccionTablaSchema = new mongoose.Schema(
    {
        producto: {
            type: String,
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
        proveedores: {
            type: [{
                proveedor: {
                    type: String,
                },
                cantidad: {
                    type: Number,
                }
            }]
        },       
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export default mongoose.model('ProduccionTabla', ProduccionTablaSchema);