const MateriaModelo = require('../models/Materia');

exports.createMateria = async (Materia) =>{
    const newMateria = new MateriaModelo(Materia);
    await newMateria.save();
    return newMateria;
}
exports.getAllMateria = async () =>{
    return await MateriaModelo.find();
};
exports.getMateriaId = async (id) => {
    return await MateriaModelo.findById(id);
};
exports.PutMateriaId = async (id, Materia) =>{
    const MateriaActualizar = await MateriaModelo.findByIdAndUpdate(id,Materia, { new: true });
    return MateriaActualizar; 
};
exports.DeleteMateriaId = async (id) => {
    const MateriaEliminar = await MateriaModelo.findByIdAndDelete(id);
    return MateriaEliminar;
};