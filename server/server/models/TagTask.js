import mongoose from "mongoose";

const TagTaskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export default mongoose.model('TagTask', TagTaskSchema);