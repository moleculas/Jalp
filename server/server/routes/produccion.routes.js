import { Router } from "express";
import {
    addProduccion,
    getProduccion,
    updateProduccionInicial,
    updateProduccionTabla,
    getProduccionInicial
} from "../controllers/produccion.controller";

const router = Router();

router.post("/", addProduccion);
router.post("/producto", getProduccion);
router.post("/actualizarInicial", updateProduccionInicial);
router.post("/actualizarTabla", updateProduccionTabla);
router.post("/inicial", getProduccionInicial);

export default router;