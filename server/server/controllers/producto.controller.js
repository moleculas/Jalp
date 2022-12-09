import Producto from "../models/Producto";

export const addProducto = async (req, res) => {
    const producto = JSON.parse(req.body.datos);
    try {
        const newProducto = new Producto(producto);
        await newProducto.save();
        return res.json(newProducto);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};

export const deleteProducto = async (req, res) => {
    const { id } = req.params;
    try {
        const producto = await Producto.findByIdAndDelete(id);
        if (!producto) return res.sendStatus(404);
        res.status(200).send({ message: "Registro eliminado con éxito." });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};

export const updateProducto = async (req, res) => {
    const producto = JSON.parse(req.body.datos);
    const { id } = req.params;
    try {
        const updatedProducto = await Producto.findByIdAndUpdate(
            id,
            {
                $set: producto
            },
            {
                new: true,
            }
        );
        await updatedProducto.save();
        return res.json(updatedProducto);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};

export const getProductos = async (req, res) => {   
    const { familia } = JSON.parse(req.body.datos);   
    try {       
        const productos = await Producto.find({
            familia
        }, {
            createdAt: 0,
            updatedAt: 0,           
        });
        return res.json(productos);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};

export const getProducto = async (req, res) => {
    const { id } = req.params;
    try {
        const producto = await Producto.findById(id, {
            createdAt: 0,
            updatedAt: 0,
        });
        if (!producto) return res.sendStatus(404);
        return res.json(producto);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};