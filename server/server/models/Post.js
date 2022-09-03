import mongoose from "mongoose";

const PostsSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true, //elimina espacios en blanco
        },
        description: {
            type: String,
            required: true
        },
        image: {   
            type: String,   
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export default mongoose.model("Post", PostsSchema);