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
        ).select(
            {
                createdAt: 0,
                updatedAt: 0,
            }
        );
        return res.json(updatedProducto);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};

export const getProductos = async (req, res) => {
    const { familia, min } = JSON.parse(req.body.datos);
    try {
        const productos = await Producto.find({
            familia
        }, {
            createdAt: 0,
            updatedAt: 0,
        });
        if (min) {
            let productosARetornar = [];
            if (familia === "clientes") {
                productos.map((producto) => {
                    if (producto.activo) {
                        productosARetornar.push({
                            descripcion: producto.descripcion
                        });
                    };
                });
            };
            if (familia === "clavos") {
                productos.map((producto) => {
                    if (producto.activo) {
                        productosARetornar.push({
                            descripcion: producto.descripcion,
                            precioUnitario: producto.precioUnitario
                        });
                    };
                });
            };
            if (familia === "maderas") {
                productos.map((producto) => {
                    if (producto.activo) {
                        productosARetornar.push({
                            descripcion: producto.descripcion,
                            largo: producto.largo,
                            ancho: producto.ancho,
                            grueso: producto.grueso,
                            proveedor: producto.proveedor,
                            precioUnitario: producto.precioUnitario,
                            familia: producto.especialMaderas.familia
                        });
                    };
                });
            };
            if (familia === "costesHoraTrabajador") {
                productos.map((producto) => {
                    if (producto.activo) {
                        productosARetornar.push({
                            precioUnitario: producto.precioUnitario,
                            categoria: producto.categoria
                        });
                    };
                });
            };
            if (familia === "proveedores") {
                productos.map((producto) => {
                    if (producto.activo) {
                        productosARetornar.push({
                            _id: producto._id,
                            codigo: producto.codigo
                        });
                    };
                });
            };
            if (familia === "transportes") {
                productos.map((producto) => {
                    if (producto.activo) {
                        productosARetornar.push({
                            _id: producto._id,
                            especialTransportes: producto.especialTransportes,
                            precioUnitario: producto.precioUnitario
                        });
                    };
                });
            };
            if (familia === "costesProcesos") {
                productos.map((producto) => {
                    if (producto.activo) {
                        productosARetornar.push({
                            precioUnitario: producto.precioUnitario,
                            categoria: producto.categoria
                        });
                    };
                });
            };
            if (familia === "objetivos") {
                productos.map((producto) => {
                    if (producto.activo) {
                        productosARetornar.push({
                            descripcion: producto.descripcion,
                            especialObjetivos: producto.especialObjetivos
                        });
                    };
                });
            };
            return res.json(productosARetornar);
        } else {
            return res.json(productos);
        };
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};

export const getProducto = async (req, res) => {
    const { id, nombre, familia } = JSON.parse(req.body.datos);
    try {
        let producto;
        if (id) {
            producto = await Producto.findById(id, {
                createdAt: 0,
                updatedAt: 0,
                historico: 0,
                _id: 0,
                familia: 0,
            });
        };
        if (nombre) {
            producto = await Producto.findOne(
                {
                    descripcion: nombre,
                    familia,
                    activo: true
                },
                {
                    createdAt: 0,
                    updatedAt: 0,
                    historico: 0,
                    _id: 0,
                    precioUnitario: 0,
                    familia: 0,
                    activo: 0,
                    sage: 0
                }
            );
        };
        if (!producto) return res.sendStatus(404);
        return res.json(producto);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};