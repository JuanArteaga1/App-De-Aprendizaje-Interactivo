const CategoriaService = require('../services/CategoriasServices');
//CONTROLADOR PARA CREAR PERSONA
exports.createCategoria = async (req, res) => {
    try {
        const Categoria = await CategoriaService.createCategoria(req.body);
        res.status(201).json(Categoria);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};
//CONTROLADOR PARA MOSTARA PERSONAS CON ID
exports.GetCategoriaId = async (req, res) => {
    try {
        const Categoria = await CategoriaService.getCategoriaId(req.params.id, req.body);
        res.status(201).json(Categoria);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};
//CONTROLADOR PARA MOSTRAR PERSONAS QUE ESTA REGISTRADAS
exports.GetCategoriaAll = async (req, res) => {
    try {
        const Categoria = await CategoriaService.getAllCategoria(req.body);
        res.status(201).json(Categoria);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};
//CONTROLADOR PARA ACTUALIZAR PERSONA CON ID
exports.PutCategoriaId = async (req, res) => {
    try {
        const Categoria = await CategoriaService.PutCategoriaId(req.params.id, req.body);
        res.status(201).json(Categoria);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};
//CONTROLADOR PARA ELIMINAR PERSONA CON ID
exports.DeleteCategoriaId = async (req, res) => {
    try {
        const Categoria = await CategoriaService.DeleteCategoriaId(req.params.id,);
        res.status(200).json({ message: "Persona deleted successfully" });

    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

