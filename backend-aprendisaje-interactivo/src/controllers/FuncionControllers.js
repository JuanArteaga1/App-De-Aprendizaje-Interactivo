const FuncionService = require('../services/FuncionServices');
//CONTROLADOR PARA CREAR PERSONA
exports.createFuncion = async (req, res) => {
    try {
        const Funcion = await FuncionService.createFucion(req.body);
        res.status(201).json(Funcion);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};
//CONTROLADOR PARA MOSTARA PERSONAS CON ID
exports.GetFuncionId = async (req, res) => {
    try {
        const Funcion = await FuncionService.getFuncionaId(req.params.id, req.body);
        res.status(201).json(Funcion);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};
//CONTROLADOR PARA MOSTRAR PERSONAS QUE ESTA REGISTRADAS
exports.GetFuncionAll = async (req, res) => {
    try {
        const Funcion = await FuncionService.getAllFuncion(req.body);
        res.status(201).json(Funcion);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};
//CONTROLADOR PARA ACTUALIZAR PERSONA CON ID
exports.PutfuncionId = async (req, res) => {
    try {
        const Funcion = await  FuncionService.PutFuncionId(req.params.id, req.body);
        res.status(201).json(Funcion);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};
//CONTROLADOR PARA ELIMINAR PERSONA CON ID
exports.DeleteFuncionId = async (req, res) => {
    try {
        const funcion = await FuncionService.DeleteFuncionId(req.params.id,);
        res.status(200).json({ message: "Persona deleted successfully" });

    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};