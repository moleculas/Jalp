import Escandallo from "../models/Escandallo";

export const getEscandallos = async (req, res) => {
    try {
        const escandallos = await Escandallo.find({}, {
            createdAt: 0,
            updatedAt: 0
        });
        return res.json(escandallos);
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
    const { escandallo } = JSON.parse(req.body.datos);
    try {
        escandallo.map(async (item) => {
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
        });
        const escandallos = await Escandallo.find({}, {
            createdAt: 0,
            updatedAt: 0
        });
        return res.json(escandallos);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};

