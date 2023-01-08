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
            type: String,
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
                vol_unitario: {
                    type: Number
                },
                vol_total: {
                    type: Number
                },
                proveedor: {
                    type: String,
                },
                precio_m3: {
                    type: Number
                },
                precio_total: {
                    type: Number
                },
                filaMerma: {
                    type: [{
                        unidades: {
                            type: Number,
                        },
                        largo: {
                            type: Number,
                        },
                        mat_prima: {
                            type: Number,
                        },
                        vol_merma: {
                            type: Number,
                        },
                        precio_merma: {
                            type: Number,
                        }
                    }]
                }
            }]
        },
        sumCuerpo: {
            type: Number,
        },
        sumVolumen: {
            type: Number,
        },
        merma: {
            sumPrecioMerma: {
                type: Number,
            },
            sumVolumenMerma: {
                type: Number,
            },
            filasMerma: {
                type: Number,
            }
        },
        filasClavos: {
            type: [{
                clavo: {
                    type: String,
                },
                precio_unitario: {
                    type: Number,
                },
                unidades: {
                    type: Number,
                },
                precio_total: {
                    type: Number,
                }
            }]
        },
        sumClavos: {
            type: Number
        },
        filaCorteMadera: {
            type: [{
                cantidadPrecioHora: {
                    type: Number,
                },
                operarios: {
                    type: Number,
                },
                productividad: {
                    type: Number,
                },
                precio_total: {
                    type: Number,
                }
            }]
        },
        sumCorteMadera: {
            type: Number
        },
        filaMontaje: {
            type: [{
                cantidadPrecioHora: {
                    type: Number,
                },
                operarios: {
                    type: Number,
                },
                productividad: {
                    type: Number,
                },
                precio_total: {
                    type: Number,
                }
            }]
        },
        sumMontaje: {
            type: Number
        },
        filaPatines: {
            type: [{
                cantidadPrecioHora: {
                    type: Number,
                },
                operarios: {
                    type: Number,
                },
                productividad: {
                    type: Number,
                },
                precio_total: {
                    type: Number,
                }
            }]
        },
        sumPatines: {
            type: Number
        },
        filaTransporte: {
            type: [{
                transporte: {
                    type: String,
                },
                precio_total: {
                    type: Number,
                }
            }]
        },
        sumTransporte: {
            type: Number
        },
        sumTratamiento: {
            type: Number
        },
        filasExtra: {
            type: [{
                concepto: {
                    type: String,
                },
                precio_total: {
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
        precio: {
            type: Number
        },       
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export default mongoose.model('Cotizacion', CotizacionSchema);