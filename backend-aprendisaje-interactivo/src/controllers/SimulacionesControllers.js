// controllers/SimulacionesControllers.js
const SimulacionesService = require('../services/SimulacionesServices');
const { MateriaBuscar, categoriaBuscar } = require("../controllers/MateriaCategoriaController")
const { GuardarImagen, GuardarAPK, GuardarDocumento,ActualizarApk,ActualizarDocumento,ActualizarImagen } = require("../middlewares/MulterConfig");
const SimulacionesModel = require('../models/Simulaciones');



// CREAR
exports.createSimulaciones = async (req, res) => {
  try {
    req.body.materia = await MateriaBuscar(req)
    req.body.categoriaId = await categoriaBuscar(req)
    const RutaImagen = await GuardarImagen(req, res)
    const RutaApk = await GuardarAPK(req, res)
    const RutaDocs = await GuardarDocumento(req, res)
    req.body.urlimg = RutaImagen
    req.body.urlArchivoapk = RutaApk
    req.body.urlDoc = RutaDocs

    const simulacion = await SimulacionesService.createSimulaciones(req.body);
    res.status(201).json(simulacion);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

// OBTENER TODOS
exports.GetSimulacionesAll = async (req, res) => {
  try {
    const simulaciones = await SimulacionesService.getAllSimulaciones();
    res.status(200).json(simulaciones);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

// OBTENER POR ID
exports.getSimulacionesId = async (req, res) => {
  try {
    const simulacion = await SimulacionesService.getSimulacionesId(req.params.id);
    res.status(200).json(simulacion);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

// ACTUALIZAR
exports.PutSimulacionesId = async (req, res) => {
  try {
    const Ruta = await SimulacionesModel.findById(req.params.id)
    if (!Ruta) {
        return res.status(404).json({ message: "Simulacion no encontrada" });
    }

    // Limpiar literales string "undefined" o "null"
    for (const key in req.body) {
        if (req.body[key] === "undefined" || req.body[key] === "null") {
            delete req.body[key];
        }
    }

    if (req.body.autores && typeof req.body.autores === 'string') {
        try {
            req.body.autores = JSON.parse(req.body.autores);
        } catch (e) {
            console.warn("Could not parse autores:", e.message);
            req.body.autores = [req.body.autores];
        }
    }

    if (req.body.materia) {
        req.body.materia = await MateriaBuscar(req)
    } else {
        req.body.materia = Ruta.materia;
    }

    req.body.urlimg = await ActualizarImagen(req, res, Ruta.urlimg)
    req.body.urlDoc = await ActualizarDocumento(req, res, Ruta.urlDoc)
    req.body.urlArchivoapk = await ActualizarApk(req, res, Ruta.urlArchivoapk)
    
    if (req.body.categoriaId) {
        req.body.categoriaId = await categoriaBuscar(req)
    } else {
        req.body.categoriaId = Ruta.categoriaId;
    }

    const simulacion = await SimulacionesService.PutSimulacionesId(req.params.id, req.body);
    res.status(200).json(simulacion);
  } catch (error) {
    console.error("Error en PutSimulacionesId:", error);
    res.status(409).json({ message: error.message });
  }
};

// ELIMINAR
exports.DeleteSimulacionesId = async (req, res) => {
  try {
    await SimulacionesService.DeleteSimulacionesId(req.params.id);
    res.status(200).json({ message: "Simulación eliminada exitosamente" });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

exports.RegistrarDescarga = async (req, res) => {
  try {
    const simulacion = await SimulacionesService.incrementDownloads(req.params.id);
    if (!simulacion) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }
    res.status(200).json({ downloads: simulacion.downloads });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { usuario, rating, comentario } = req.body;
    const simulacion = await SimulacionesModel.findById(req.params.id);

    if (!simulacion) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }

    simulacion.reviews.push({ usuario, rating, comentario });
    await simulacion.save();

    res.status(201).json(simulacion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { id, reviewId } = req.params;
    const simulacion = await SimulacionesModel.findById(id);

    if (!simulacion) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }

    simulacion.reviews = simulacion.reviews.filter(
      (rev) => rev._id.toString() !== reviewId
    );

    await simulacion.save();
    res.status(200).json(simulacion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
