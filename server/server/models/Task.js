import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        usuario: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Usuario'
        },
        type: {
            type: String,
            enum: ['task', 'section'],
            default: 'task'
        },
        notes: {
            type: String
        },
        completed: {
            type: Boolean,
        },
        dueDate: {
            type: Date
        },
        priority: {
            type: Number,
            enum: [0, 1, 2],
            default: 0
        },
        tags: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'TagTask'
                }
            ]
        },
        order: {
            type: Number,
        },
        subTasks: {
            type: [{
                title: {
                    type: String,
                    trim: true
                },
                completed: {
                    type: Boolean,
                }
            }]
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export default mongoose.model('Task', TaskSchema);