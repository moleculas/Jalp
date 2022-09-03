import Usuario from "../models/Usuario";
import { createJWTTokenRecuperacion } from "../util/auth";
import { tranEmailApi } from "../util/transportMailSiB";

export const sendMail = async (req, res) => {
    try {
        const { email, origen, aplicacion } = req.body;
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(404).send({ message: "Usuario no encontrado." });
        };
        switch (origen) {
            case "recuperacion_pass":
                const token = createJWTTokenRecuperacion({
                    _id: usuario._id,
                    email: usuario.email
                });
                const enlace = req.protocol + "://" + req.hostname + "/" + token;
                const html = "<p>Has solicitado la modificación de contraseña para tu usuario de " + aplicacion + ". Para modificar la contraseña pulsa el enlace que acompaña el identificador de usuario. Te recordamos que el enlace tan sólo es accesible durante los 30 minutos posteriores al envío de este correo.</p>" +
                    "<p><b>Usuario: </b>" + email + "</p>" +
                    "<p>Enlace: <a href='" + enlace + "' target='_blank'>Enlace de recuperación de contraseña</a></p>" +
                    "<p>Una vez hayas ingresado en el sitio podrás cambiar tu contraseña y editar tu perfil de usuario. ¡Gracias!</p>";
                const sender = { email: 'artikawebmail@gmail.com' };
                const receivers = [{ email: email }];
                tranEmailApi.sendTransacEmail({
                    sender,
                    to: receivers,
                    subject: "Nuevo usuario " + aplicacion,
                    htmlContent: html
                }).then(function (data) {
                    res.status(200).send({ message: "Email enviado" });
                }, function (error) {
                    return res.status(500).json({ message: "Error al enviar el email." });
                });
            default:
        };
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message });
    };
};





