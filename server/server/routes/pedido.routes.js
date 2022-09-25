import { Router } from "express";
import {
    addPedido,
    getPedido,
    updatePedido,
    addPedidoProducto,
    getPedidoProducto,
} from "../controllers/pedido.controller";

const router = Router();

router.post("/", addPedido);
router.post("/pedido", getPedido);
router.post("/actualizar", updatePedido);
router.post("/producto", addPedidoProducto);
router.get("/producto/:tipo", getPedidoProducto);

export default router;