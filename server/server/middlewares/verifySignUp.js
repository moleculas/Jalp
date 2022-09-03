import Usuario from "../models/Usuario";

const verifySignUp = async (req, res, next) => {
    try {
        const usuario = await Usuario.findOne({ email: req.body.email });
        if (usuario) {
            res.status(400).send({ message: "Fallo! El email ya está en uso." });
            return;
        };
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
    next();
};

export default verifySignUp;