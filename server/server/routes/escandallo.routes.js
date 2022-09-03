import { Router } from "express";
import {
    addEscandallo,
    getEscandallos,
    updateEscandallo
} from "../controllers/escandallo.controller";

const router = Router();

router.post("/", addEscandallo);
router.get("/", getEscandallos);
router.post("/actualizar", updateEscandallo);

export default router;