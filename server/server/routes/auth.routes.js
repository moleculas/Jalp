import { Router } from "express";
import {  
   loginUsuario,
   loginPorToken,
   reseteaPassword  
} from "../controllers/auth.controller";

const router = Router();

router.post("/login", loginUsuario);
router.post("/access-token", loginPorToken);
router.post("/reset-password", reseteaPassword);

// router.put("/:id", middlewares.verifyFileExists, updatePost);

// router.delete("/:id", removePost);

export default router;