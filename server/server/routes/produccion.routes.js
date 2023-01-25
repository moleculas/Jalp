import { Router } from "express";
import {
    addProduccion,
    getProduccion,   
    updateProduccionTabla,
    getProduccionLX,
    updateProduccionLX,
    getProduccionInicial,
    updateProduccionInicial,
    getColumnas,
    updateColumnas
} from "../controllers/produccion.controller";

const router = Router();

router.post("/", addProduccion);
router.post("/producto", getProduccion);
router.post("/actualizarTabla", updateProduccionTabla);
router.post("/lx", getProduccionLX);
router.post("/actualizarlx", updateProduccionLX);
router.post("/inicial", getProduccionInicial);
router.post("/actualizarInicial", updateProduccionInicial);
router.post("/columnas", getColumnas);
router.post("/actualizarColumnas", updateColumnas);

export default router;