import Cotizacion from "../models/Cotizacion";

export const addCotizacion = async (req, res) => {
    const cotizacion = JSON.parse(req.body.datos);
    try {
        const newCotizacion = new Cotizacion(cotizacion);
        await newCotizacion.save();
        return res.json(newCotizacion);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};

export const getOf = async (req, res) => {
    const { of } = req.params;
    try {
        const cotizacion = await Cotizacion.findOne({ of });
        if (!cotizacion) {
            return res.json({ respuesta: false });
        } else {
            return res.json({ respuesta: true });
        };
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};

export const deleteCotizacion = async (req, res) => {
    const { id } = req.params;
    try {
        const cotizacion = await Cotizacion.findByIdAndDelete(id);
        if (!cotizacion) return res.sendStatus(404);
        res.status(200).send({ message: "Registro eliminado con éxito." });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};

export const updateCotizacion = async (req, res) => {
    const cotizacion = JSON.parse(req.body.datos);
    const { id } = req.params;
    try {
        const updatedCotizacion = await Cotizacion.findByIdAndUpdate(
            id,
            {
                $set: cotizacion
            },
            {
                new: true,
            }
        );
        await updatedCotizacion.save();
        return res.json(updatedCotizacion);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};

export const getCotizacion = async (req, res) => { };
export const getCotizaciones = async (req, res) => { };