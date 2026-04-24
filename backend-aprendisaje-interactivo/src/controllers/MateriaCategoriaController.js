const Materia = require("../models/Materia")
const categoría = require("../models/Categoria")

exports.MateriaBuscar = async(req) =>{
    const Materiabuscar = await Materia.findOne({nombre:req.body.materia})


    IdMateria = Materiabuscar._id
    return IdMateria
}

exports.categoriaBuscar = async(req) =>{
    const categoriaBuscar = await categoría.findOne({Nombre_Categoria:req.body.categoriaId})
    Idcategoria = categoriaBuscar._id  
    return Idcategoria
}