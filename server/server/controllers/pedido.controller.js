import Pedido from "../models/Pedido";
import ProduccionTabla from "../models/ProduccionTabla";

export const getPedido = async (req, res) => {
    try {
        const { periodo, anyo, proveedor } = JSON.parse(req.body.datos);
        const arrayPedido = [];
        const semanas = periodo.map(semana => semana.semana);
        for (let i = 0; i < semanas.length; i++) {
            const pedido = await Pedido.findOne(
                {
                    semana: semanas[i],
                    anyo,
                    proveedor
                },
                {
                    createdAt: 0,
                    updatedAt: 0,
                }
            );
            if (!pedido) {
                const newPedidoARetornar = {
                    _id: null,
                    semana: periodo[i].semana,
                    mes: periodo[i].mes,
                    anyo: periodo[i].anyo,
                    proveedor,
                    linea: []
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

export const getPedidosMenu = async (req, res) => {
    try {
        const { semana, anyo } = JSON.parse(req.body.datos);
        const pedidos = await Pedido.find(
            {
                semana,
                anyo
            },
            {
                createdAt: 0,
                updatedAt: 0,
            }
        );
        if (!pedidos) return res.sendStatus(404);
        return res.json(pedidos);
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
    const { _id, proveedor, semana, mes, anyo, linea, updProduccionTabla } = JSON.parse(req.body.datos);
    let pedidoARetornar;
    try {
        //actualizar pedido
        if (!_id) {
            const newPedido = new Pedido({
                proveedor,
                semana,
                mes,
                anyo,
                linea
            });
            await newPedido.save();
            const newPedidoARetornar = {
                _id: newPedido._id,
                proveedor: newPedido.proveedor,
                semana: newPedido.semana,
                mes: newPedido.mes,
                anyo: newPedido.anyo,
                linea: newPedido.linea
            };
            pedidoARetornar = newPedidoARetornar;
        } else {
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
            ).select(
                {
                    createdAt: 0,
                    updatedAt: 0,                   
                }
            );
            if (!updatedPedido) return res.sendStatus(404);           
            pedidoARetornar = updatedPedido;
        };
        //actualizar producción
        if (updProduccionTabla.estado) {
            const existeProduccionTabla = await ProduccionTabla.findOne(
                {
                    semana,
                    anyo,
                    proveedor
                },
                {
                    createdAt: 0,
                    updatedAt: 0,
                }
            );
            if (existeProduccionTabla) {
                const arrProveedores = [...existeProduccionTabla.proveedores];
                const index = arrProveedores.findIndex(prov => prov.proveedor === proveedor);
                let objProveedor = arrProveedores[index];
                objProveedor.cantidad = updProduccionTabla.obj.unidades;
                arrProveedores[index] = objProveedor;
                const updatedProduccionTabla = await ProduccionTabla.findByIdAndUpdate(
                    {
                        _id: existeProduccionTabla._id.toString()
                    },
                    {
                        $set: {
                            proveedores: arrProveedores,
                        }
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
                if (!updatedProduccionTabla) return res.sendStatus(404);                
            } else {                
                const proveedores = [{ proveedor, cantidad: updProduccionTabla.obj.unidades }];
                const newProduccionTabla = new ProduccionTabla({
                    producto: updProduccionTabla.obj.producto,
                    familia: updProduccionTabla.obj.familia,
                    semana,
                    mes,
                    anyo,
                    proveedores
                });
                await newProduccionTabla.save();
            };
        };
        return res.json(pedidoARetornar);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};

