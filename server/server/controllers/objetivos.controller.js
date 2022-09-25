import Objetivo from "../models/Objetivo";

export const getObjetivos = async (req, res) => {
    try {
        const objetivos = await Objetivo.find({}, {
            createdAt: 0,
            updatedAt: 0
        });
        return res.json(objetivos);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};

export const addObjetivo = async (req, res) => {
    try {
        const { producto, palets, saldo, historicoPalets, historicoSaldo } = req.body;
        const newObjetivo = new Objetivo({ producto, palets, saldo, historicoPalets, historicoSaldo });
        await newObjetivo.save();
        return res.json(newObjetivo);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};

export const updateObjetivos = async (req, res) => {
    const { objetivos } = JSON.parse(req.body.datos);
    try {
        objetivos.map(async (item) => {
            let updatedObjetivo = null;
            updatedObjetivo = await Objetivo.findByIdAndUpdate(
                item._id,
                {
                    $set: {
                        palets: item.palets,
                        saldo: item.saldo,
                        historicoPalets: item.historicoPalets,
                        historicoSaldo: item.historicoSaldo,
                    }
                },
                {
                    new: true,
                }
            );
            if (!updatedObjetivo) return res.sendStatus(404);
            await updatedObjetivo.save();
        });
        res.status(200).send({ message: "Objetivos actualizados con éxito." });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};

