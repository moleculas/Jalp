import mongoose from "mongoose";

const ColumnaSchema = new mongoose.Schema(
    {
        pantalla: {
            type: String,
            required: true
        }, 
        columnas: {
            type: [{
                proveedor: {
                    type: String
                },
                visible: {
                    type: Boolean,
                }
            }]
        },  
        mes: {
            type: String,
        },
        anyo: {
            type: Number,
        }     
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export default mongoose.model("Columna", ColumnaSchema);