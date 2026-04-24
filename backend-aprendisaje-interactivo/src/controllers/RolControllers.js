const RolService = require('../services/RolServices');
//CONTROLADOR PARA CREAR PERSONA
exports.createRol = async (req, res) => {
    try {
        const Rol = await RolService.createRol(req.body);
        res.status(201).json(Rol);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};
//CONTROLADOR PARA MOSTARA PERSONAS CON ID
exports.GetRolId = async (req, res) => {
    try {
        const Rol = await RolService.getRolId(req.params.id, req.body);
        res.status(201).json(Rol);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};
//CONTROLADOR PARA MOSTRAR PERSONAS QUE ESTA REGISTRADAS
exports.GetRolAll = async (req, res) => {
    try {
        const Rol = await RolService.getAllRol(req.body);
        res.status(201).json(Rol);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};
//CONTROLADOR PARA ACTUALIZAR PERSONA CON ID
exports.PutRolId = async (req, res) => {
    try {
        const Rol = await RolService.PutRolId(req.params.id, req.body);
        res.status(201).json(Rol);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};
//CONTROLADOR PARA ELIMINAR PERSONA CON ID
exports.DeleteRolId = async (req, res) => {
    try {
        const Rol = await RolService.DeleteRolId(req.params.id,);
        res.status(200).json({ message: "Persona deleted successfully" });

    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};