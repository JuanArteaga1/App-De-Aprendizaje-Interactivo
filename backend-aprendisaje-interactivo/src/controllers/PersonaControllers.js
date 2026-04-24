const PersonaServices = require('../services/PersonaServices');


//CONTROLADOR PARA CREAR PERSONA
exports.createPersona = async (req, res) => {
    try {
        const Persona = await PersonaServices.createPersona(req.body);
        res.status(201).json(Persona);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};
//CONTROLADOR PARA MOSTARA PERSONAS CON ID
exports.GetPersonaId = async (req, res) => {
    try {
        const Persona = await PersonaServices.getPersonaId(req.params.id, req.body);
        res.status(201).json(Persona);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};
//CONTROLADOR PARA MOSTRAR PERSONAS QUE ESTA REGISTRADAS
exports.GetPersonaAll = async (req, res) => {
    try {
        const Persona = await PersonaServices.getAllPersona(req.body);
        res.status(201).json(Persona);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};
//CONTROLADOR PARA ACTUALIZAR PERSONA CON ID
exports.PutPersonaId = async (req, res) => {
    try {
        const Personas = await PersonaServices.PutPersonaId(req.params.id, req.body);
        res.status(201).json(Personas);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};
//CONTROLADOR PARA ELIMINAR PERSONA CON ID
exports.DeletePersonaId = async (req, res) => {
    try {
        const Persona = await PersonaServices.DeletePersonaId(req.params.id,);
        res.status(200).json({ message: "Persona deleted successfully" });

    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

