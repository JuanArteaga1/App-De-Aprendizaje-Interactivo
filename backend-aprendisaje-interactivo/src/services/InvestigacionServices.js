const InvestigacionModel = require('../models/Investigacion');
const { ELiminarArchivos } = require("../middlewares/MulterConfig");




exports.createInvestigacion = async (Investigacion) => {
    try {
        const newinvestigacion = new InvestigacionModel(Investigacion)
        await newinvestigacion.save()
        return newinvestigacion
    } catch (error) {
        console.log(error)
    }
}
exports.getAllInvestigacion = async () => {
    const Investigacion = await InvestigacionModel.find().populate('materia');
    return Investigacion;
};
exports.getInvestigacionId = async (id) => {
    const Investigacion = await InvestigacionModel.find({ Usuario: id });
    return Investigacion;
};
exports.PutInvestigacionId = async (id, Investigacion) => {
    const InvestigacionUpdate = await InvestigacionModel.findByIdAndUpdate(id, Investigacion, { new: true });
    return InvestigacionUpdate;
};
exports.DeleteInvestigacionId = async (id) => {
    try {
        const Ruta = await InvestigacionModel.findById(id)
        await ELiminarArchivos(Ruta.urlDoc)
        await ELiminarArchivos(Ruta.urlimg)
        const InvestigacionDelete = await InvestigacionModel.findByIdAndDelete(id,);
        return InvestigacionDelete;
    } catch (error) {
        console.log(error)

    }
};