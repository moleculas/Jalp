import Pedido from "../models/Pedido";
import PedidoProducto from "../models/PedidoProducto";

export const getPedido = async (req, res) => {
    try {
        const { periodo, anyo, tipo } = JSON.parse(req.body.datos);
        const arrayPedido = [];
        const semanas = periodo.map(semana => semana.semana);
        for (let i = 0; i < semanas.length; i++) {
            const pedido = await Pedido.findOne(
                {
                    semana: semanas[i],
                    anyo,
                    tipo
                },
                {
                    createdAt: 0,
                    updatedAt: 0,
                }
            );
            if (!pedido) {
                const newPedido = new Pedido({
                    tipo,
                    semana: periodo[i].semana,
                    mes: periodo[i].mes,
                    anyo: periodo[i].anyo
                });
                await newPedido.save();
                const newPedidoARetornar = {
                    _id: newPedido._id,
                    semana: newPedido.semana,
                    mes: newPedido.mes,
                    anyo: newPedido.anyo
                };
                arrayPedido.push(newPedidoARetornar);
            } else {
                arrayPedido.push(pedido);
            };
        };
        return res.json(arrayPedido);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};

export const addPedido = async (req, res) => {
    try {
        const { tipo, numero, semana, mes, anyo } = req.body;
        const newPedido = new Pedido({ tipo, numero, semana, mes, anyo });
        await newPedido.save();
        return res.json(newPedido);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};

export const updatePedido = async (req, res) => {
    const { _id, linea } = JSON.parse(req.body.datos);
    try {
        const updatedPedido = await Pedido.findByIdAndUpdate(
            _id,
            {
                $set: {
                    linea,
                }
            },
            {
                new: true,
            }
        );
        if (!updatedPedido) return res.sendStatus(404);
        await updatedPedido.save();
        const updatedPedidoARetornar = {
            _id: updatedPedido._id,
            tipo: updatedPedido.tipo,
            semana: updatedPedido.semana,
            mes: updatedPedido.mes,
            anyo: updatedPedido.anyo,
            linea: updatedPedido.linea
        };
        return res.json(updatedPedidoARetornar);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};

export const addPedidoProducto = async (req, res) => {
    try {
        const { producto, tipo, largo, ancho, grueso } = req.body;
        const newPedidoProducto = new PedidoProducto({ producto, tipo, largo, ancho, grueso });
        await newPedidoProducto.save();
        return res.json(newPedidoProducto);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};

export const getPedidoProducto = async (req, res) => {
    const { tipo } = req.params;
    try {
        const pedidoProducto = await PedidoProducto.find({
            tipo
        }, {
            createdAt: 0,
            updatedAt: 0,
            _id: 0
        });
        return res.json(pedidoProducto);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};

