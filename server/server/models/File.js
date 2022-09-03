import mongoose from "mongoose";

const FileSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        nameServer: {
            type: String
        },
        folderId: {
            type: String
        },
        createdBy: {
            type: String
        },
        size: {
            type: String
        },
        type: {
            type: String,
            enum: ['folder', 'PDF', 'XLS', 'DOC', 'TXT', 'JPG', 'PNG', 'GIF', 'PPT', 'ZIP', 'MP4'],
        },       
        description: {
            type: String
        },
        ruta: {
            type: String
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export default mongoose.model('File', FileSchema);