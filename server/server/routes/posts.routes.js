import { Router } from "express";
import {
    getPost,
    createPost,
    updatePost,
    removePost,
    getPosts,
} from "../controllers/posts.controller";
import middlewares from "../middlewares";

const router = Router();

router.get("/", getPosts);
router.get("/:id", getPost);
router.post("/", middlewares.verifyFileExists, createPost);
router.put("/:id", middlewares.verifyFileExists, updatePost);
router.delete("/:id", removePost);

export default router;