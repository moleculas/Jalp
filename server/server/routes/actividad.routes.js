import { Router } from "express";
import {
    getItems
} from "../controllers/actividad.controller";

const router = Router();

router.get("/:usuario", getItems);

export default router;