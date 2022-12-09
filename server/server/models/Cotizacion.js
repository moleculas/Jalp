import mongoose from "mongoose";

const CotizacionSchema = new mongoose.Schema(
    {
        descripcion: {
            type: String,
        },
        fecha: {
            type: Date,
        },
        cliente: {
            type: String,
        },
        of: {
            type: Number,
        },
        unidades: {
            type: Number,
        },
        filasCuerpo: {
            type: [{
                unidades: {
                    type: Number
                },
                largo: {
                    type: Number
                },
                ancho: {
                    type: Number
                },
                grueso: {
                    type: Number
                },
                precio: {
                    type: Number
                },
                vol_unitario: {
                    type: Number
                },
                vol_total: {
                    type: Number
                },
                precio_t: {
                    type: Number
                }
            }]
        },
        sumCuerpo: {
            type: Number,
        },        
        sumVolumen: {
            type: Number,
        },
        sumPrecioMerma: {
            type: Number,
        },
        sumVolumenMerma: {
            type: Number,
        },
        filasExtra: {
            type: [{
                concepto: {
                    type: String,
                },
                total: {
                    type: Number,
                }
            }]
        },       
        sumLateralSup: {
            type: Number
        },
        cu: {
            type: Number
        },
        precio_venta: {
            type: Number
        },
        mc: {
            type: Number
        },
        mc_porcentaje: {
            type: Number
        },
        porcentaje: {
            type: Number
        },
        jalp: {
            type: Number
        },
        total: {
            type: Number
        },
        precio_venta_total: {
            type: Number
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export default mongoose.model('Cotizacion', CotizacionSchema);