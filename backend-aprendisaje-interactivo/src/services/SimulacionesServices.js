const SimulacionesModel = require('../models/Simulaciones');
const { ELiminarArchivos } = require("../middlewares/MulterConfig");




exports.createSimulaciones = async (Simulaciones) => {
    try {
        const newsimulaciones = new SimulacionesModel(Simulaciones)
        await newsimulaciones.save()
        return newsimulaciones
    } catch (error) {
        console.log(error)
    }
}
exports.getAllSimulaciones = async () => {
    const Simulaciones = await SimulacionesModel.find()
    .populate("materia")
    .sort({ fechaPublicacion: -1 });
    return Simulaciones;
};
exports.getSimulacionesId = async (id) => {
    const Simulaciones = await SimulacionesModel.find({ Usuario: id });
    return Simulaciones;
};
exports.PutSimulacionesId = async (id, Simulaciones) => {
    const SimulacionesUpdate = await SimulacionesModel.findByIdAndUpdate(id, Simulaciones);
    return SimulacionesUpdate;
};
exports.DeleteSimulacionesId = async (id, Simulaciones) => {
    const Ruta = await SimulacionesModel.findById(id)
    await ELiminarArchivos(Ruta.urlDoc)
    await ELiminarArchivos(Ruta.urlimg)
    await ELiminarArchivos(Ruta.urlArchivoapk)
    const SimulacionesDelete = await SimulacionesModel.findByIdAndDelete(id);
    return SimulacionesDelete;
};

exports.incrementDownloads = async (id) => {
  const simulacion = await SimulacionesModel.findById(id);
  if (!simulacion) return null;

  simulacion.downloads = (simulacion.downloads || 0) + 1;
  await simulacion.save();
  return simulacion;
};
