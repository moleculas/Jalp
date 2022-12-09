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

export const getCotizaciones = async (req, res) => {
    try {
        const cotizaciones = await Cotizacion.find({}, {
            createdAt: 0,
            updatedAt: 0,
            unidades: 0,
            filasCuerpo: 0,
            sumCuerpo: 0,
            clavos: 0,
            corte_madera: 0,
            montaje: 0,
            patines: 0,
            transporte: 0,
            tratamiento: 0,
            desperdicio: 0,
            varios: 0,
            sumLateralSup: 0,
            cu: 0,
            precio_venta: 0,
            mc: 0,
            mc_porcentaje: 0,
            porcentaje: 0,
            jalp: 0,
            total: 0
        });
        return res.json(cotizaciones);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};

export const getCotizacion = async (req, res) => {
    const { id } = req.params;
    try {
        const cotizacion = await Cotizacion.findById(id, {
            createdAt: 0,
            updatedAt: 0,
        });
        if (!cotizacion) return res.sendStatus(404);
        return res.json(cotizacion);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};