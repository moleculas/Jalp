import Escandallo from "../models/Escandallo";
import EscandalloMerma from "../models/EscandalloMerma";

export const getEscandallos = async (req, res) => {
    try {
        const objetoEscandallo = { escandallo: [], merma: [] };
        const escandallos = await Escandallo.find({}, {
            createdAt: 0,
            updatedAt: 0
        });
        objetoEscandallo.escandallo = escandallos;
        const escandallosMerma = await EscandalloMerma.find({}, {
            createdAt: 0,
            updatedAt: 0
        });
        objetoEscandallo.merma = escandallosMerma;
        return res.json(objetoEscandallo);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};

export const addEscandallo = async (req, res) => {
    try {
        const { nombre, cubico, unidades, familia, subFamilia } = req.body;
        const newEscandallo = new Escandallo({ nombre, cubico, unidades, familia, subFamilia });
        await newEscandallo.save();
        return res.json(newEscandallo);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};

export const updateEscandallo = async (req, res) => {
    const { objetoEscandallo } = JSON.parse(req.body.datos);
    const objetoEscandalloARetornar = { escandallo: [], merma: [] };
    try {
        if (objetoEscandallo.escandallo.length > 0) {
            objetoEscandallo.escandallo.map(async (item) => {
                let updatedEscandallo = null;
                updatedEscandallo = await Escandallo.findByIdAndUpdate(
                    item._id,
                    {
                        $set: {
                            cubico: item.cubico,
                            unidades: item.unidades
                        }
                    },
                    {
                        new: true,
                    }
                );
                if (!updatedEscandallo) return res.sendStatus(404);
                await updatedEscandallo.save();
            });
        };
        if (objetoEscandallo.merma.length > 0) {
            objetoEscandallo.merma.map(async (item) => {
                let updatedEscandalloMerma = null;
                updatedEscandalloMerma = await EscandalloMerma.findByIdAndUpdate(
                    item._id,
                    {
                        $set: {
                            cubico: item.cubico
                        }
                    },
                    {
                        new: true,
                    }
                );
                if (!updatedEscandalloMerma) return res.sendStatus(404);
                await updatedEscandalloMerma.save();
            });
        };
        const escandallos = await Escandallo.find({}, {
            createdAt: 0,
            updatedAt: 0
        });
        objetoEscandalloARetornar.escandallo = escandallos;
        const escandallosMerma = await EscandalloMerma.find({}, {
            createdAt: 0,
            updatedAt: 0
        });
        objetoEscandalloARetornar.merma = escandallosMerma;
        return res.json(objetoEscandalloARetornar);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};

export const addEscandalloMerma = async (req, res) => {
    try {
        const { nombre, cubico, familia, subFamilia } = req.body;
        const newEscandalloMerma = new EscandalloMerma({ nombre, cubico, familia, subFamilia });
        await newEscandalloMerma.save();
        return res.json(newEscandalloMerma);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};