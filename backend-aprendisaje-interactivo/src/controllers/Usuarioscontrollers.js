
const UsuariosServices = require('../services/UsuariosServices');
const PersonaServices = require('../services/PersonaServices');
const SolicitudesServices = require('../services/SolicitudesServices');
const EnviarEmailServices = require('../services/EnviarEmailServices.js');
const Usuario = require("../models/Usuarios")
const Persona = require("../models/Personas")
const User = require("../models/registro")
const Rol = require('../models/Rol');
const bcrypt = require("bcryptjs")
const { CreateToken, VerifyToken } = require("../libs/jwt")


//creamos un nuevo estudiante
exports.createUsuarios = async (req, res) => {
    const { Nombre, identificacion, email, contrasena, Codigo, rol, estado, funcion } = req.body
    const identificacionEncontada = await Persona.findOne({ NumeroIdentificacion: identificacion });
    if (identificacionEncontada) {
        return res.status(400).json({ errors: [{ msg: "Número de identificación ya registrado" }] });
    }

    const emailEncontrado = await Usuario.findOne({ email: email });
    if (emailEncontrado) {
        return res.status(400).json({ errors: [{ msg: "Email ya registrado" }] });
    }

    const codigoEncontrado = await Usuario.findOne({ Codigo: Codigo });
    if (codigoEncontrado) {
        return res.status(400).json({ errors: [{ msg: "Código ya registrado" }] });
    }

    const RolEncontrado = await Rol.findOne({ tipo_Rol: rol })
    try {
        const contraseñahash = await bcrypt.hash(contrasena, 8)
        const NewUser = new Usuario({
            email,
            contrasena: contraseñahash,
            Codigo,
            rol: RolEncontrado._id,
            estado,
            //funcion,
        })
        const UsuarioSave = await NewUser.save()
        const NewPersona = new Persona({
            UsuarioId: UsuarioSave._id,
            NombreCompleto: Nombre,
            NumeroIdentificacion: identificacion
        })
        const PersonaSave = await NewPersona.save()

        const token = await CreateToken({ rol: RolEncontrado.tipo_Rol })
        res.cookie("token", token)
        res.status(200).json({
            token: token
        })
    } catch (error) {
        console.log("error entro")
        console.log(error.message)
    }
};

exports.GetAllSolicitudes = async (req, res) => {
    try {

        const Solicitudes = await SolicitudesServices.getAllSolicitudes();
        res.status(200).json(Solicitudes);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo solicitudes', error });
    }
}

exports.deleteSolicitudes = async (req, res) => {
    try {
        const { id } = req.params;
        const SolicitudesEliminada = await SolicitudesServices.DeleteSolicitudesId(id);

        if (!SolicitudesEliminada) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json({ message: 'Usuario eliminado correctamente', usuario: SolicitudesEliminada });
    } catch (error) {
        res.status(500).json({ message: 'Error eliminando solicitud', error });
    }
};

exports.RegistrarDocente = async (req, res) => {
    try {
        const userExistente = await User.findOne({ email: req.body.email });
        if (userExistente) {
            return res.status(400).json({ message: "Email ya registrado" });
        }
        const token = await CreateToken({ Email: req.body.email });
        const expirationTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const nuevoDocente = new User({
            email: req.body.email,
            activation_token: token,
            activation_expires: expirationTime
        });

        await nuevoDocente.save();
        await EnviarEmailServices.EnviarEmail(req.body.email, token);
        return res.status(200).json({
            message: "Docente registrado y token generado",
            token: token
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al registrar docente" });
    }
};


exports.ValidarToken = async (req, res) => {
    try {
        console.log("Validando token de activación");
        const { token } = req.params; // el token llega por la URL: /validar/:token
        
        if (!token) {
            return res.status(400).json({ message: "Token no proporcionado" });
        }

        // 1. Buscar usuario con ese token
        const user = await User.findOne({ activation_token: token });

        if (!user) {
            return res.status(404).json({ message: "Token inválido o usuario no encontrado" });
        }
        console.log("Usuario encontrado:", user.email);

        // 2. Verificar si el token expiró
        if (user.activation_expires < Date.now()) {
            return res.status(401).json({ message: "El token ha expirado, solicita uno nuevo" });
        }

        // 3. Actualizar usuario - usar $unset para eliminar campos requeridos
        await User.findByIdAndUpdate(user._id, {
            $set: { is_verified: true },
            $unset: { 
                activation_token: "",
                activation_expires: ""
            }
        });

        console.log("Cuenta activada exitosamente para:", user.email);

        return res.status(200).json({ 
            message: "Cuenta activada con éxito", 
            email: user.email 
        });

    } catch (error) {
        console.error("Error al validar token:", error);
        return res.status(500).json({ message: "Error al validar token" });
    }
};

//obtenemos todos los estudiantes
exports.getAllUsuarios = async (req, res) => {
    try {
        const usuarios = await UsuariosServices.getAllUsuarios()
        res.status(200).json(usuarios);
    } catch (error) {
        console.log(error)
        res.status(404).json({ message: error.message });
    }
};

//obtenemos un estudiante por su id
exports.getAllUsuariosId = async (req, res) => {  // ✅ Ahora coincide con la importación
    try {
        const Usuario = await UsuariosServices.getAllUsuariosId(req.params.id);
        res.status(200).json(Usuario);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};




//actualizamos un estudiante
exports.updatedUsuarioId = async (req, res) => {
    try {
        const identificacionEncontada = await Persona.findOne({ NumeroIdentificacion: req.body.identificacion });
        if (identificacionEncontada) {
            return res.status(400).json({ errors: [{ msg: "Número de identificación ya registrado" }] });
        }
        const Personas = await PersonaServices.PutPersonaId(req.params.id, req.body);
        const Usuario = await UsuariosServices.updatedUsuarioId(req.params.id, req.body);
        res.status(200).json(Usuario);
    } catch (error) {
        console.log(error)
        res.status(404).json({ message: error.message });
    }
};

//eliminamos un estudiante
exports.deleteUsuarios = async (req, res) => {
    try {
        await PersonaServices.DeletePersonaId(req.params.id)
        await UsuariosServices.deleteUsuario(req.params.id);
        res.status(200).json({ message: "usuario deleted successfully" });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};