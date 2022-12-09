import mongoose from "mongoose";

const ProductoSchema = new mongoose.Schema(
    {
        descripcion: {
            type: String,
            required: true,
        },
        familia: {
            type: String,
            enum: ['clavos', 'costeHoraTrabajador', 'clientes'],
        },
        categoria: {
            type: [String]
        },       
        sage: {
            type: String,
        },
        precioUnitario: {
            type: Number,
        },
        historico: {
            type: [{
                precioUnitario: {
                    type: Number
                },
                activo: {
                    type: Boolean,
                },
                fecha: {
                    type: Date
                }
            }]
        },
        activo: {
            type: Boolean,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export default mongoose.model('Producto', ProductoSchema);