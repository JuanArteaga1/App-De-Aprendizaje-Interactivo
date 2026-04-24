// Importamos el modelo de Proyectos y de Usuarios
const ProyectosModel = require('../models/Proyectos');
const { ELiminarArchivos } = require("../middlewares/MulterConfig");


// Crear un nuevo proyecto en la base de datos
exports.createProyectos = async (Proyectos) => {
    try {
        const newproyectos = new ProyectosModel(Proyectos); // Se crea una nueva instancia del modelo con los datos recibidos
        await newproyectos.save(); // Se guarda en la base de datos
        return newproyectos; // Se devuelve el nuevo proyecto creado
    } catch (error) {
        console.log(error); // Se muestra cualquier error que ocurra
    }
};

// Obtener todos los proyectos, ordenados por fecha de publicación descendente
exports.getAllProyectos = async () => {
    const Proyectos = await ProyectosModel.find()
        .populate("materia") // Se rellena el campo "materia" con los datos referenciados
        .sort({ fechaPublicacion: -1 }); // Orden descendente por fecha
    return Proyectos;
};

// Obtener proyectos filtrados por ID de usuario
exports.getProyectosId = async (id) => {
    const Proyectos = await ProyectosModel.find({ Usuario: id }); // Buscar todos los proyectos creados por un usuario específico
    return Proyectos;
};

// Actualizar un proyecto por su ID
exports.PutProyectosId = async (id, Proyectos) => {

    const ProyectosUpdate = await ProyectosModel.findByIdAndUpdate(id, Proyectos); // Actualiza el documento por ID
    return ProyectosUpdate;
};

// Eliminar un proyecto por su ID
exports.DeleteProyectosId = async (id, Proyectos) => {
    const Ruta = await ProyectosModel.findById(id)
    await ELiminarArchivos(Ruta.urlDoc)
    await ELiminarArchivos(Ruta.urlimg)
    await ELiminarArchivos(Ruta.urlArchivoapk)
    const ProyectosDelete = await ProyectosModel.findByIdAndDelete(id); // Elimina el documento por ID
    return ProyectosDelete;
};

exports.incrementDownloads = async (id) => {
  const proyecto = await ProyectosModel.findById(id);
  if (!proyecto) return null;

  proyecto.downloads = (proyecto.downloads || 0) + 1;
  await proyecto.save();
  return proyecto;
};

