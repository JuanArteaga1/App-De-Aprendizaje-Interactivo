
const Usuario = require("../models/Usuarios")
const bcrypt = require("bcryptjs")
const { CreateToken } = require("../libs/jwt");
const Rol = require("../models/Rol")
require('dotenv').config();
const JWT_SECRET = process.env.TOKEN_SECRETA;
const jwt = require("jsonwebtoken");
const TOKEN_EXPIRES = "23h"; // o lo que prefieras



exports.login = async (req, res) => {
    const { email, contrasena } = req.body;
    try {
        const UsuarioLog = await Usuario.findOne({ email });
        if (!UsuarioLog)
            return res.status(400).json({ errors: [{ field: "email", msg: "Credenciales incorrectas" }] });

        const contraselog = await bcrypt.compare(contrasena, UsuarioLog.contrasena);
        if (!contraselog)
            return res.status(400).json({ errors: [{ field: "contrasena", msg: "Credenciales incorrectas" }] });

        // Crear token (payload mínimo; añade lo que necesites)
        const payload = { id: UsuarioLog.id, email: UsuarioLog.email };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRES });

        const RolEncontrado = await Rol.findOne({ _id: UsuarioLog.rol });

        // Poner cookie segura; secure: true solo en producción (requiere HTTPS)
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 1000 * 60 * 60 * 2 // 2 horas (opcional)
        });

        // Devolver solo info del usuario en la respuesta (coincide con frontend)
        res.status(200).json( {
                id: UsuarioLog.id,
                email: UsuarioLog.email,
                rol: RolEncontrado?.tipo_Rol || null
            }
    );
    } catch (error) {
        console.error(error);
        res.status(500).json({ errors: [{ message: "Error en el servidor" }] });
    }
};

exports.loginout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    });
    res.status(200).json({ message: "Sesión cerrada" });
};


exports.Profile = async (req, res) => {
    try {
        // req.user viene del middleware verifyToken
        const userId = req.user?.id;
        if (!userId) return res.status(400).json({ error: "Usuario no encontrado" });

        // obtener datos frescos si lo deseas:
        const usuario = await Usuario.findById(userId).select("-contrasena");
        res.json({ usuario });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al obtener perfil" });
    }
};
