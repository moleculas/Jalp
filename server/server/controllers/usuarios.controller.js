import Usuario from "../models/Usuario";
import UsuarioChat from "../models/UsuarioChat";
import LabelCalendar from "../models/LabelCalendar";
import LabelNote from "../models/LabelNote";
import { encryptPassword } from "../util/bcrypt";
import { tranEmailApi } from "../util/transportMailSiB";
import { RUTA_FILES_AVATARS } from "../config";
import fs from "fs-extra";
import resize from "../util/resize";

export const registrarUsuario = async (req, res) => {
    try {
        const { displayName, email, password, photoURL, shortcuts, role, aplicacion } = JSON.parse(req.body.datos);
        const oldUser = await Usuario.findOne({ email });
        if (oldUser) {
            return res.status(404).send({ message: "Ya hay un usuario registrado con el email " + email + "." });
        };
        const usuario = new Usuario({
            displayName: displayName,
            email: email,
            password: password,
            photoURL: photoURL,
            shortcuts: shortcuts,
            role: role
        });
        usuario.password = await encryptPassword(usuario.password);
        await usuario.save();
        const newUsuarioChat = new UsuarioChat({
            usuario: usuario._id,
            name: usuario.displayName,
            email: usuario.email,
            avatar: usuario.photoURL,
            about: '¡Hola!, estoy usando el chat de la aplicación.'
        });
        await newUsuarioChat.save();
        const newLabel1 = new LabelCalendar({
            title: "Personal",
            color: "#FF0000",
            usuario: usuario._id
        });
        await newLabel1.save();
        const newLabel2 = new LabelCalendar({
            title: "Trabajo",
            color: "#4151B0",
            usuario: usuario._id
        });
        await newLabel2.save();
        const newLabel3 = new LabelCalendar({
            title: "Citas",
            color: "#419388",
            usuario: usuario._id
        });
        await newLabel3.save();
        const newLabelNote = new LabelNote({
            title: "Personal",
            usuario: usuario._id
        });
        await newLabelNote.save();
        const enlace = req.protocol + "://" + req.hostname + "/sign-in";
        const html = "<p>Has sido registrado como usuario " + role[0] + " en la aplicación " + aplicacion + ". Puedes acceder a tu cuenta con la siguiente información:</p>" +
            "<p><b>Usuario: </b>" + email + "</p>" +
            "<p><b>Contaseña: </b>" + password + "</p>" +
            "<p>Enlace: <a href='" + enlace + "' target='_blank'>Enlace a la aplicación</a></p><br />" +
            "<p>Una vez hayas ingresado en el sitio podrás cambiar tu contraseña y editar tu perfil de usuario. ¡Gracias!</p>";
        const sender = { email: 'jalpgestion@gmail.com' };//email registrado en sendinblue
        const receivers = [{ email: email }];
        tranEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            subject: "Nuevo usuario " + aplicacion,
            htmlContent: html
        }).then(function (data) {
            return res.json({
                usuario: {
                    displayName: usuario.displayName,
                    email: usuario.email,
                    role: usuario.role,
                    photoURL: usuario.photoURL,
                    shortcuts: usuario.shortcuts
                },
            });
        }, function (error) {
            console.log(error)
            return res.status(500).json({ message: "Error en el proceso de registro." });
        });
    } catch (error) {       
        return res.status(500).json({ message: error.message });
    };
};

export const actualizarUsuario = async (req, res) => {
    const usuario = JSON.parse(req.body.datos);
    try {
        const email = usuario.email;
        const oldUser = await Usuario.findOne({ email });
        if (oldUser.id !== usuario.id) {
            return res.status(404).send({ message: "Ya hay un usuario registrado con el email " + email + "." });
        };
        if (req.files?.file) {
            const { file } = req.files;
            if (file) {
                const imagenPass = res.locals.nombreImagen;
                await file.mv(RUTA_FILES_AVATARS + imagenPass);
                await fs.remove(file.tempFilePath);
                await resize(RUTA_FILES_AVATARS + imagenPass);
                await fs.remove(RUTA_FILES_AVATARS + imagenPass);
                const fileName = imagenPass.split('.').slice(0, -1).join('.');
                const urlImage = `assets/images/avatars/${fileName}-Dim.jpg`;
                usuario.photoURL = urlImage;
            };
        };
        const updatedPost = await Usuario.findByIdAndUpdate(
            usuario.id,
            { $set: usuario },
            {
                new: true,
            }
        ).select(
            {
                createdAt: 0,
                updatedAt: 0,                   
            }
        );
        const oldUpdatedUsuarioChat = await UsuarioChat.findOne({ usuario: usuario.id });
        const updatedUsuarioChat = await UsuarioChat.findByIdAndUpdate(
            oldUpdatedUsuarioChat._id,
            {
                $set: {
                    name: updatedPost.displayName,
                    email: updatedPost.email,
                    avatar: updatedPost.photoURL
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
        await updatedUsuarioChat.save();
        return res.json({
            usuario: updatedPost
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};

export const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find({}, {
            createdAt: 0,
            updatedAt: 0,
            direccion: 0,
            fechaNacimiento: 0,
            descripcion: 0,
            shortcuts: 0,
            password: 0
        });
        return res.json(usuarios);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};

export const eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await Usuario.findByIdAndDelete(id);
        if (!usuario) return res.sendStatus(404);
        res.status(200).send({ message: "Usuario eliminado con éxito." });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};