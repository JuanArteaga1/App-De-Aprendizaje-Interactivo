const MateriaService = require('../services/MateriaServices');

exports.createMateria = async (req, res) => {
    try {
        const materia = await MateriaService.createMateria(req.body);
        res.status(201).json(materia);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

exports.getMateriaId = async (req, res) => {
    try {
        const materia = await MateriaService.getMateriaId(req.params.id);
        res.status(200).json(materia);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

exports.GetMateriaAll = async (req, res) => {
    try {
        const materias = await MateriaService.getAllMateria();
        res.status(200).json(materias);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

exports.PutMateriaId = async (req, res) => {
    try {
        const materia = await MateriaService.PutMateriaId(req.params.id, req.body);
        res.status(200).json(materia);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

exports.DeleteMateriaId = async (req, res) => {
    try {
        await MateriaService.DeleteMateriaId(req.params.id);
        res.status(200).json({ message: "Materia eliminada exitosamente" });
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};