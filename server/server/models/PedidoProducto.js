import mongoose from "mongoose";

const PedidoProductoSchema = new mongoose.Schema(
    {
        producto: {
            type: String,
            required: true           
        },
        tipo: {
            type: String,
            enum: ['xavi', 'sala', 'masova'],
        },        
        largo: {
            type: Number,
        },
        ancho: {
            type: Number,
        },
        grueso: {
            type: Number,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export default mongoose.model('PedidoProducto', PedidoProductoSchema);