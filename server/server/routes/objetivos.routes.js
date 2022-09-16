import { Router } from "express";
import {
    addObjetivo,
    getObjetivos,
    updateObjetivos
} from "../controllers/objetivos.controller";

const router = Router();

router.post("/", addObjetivo);
router.get("/", getObjetivos);
router.post("/actualizar", updateObjetivos);

export default router;