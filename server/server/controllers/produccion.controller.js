import ProduccionTabla from "../models/ProduccionTabla";
import ProduccionInicial from "../models/ProduccionInicial";
import ProduccionPalet from "../models/ProduccionPalet";
import ProduccionSaldo from "../models/ProduccionSaldo";
import ProduccionLX from "../models/ProduccionLX";
import Columna from "../models/Columna";
import Pedido from "../models/Pedido";

export const getProduccionLX = async (req, res) => {
    const { periodo, productos } = JSON.parse(req.body.datos);
    try {
        const arrayProduccionLX = [];
        const semanas = periodo.map(semana => semana.semana);
        for (let i = 0; i < semanas.length; i++) {
            for (let j = 0; j < productos.length; j++) {
                const produccionLX = await ProduccionLX.findOne(
                    {
                        semana: periodo[i].semana,
                        mes: periodo[i].mes,
                        anyo: periodo[i].anyo,
                        producto: productos[j].producto,
                    },
                    {
                        createdAt: 0,
                        updatedAt: 0
                    }
                );
                if (produccionLX) {
                    arrayProduccionLX.push(produccionLX);
                } else {
                    const newProduccionLXARetornar = {
                        _id: null,
                        semana: periodo[i].semana,
                        mes: periodo[i].mes,
                        anyo: periodo[i].anyo,
                        producto: productos[j].producto,
                        cargas: 0,
                        config: 0,
                        cantidad: 0
                    };
                    arrayProduccionLX.push(newProduccionLXARetornar);
                };
            };
        };
        return res.json(arrayProduccionLX);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message });
    };
};

