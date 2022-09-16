import { Router } from "express";
import {
    addProduccion,
    getProduccion,
    updateProduccionInicial,
    updateProduccionTabla
} from "../controllers/produccion.controller";

const router = Router();

router.post("/", addProduccion);
router.post("/producto", getProduccion);
router.post("/actualizarInicial", updateProduccionInicial);
router.post("/actualizarTabla", updateProduccionTabla);

export default router;