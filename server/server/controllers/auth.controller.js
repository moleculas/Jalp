import Usuario from "../models/Usuario";
import { createJWTToken, decodeJWTToken } from "../util/auth";
import { encryptPassword, comparePassword } from "../util/bcrypt";

export const loginUsuario = async (req, res) => {
    try {
        const { email, password } = req.body;
        const usuario = await Usuario.findOne({ email }).select("+password");
        if (!usuario) {
            return res.status(404).send({ message: "Usuario no encontrado." });
        };
        const validPassword = await comparePassword(password, usuario.password);
        if (!validPassword) {
            return res.status(404).send({ message: "Contraseña no válida." });
        };
        const token = createJWTToken({
            _id: usuario._id,
            email: usuario.email,
            displayName: usuario.displayName,
        });
        return res.json({
            usuario: {
                _id: usuario._id,
                displayName: usuario.displayName,
                email: usuario.email,
                photoURL: usuario.photoURL,
                shortcuts: usuario.shortcuts,
                role: usuario.role,
                telefono: usuario.telefono,
                direccion: usuario.direccion,
                fechaNacimiento: usuario.fechaNacimiento,
                descripcion: usuario.descripcion
            },
            token: token
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};

export const loginPorToken = async (req, res) => {
    try {
        const { token } = req.body;
        const tokenDecodificado = decodeJWTToken(token);
        const usuario = await Usuario.findById(tokenDecodificado.user._id);
        if (!usuario) {
            return res.status(404).send({ message: "Usuario no encontrado." });
        };
        const tokenActualizado = createJWTToken({
            _id: usuario._id,
            email: usuario.email,
            displayName: usuario.displayName,
        });
        return res.json({
            usuario: {
                _id: usuario._id,
                displayName: usuario.displayName,
                email: usuario.email,
                photoURL: usuario.photoURL,
                shortcuts: usuario.shortcuts,
                role: usuario.role,
                telefono: usuario.telefono,
                direccion: usuario.direccion,
                fechaNacimiento: usuario.fechaNacimiento,
                descripcion: usuario.descripcion,
            },
            token: tokenActualizado
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};

export const reseteaPassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        const encryptedPass = await encryptPassword(password);
        const updatedUsuario = await Usuario.findOneAndUpdate(
            { "email": email },
            { $set: { "password": encryptedPass } },
            {
                returnNewDocument: true
            }
        );
        if (!updatedUsuario) {
            return res.status(404).send({ message: "Error al actualizar contraseña." });
        };
        res.status(200).send({ message: "Contraseña actualizada." });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};