export const updateProduccionLX = async (req, res) => {
    const { linea, semana, mes, anyo, producto } = JSON.parse(req.body.datos);
    try {
        if (!linea._id) {
            const elSet = {
                semana,
                mes,
                anyo,
                producto,
                cargas: linea.cargas,
                config: linea.config,
                cantidad: linea.cantidad
            };
            const newProduccionLX = new ProduccionLX(elSet);
            await newProduccionLX.save();
            return res.json(newProduccionLX);
        } else {
            const updatedProduccionLX = await ProduccionLX.findByIdAndUpdate(
                linea._id,
                {
                    $set: {
                        cargas: linea.cargas,
                        config: linea.config,
                        cantidad: linea.cantidad
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
            if (!updatedProduccionLX) return res.sendStatus(404);
            return res.json(updatedProduccionLX);
        };
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};

export const getProduccionInicial = async (req, res) => {
    const { mes, anyo, productos } = JSON.parse(req.body.datos);
    try {
        const objetoProduccion = { inicial: [], saldo: [] };
        let id = null;
        for (let i = 0; i < productos.length; i++) {
            const produccionInicial = await ProduccionInicial.findOne(
                {
                    mes,
                    anyo,
                    producto: productos[i].producto,
                },
                {
                    createdAt: 0,
                    updatedAt: 0
                }
            );
            const produccionSaldo = await ProduccionSaldo.findOne(
                {
                    mes,
                    anyo
                },
                {
                    createdAt: 0,
                    updatedAt: 0,
                }
            );
            if (produccionInicial) {
                objetoProduccion.inicial.push(produccionInicial);
            } else {
                const newProduccionInicialARetornar = {
                    _id: null,
                    mes,
                    anyo,
                    stockInicial: 0,
                    producto: productos[i].producto,
                    familia: productos[i].familia
                };
                objetoProduccion.inicial.push(newProduccionInicialARetornar);
            };
            if (produccionSaldo) {
                if (id !== produccionSaldo._id.toString()) {
                    objetoProduccion.saldo.push(produccionSaldo);
                };
                id = produccionSaldo._id.toString();
            } else {
                const newProduccionSaldoARetornar = {
                    _id: null,
                    mes,
                    anyo,
                    saldoInicial: 0
                };
                objetoProduccion.saldo.push(newProduccionSaldoARetornar);
            };
        };
        return res.json(objetoProduccion);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message });
    };
};

export const updateProduccionInicial = async (req, res) => {
    const { idInicial, idSaldo, stockInicial, saldoInicial, mes, anyo, producto, familia } = JSON.parse(req.body.datos);
    const objetoProduccionInicial = { inicial: [], saldo: [] };
    try {
        if (!idInicial) {
            const newProduccionInicial = new ProduccionInicial({
                mes,
                anyo,
                stockInicial,
                producto,
                familia
            });
            await newProduccionInicial.save();
            objetoProduccionInicial.inicial.push(newProduccionInicial);
        } else {
            const updatedProduccionInicial = await ProduccionInicial.findByIdAndUpdate(
                idInicial,
                {
                    $set: {
                        stockInicial
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
            if (!updatedProduccionInicial) return res.sendStatus(404);
            objetoProduccionInicial.inicial.push(updatedProduccionInicial);
        };
        if (!idSaldo) {
            const newProduccionSaldo = new ProduccionSaldo({
                mes,
                anyo,
                saldoInicial
            });
            await newProduccionSaldo.save();
            objetoProduccionInicial.saldo.push(newProduccionSaldo);
        } else {
            const updatedProduccionSaldo = await ProduccionSaldo.findByIdAndUpdate(
                idSaldo,
                {
                    $set: {
                        saldoInicial
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
            if (!updatedProduccionSaldo) return res.sendStatus(404);           
            objetoProduccionInicial.saldo.push(updatedProduccionSaldo);
        };
        return res.json(objetoProduccionInicial);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message });
    };
};

export const getProduccion = async (req, res) => {
    const { periodo, mes, anyo, producto } = JSON.parse(req.body.datos);
    try {
        const objetoProduccion = { inicial: [], tabla: [], palet: [], saldo: [] };
        let mesIterado = null;
        const semanas = periodo.map(semana => semana.semana);
        for (let i = 0; i < semanas.length; i++) {
            if (mesIterado !== periodo[i].mes) {
                const produccionInicial = await ProduccionInicial.findOne(
                    {
                        mes: periodo[i].mes,
                        anyo: periodo[i].anyo,
                        producto: periodo[i].producto,
                    },
                    {
                        createdAt: 0,
                        updatedAt: 0,
                        familia: 0,
                        producto: 0
                    }
                );
                if (produccionInicial) {
                    objetoProduccion.inicial.push(produccionInicial);
                } else {
                    const newProduccionInicialARetornar = {
                        _id: null,
                        mes: periodo[i].mes,
                        anyo: periodo[i].anyo,
                        stockInicial: 0
                    };
                    objetoProduccion.inicial.push(newProduccionInicialARetornar);
                };
                const produccionSaldo = await ProduccionSaldo.findOne(
                    {
                        mes: periodo[i].mes,
                        anyo: periodo[i].anyo
                    },
                    {
                        createdAt: 0,
                        updatedAt: 0,
                        producto: 0
                    }
                );
                if (produccionSaldo) {
                    objetoProduccion.saldo.push(produccionSaldo);
                } else {
                    const newProduccionSaldoARetornar = {
                        _id: null,
                        mes: periodo[i].mes,
                        anyo: periodo[i].anyo,
                        saldoInicial: 0
                    };
                    objetoProduccion.saldo.push(newProduccionSaldoARetornar);
                };
                mesIterado = periodo[i].mes;
            };
            const produccionTabla = await ProduccionTabla.findOne(
                {
                    semana: semanas[i],
                    anyo,
                    producto,
                },
                {
                    createdAt: 0,
                    updatedAt: 0,
                    familia: 0,
                    producto: 0
                }
            );
            if (produccionTabla) {
                objetoProduccion.tabla.push(produccionTabla);
            } else {
                const newProduccionTablaARetornar = {
                    _id: null,
                    semana: periodo[i].semana,
                    mes: periodo[i].mes,
                    anyo: periodo[i].anyo,
                    proveedores: []
                };
                objetoProduccion.tabla.push(newProduccionTablaARetornar);
            };
            const produccionPalet = await ProduccionPalet.findOne(
                {
                    semana: semanas[i],
                    anyo
                },
                {
                    createdAt: 0,
                    updatedAt: 0,
                }
            );
            if (produccionPalet) {
                objetoProduccion.palet.push(produccionPalet);
            } else {
                const newProduccionPaletARetornar = {
                    _id: null,
                    semana: periodo[i].semana,
                    mes: periodo[i].mes,
                    anyo: periodo[i].anyo
                };
                objetoProduccion.palet.push(newProduccionPaletARetornar);
            };
        };
        return res.json(objetoProduccion);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message });
    };
};

export const addProduccion = async (req, res) => {
    try {
        const { producto, familia, semana, mes, anyo } = req.body;
        const newProduccionTabla = new ProduccionTabla({ producto, familia, semana, mes, anyo });
        await newProduccionTabla.save();
        const newProduccionInicial = new ProduccionTabla({ producto, familia, semana, mes, anyo });
        await newProduccionInicial.save();
        return res.status(200);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};

export const updateProduccionTabla = async (req, res) => {
    const { datosTabla, datosPalet, mes, anyo, producto, familia, updPedido } = JSON.parse(req.body.datos);
    const objetoProduccion = { tabla: [], palet: [] };
    try {
        //actualizar producción
        const semanasTabla = datosTabla.map(semana => semana._id);
        const semanasPalet = datosPalet.map(semana => semana._id);
        for (let i = 0; i < semanasTabla.length; i++) {
            if (!semanasTabla[i]) {
                let elSetTabla = {
                    proveedores: datosTabla[i].proveedores,
                    producto,
                    familia,
                    semana: datosTabla[i].semana,
                    mes,
                    anyo
                };
                const newProduccionTabla = new ProduccionTabla(elSetTabla);
                await newProduccionTabla.save();
                objetoProduccion.tabla.push(newProduccionTabla);
            } else {
                const updatedProduccionTabla = await ProduccionTabla.findByIdAndUpdate(
                    {
                        _id: semanasTabla[i]
                    },
                    {
                        $set: elSetTabla
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
                objetoProduccion.tabla.push(updatedProduccionTabla);
            };
            if (!semanasPalet[i]) {
                let elSetPalet = {
                    palets: datosPalet[i].palets,
                    semana: datosPalet[i].semana,
                    mes,
                    anyo
                };
                const newProduccionPalet = new ProduccionPalet(elSetPalet);
                await newProduccionPalet.save();
                objetoProduccion.palet.push(newProduccionPalet);
            } else {
                const updatedProduccionPalet = await ProduccionPalet.findByIdAndUpdate(
                    {
                        _id: semanasPalet[i]
                    },
                    {
                        $set: { palets: datosPalet[i].palets }
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
                if (!updatedProduccionPalet) return res.sendStatus(404);
                objetoProduccion.palet.push(updatedProduccionPalet);
            };
        };
        //actualizar pedido
        if (updPedido.estado) {
            const existePedido = await Pedido.findOne(
                {
                    semana: updPedido.obj.semana,
                    anyo,
                    proveedor: updPedido.obj.proveedor
                },
                {
                    createdAt: 0,
                    updatedAt: 0,
                }
            );
            if (existePedido) {
                const arrLineasPedido = existePedido.linea;
                const index = arrLineasPedido.findIndex(linea => linea.producto === updPedido.obj.fila.producto);
                if (updPedido.obj.fila.unidades > 0) {
                    arrLineasPedido[index] = updPedido.obj.fila;
                } else {
                    arrLineasPedido.splice(index, 1);
                };
                const updatedPedido = await Pedido.findByIdAndUpdate(
                    {
                        _id: existePedido._id.toString()
                    },
                    {
                        $set: {
                            linea: arrLineasPedido,
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
            } else {
                const newPedido = new Pedido({
                    proveedor: updPedido.obj.proveedor,
                    semana: updPedido.obj.semana,
                    mes,
                    anyo,
                    linea: [updPedido.obj.fila]
                });
                await newPedido.save();
            };
        };
        return res.json(objetoProduccion);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message });
    };
};

export const getColumnas = async (req, res) => {
    const { pantalla, columnas, mes, anyo } = JSON.parse(req.body.datos);
    try {
        const existeColumna = await Columna.findOne(
            {
                pantalla,
                mes,
                anyo
            },
            {
                createdAt: 0,
                updatedAt: 0,
                pantalla: 0,
            }
        );
        if (!existeColumna) {
            const newColumna = new Columna(
                {
                    pantalla,
                    columnas,
                    mes,
                    anyo
                }
            );
            await newColumna.save();
            return res.json(newColumna);
        } else {
            const arrColumnas = existeColumna.columnas;
            if (arrColumnas.length !== columnas.length) {
                const updatedColumna = await Columna.findByIdAndUpdate(
                    {
                        _id: existeColumna._id.toString()
                    },
                    {
                        $set: { columnas }
                    },
                    {
                        new: true,
                    },
                ).select(
                    {
                        createdAt: 0,
                        updatedAt: 0,                   
                    }
                );
                if (!updatedColumna) return res.sendStatus(404);
                return res.json(updatedColumna);
            } else {
                if (!existeColumna) return res.sendStatus(404);
                return res.json(existeColumna);
            };
        };
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};

export const updateColumnas = async (req, res) => {
    const { _id, columnas } = JSON.parse(req.body.datos);
    try {
        const updatedColumna = await Columna.findByIdAndUpdate(
            {
                _id
            },
            {
                $set: { columnas }
            },
            {
                new: true,
            }
        ).select(
            {
                createdAt: 0,
                updatedAt: 0,
                pantalla: 0
            }
        );
        if (!updatedColumna) return res.sendStatus(404);
        return res.json(updatedColumna);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};

