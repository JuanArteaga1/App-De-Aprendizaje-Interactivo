const FuncionModelo = require("../models/Funcion")



exports.createFucion = async (Funcion) =>{
    const newFuncion = new FuncionModelo(Funcion)
    await newFuncion.save()
    return newFuncion
}
exports.getAllFuncion = async () => {
    const Funcion = await FuncionModelo.find();
    return Funcion;
};
exports.getFuncionaId = async (id) => {
    const Funcion = await FuncionModelo.findById(id);
    return Funcion;
};
exports.PutFuncionId = async (id,Funcion) => {
    const FuncionActualizar = await FuncionModelo.findByIdAndUpdate(id,Funcion);
    return FuncionActualizar;
};
exports.DeleteFuncionId = async (id,Funcion) => {
    const FuncionEliminar = await FuncionModelo.findByIdAndDelete(id,Funcion);
    return FuncionEliminar;
};