import mongoose from "mongoose";

const PedidoSchema = new mongoose.Schema(
    {
        proveedor: {
            type: String,            
        },
        numero: {
            type: Number,
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
        linea: {
            type: [{
                producto: {
                    type: String
                },
                unidades: {
                    type: Number
                },
                vol_unitario: {
                    type: Number
                },
                vol_total: {
                    type: Number
                },
            }]
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export default mongoose.model('Pedido', PedidoSchema);