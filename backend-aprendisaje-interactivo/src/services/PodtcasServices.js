const PodtcasModel = require('../models/Podtcas');
const { ELiminarArchivos } = require("../middlewares/MulterConfig");


//obtenemos todos los estudiantes
exports.getAllPodtcas = async () => {
    const Podtcas = await PodtcasModel.find();
    return Podtcas;
};

//obtenemos un estudiante por su id
exports.getAllPodtcasId = async (id) => {
    const Podtcas = await PodtcasModel.find({ Usuario: id });
    return Podtcas;
};

//creamos un nuevo estudiante
exports.createPodtcas = async (Podtcas) => {
    const newPodtcas = new PodtcasModel(Podtcas);
    await newPodtcas.save();
    return newPodtcas;

};

//actualizamos un estudiante
exports.updatedPodtcasId = async (id, Podtcas) => {
    const updatedPodtcas = await PodtcasModel.findByIdAndUpdate(id, Podtcas);
    return updatedPodtcas;
};

//eliminamos un estudiante
exports.deletePodtcas = async (id) => {
    const Ruta = await PodtcasModel.findById(id)
    await ELiminarArchivos(Ruta.urlimg)
    await PodtcasModel.findByIdAndDelete(id);
    return true
};