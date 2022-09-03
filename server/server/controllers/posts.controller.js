import Post from "../models/Post";
import { RUTA_FILES } from "../config";
import fs from "fs-extra";
import path from "path";

export const getPosts = async (req, res) => {
  try {
    //throw new Error('my new error!');
    const posts = await Post.find({});
    return res.json(posts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  };
};

export const createPost = async (req, res) => {
  try {
    const { title, description } = req.body;
    const file = req.files.image;
    let image = null;
    if (file) {
      const imagenPass = res.locals.nombreImagen;
      await file.mv(RUTA_FILES + imagenPass);
      await fs.remove(req.files.image.tempFilePath);
      const urlImage = `/files/${imagenPass}`;
      image = urlImage;
    };
    const newPost = new Post({ title, description, image });
    await newPost.save();
    return res.json(newPost);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  };
};

export const getPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) return res.sendStatus(404);
    return res.json(post);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  };
};

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const file = req.files.image;
    if (file) {
      const imagenPass = res.locals.nombreImagen;
      await file.mv(RUTA_FILES + imagenPass);
      await fs.remove(req.files.image.tempFilePath);
      const urlImage = `/files/${imagenPass}`;
      req.body.image = urlImage;
    };
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { $set: req.body },
      {
        new: true,
      }
    );
    return res.json(updatedPost);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  };
};

export const removePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByIdAndDelete(id);  
    if (post) {
      const elPath = path.join(__dirname, `../../client/public${post.image}`);      
      await fs.unlink(elPath);
    };
    if (!post) return res.sendStatus(404);
    res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  };
};