import mongoose from "mongoose";

const ProductoSchema = new mongoose.Schema(
    {
        descripcion: {
            type: String,
        },
        codigo: {
            type: String,
        },
        familia: {
            type: String,
            enum: [
                'clavos',
                'costesHoraTrabajador',
                'clientes',
                'maderas',
                'costesProcesos',
                'proveedores',
                'transportes',
                'objetivos'
            ],
        },
        proveedor: {
            type: [String],
            default: undefined
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
        categoria: {
            type: [String],
            default: undefined
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
                },
                precioProductoProveedor: {
                    type: Number,
                },
                destino: {
                    type: String,
                },
                vehiculo: {
                    type: String,
                    enum: ['camion', 'trailer', 'trenCarretera'],
                },
                objetivos: {
                    palets: {
                        type: Number
                    },
                    saldo: {
                        type: Number
                    },
                },
            }]
        },
        activo: {
            type: Boolean,
        },
        especialClavos: {
            precioKg: {
                type: Number
            },
            unidadesKg: {
                type: Number
            },
            precioBobina: {
                type: Number
            },
            unidadesBobina: {
                type: Number
            },
        },
        especialTransportes: {
            destino: {
                type: String,
            },
            vehiculo: {
                type: String,
                enum: ['camion', 'trailer', 'trenCarretera'],
            },
            unidadesVehiculo: {
                type: Number
            },
        },
        especialObjetivos: {
            palets: {
                type: Number
            },
            saldo: {
                type: Number
            },
        },
        especialMaderas: {
            familia: {
                type: String,
                enum: ['palet', 'taco', 'patin', ''],
            },
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export default mongoose.model('Producto', ProductoSchema);