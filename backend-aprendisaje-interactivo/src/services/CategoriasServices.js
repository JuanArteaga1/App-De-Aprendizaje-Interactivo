const CategoriaModel = require('../models/Categoria');



exports.createCategoria = async (Categoria) =>{
    const newcategoria = new CategoriaModel(Categoria)
    await newcategoria.save()
    return newcategoria
}
exports.getAllCategoria = async () => {
    const Categorias = await CategoriaModel.find();
    return Categorias;
};
exports.getCategoriaId = async (id) => {
    const Categoria = await CategoriaModel.findById(id);
    return Categoria;
};
exports.PutCategoriaId = async (id,Categoria) => {
    const CategoriaUpdate = await CategoriaModel.findByIdAndUpdate(id,Categoria);
    return CategoriaUpdate;
};
exports.DeleteCategoriaId = async (id,Categoria) => {
    const CategoriaDelete = await CategoriaModel.findByIdAndDelete(id,Categoria);
    return CategoriaDelete;
};