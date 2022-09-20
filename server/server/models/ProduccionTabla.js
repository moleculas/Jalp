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
        serfocat: {
            type: Number
        },
        masova: {
            type: Number
        },  
        milieu: {
            type: Number
        }, 
        milieu_sala: {
            type: Number
        },
        arias: {
            type: Number
        },       
        losan: {
            type: Number
        },
        sala: {
            type: Number
        }, 
        faucher: {
            type: Number
        },
        llorente: {
            type: Number
        },
        p_marcos: {
            type: Number
        },
        roncal: {
            type: Number
        },
        alonso: {
            type: Number
        },
        ramon: {
            type: Number
        },
        mp_u_f: {
            type: Number
        },
        saldo: {
            type: Number
        },  
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export default mongoose.model('ProduccionTabla', ProduccionTablaSchema);