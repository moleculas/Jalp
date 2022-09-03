import { Router } from "express";
import {
   registrarUsuario,  
   actualizarUsuario,
   obtenerUsuarios,
   eliminarUsuario
} from "../controllers/usuarios.controller";
import middlewares from "../middlewares";

const router = Router();

router.post("/registrar", middlewares.verifySignUp, registrarUsuario);
router.post("/actualizar", middlewares.verifyFileExists, actualizarUsuario);
router.get("/", obtenerUsuarios);
router.delete("/:id", eliminarUsuario);

export default router;