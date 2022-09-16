import mongoose from "mongoose";

const ProduccionPaletSchema = new mongoose.Schema(
    {        
        semana: {
            type: Number,
        },
        mes: {
            type: String,
        },
        anyo: {
            type: Number,
        },   
        palets: {
            type: Number
        } 
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export default mongoose.model('ProduccionPalet', ProduccionPaletSchema);