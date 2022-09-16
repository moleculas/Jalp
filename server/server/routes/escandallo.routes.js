import { Router } from "express";
import {
    addEscandallo,
    getEscandallos,
    updateEscandallo,
    addEscandalloMerma,
} from "../controllers/escandallo.controller";

const router = Router();

router.post("/", addEscandallo);
router.get("/", getEscandallos);
router.post("/actualizar", updateEscandallo);
router.post("/merma", addEscandalloMerma);

export default router;