import { Router } from "express";
import {
    addPedido,
    getPedido,
    updatePedido
} from "../controllers/pedido.controller";

const router = Router();

router.post("/", addPedido);
router.post("/pedido", getPedido);
router.post("/actualizar", updatePedido);

export default router;