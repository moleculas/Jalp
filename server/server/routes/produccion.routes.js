import { Router } from "express";
import {
    addProduccion,
    getProduccion,   
    updateProduccionTabla,
    getProduccionLX,
    updateProduccionLX
} from "../controllers/produccion.controller";

const router = Router();

router.post("/", addProduccion);
router.post("/producto", getProduccion);
router.post("/actualizarTabla", updateProduccionTabla);
router.post("/lx", getProduccionLX);
router.post("/actualizarlx", updateProduccionLX);

export default router;