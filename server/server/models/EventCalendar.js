import mongoose from "mongoose";

const EventCalendarSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        allDay: {
            type: Boolean,
        },
        start: {
            type: Date
        },
        end: {
            type: Date
        },
        desc: {
            type: String
        },
        label: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'LabelCalendar'
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

export default mongoose.model("EventCalendar", EventCalendarSchema);