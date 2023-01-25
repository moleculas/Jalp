import { Router } from "express";
import {
    addPedido,
    getPedido,
    updatePedido,
    getPedidosMenu
} from "../controllers/pedido.controller";

const router = Router();

router.post("/", addPedido);
router.post("/pedido", getPedido);
router.post("/actualizar", updatePedido);
router.post("/pedidosMenu", getPedidosMenu);

export default router;