const UsuariosServices = require('../services/UsuariosServices');
const PersonasServices = require('../services/PersonaServices');


exports.GetPersonaUsuariosAll = async (req, res) => {
    try {
        const TPeronas = await PersonasServices.getAllPersona();
        const Tusuarios = await UsuariosServices.getAllUsuarios();

        const UsuariosCompletos = [];

        Tusuarios.forEach((usuario) => {
            if (usuario.rol.toString() === '67ef646bb8e234d2a04607f3') {
                const persona = TPeronas.find((p) => p.UsuarioId.toString() === usuario._id.toString());

                if (persona) {
                    UsuariosCompletos.push({
                        _id: usuario._id,
                        email: usuario.email,
                        Codigo: usuario.Codigo,
                        estado: usuario.estado,
                        nombre: persona.NombreCompleto,
                        identificacion: persona.NumeroIdentificacion
                    });
                }
            }
        });

        res.status(200).json(UsuariosCompletos);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "error" });
    }
};
