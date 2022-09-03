import { Router } from "express";
import {
    registrarUsuarioChat,
    updateUserData,
    getUserData,
    getUsuariosChat,
    getChat,
    getChats,
    sendMessage,
    getChatsPendientes,
    actualizarChat,
    getActualizacionChat
} from "../controllers/chat.controller";

const router = Router();

router.post("/user", registrarUsuarioChat);
router.put("/user/:id", updateUserData);
router.get("/user/:usuario", getUserData);
router.get("/users", getUsuariosChat);
router.post("/chat", getChat);
router.post("/chats", getChats);
router.post("/chats/message", sendMessage);
router.get("/pendientes/:usuario", getChatsPendientes);
router.post("/chat/actualizar", actualizarChat);
router.post("/chat/refresh", getActualizacionChat);

export default router;