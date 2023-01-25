import { Router } from "express";
import {
    addProducto,
    getProducto,
    getProductos,
    updateProducto,
    deleteProducto
} from "../controllers/producto.controller";

const router = Router();

router.post("/", addProducto);
router.post("/obtenerItem", getProducto);
router.post("/obtener", getProductos);
router.put("/:id", updateProducto);
router.delete("/:id", deleteProducto);

export default router;