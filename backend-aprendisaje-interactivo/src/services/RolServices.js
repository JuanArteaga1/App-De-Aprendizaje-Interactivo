const RolModel = require('../models/Rol');



exports.createRol = async (Rol) =>{
    const newrol = new RolModel(Rol)
    await newrol.save()
    return newrol
}
exports.getAllRol = async () => {
    const Rol = await RolModel.find();
    return Rol;
};
exports.getRolId = async (id) => {
    const Rol = await RolModel.findById(id);
    return Rol;
};
exports.PutRolId = async (id,Rol) => {
    const RolUpdate = await RolModel.findByIdAndUpdate(id,Rol);
    return RolUpdate;
};
exports.DeleteRolId = async (id,Rol) => {
    const RolDelete = await RolModel.findByIdAndDelete(id,Rol);
    return RolDelete;
};