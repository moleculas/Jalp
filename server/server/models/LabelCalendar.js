import mongoose from "mongoose";

const LabelCalendarSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        color: {
            type: String,
            required: true
        },
        usuario: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Usuario'
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export default mongoose.model("LabelCalendar", LabelCalendarSchema);