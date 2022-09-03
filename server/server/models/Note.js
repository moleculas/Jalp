import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema(
    {
        title: {
            type: String
        },
        usuario: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Usuario'
        },
        content: {
            type: String
        },
        tasks: {
            type: [{
                content: {
                    type: String
                },
                completed: {
                    type: Boolean,
                }
            }]
        },
        image: {
            type: String
        },
        reminder: {
            type: Date
        },
        labels: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'LabelNotes'
                }
            ]
        },
        archived: {
            type: Boolean,
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export default mongoose.model("Note", NoteSchema);