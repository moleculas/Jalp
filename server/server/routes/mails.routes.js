import { Router } from "express";
import {
    sendMail
} from "../controllers/mails.controller";

const router = Router();

router.post("/send-mail", sendMail);

// router.put("/:id", middlewares.verifyFileExists, updatePost);

// router.delete("/:id", removePost);

export default router;