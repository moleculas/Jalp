import { Router } from "express";
import {
    addCotizacion,
    getCotizacion,
    getOf,
    getCotizaciones,
    updateCotizacion,
    deleteCotizacion
} from "../controllers/cotizacion.controller";

const router = Router();

router.post("/", addCotizacion);
router.get("/:id", getCotizacion);
router.get("/of/:of", getOf);
router.get("/", getCotizaciones);
router.put("/:id", updateCotizacion);
router.delete("/:id", deleteCotizacion);

export default router;