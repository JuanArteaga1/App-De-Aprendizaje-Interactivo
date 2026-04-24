
const ProyectosService = require('../services/ProyectosServices');
const { GuardarImagen, GuardarAPK, GuardarDocumento, ActualizarDocumento, ActualizarImagen,ActualizarApk } = require("../middlewares/MulterConfig");
const { MateriaBuscar, categoriaBuscar } = require("../controllers/MateriaCategoriaController")
const ProyectosModel = require('../models/Proyectos');


//CONTROLADOR PARA CREAR PERSONA
exports.createProyectos = async (req, res) => {
    try {
        req.body.materia = await MateriaBuscar(req)
        req.body.categoriaId = await categoriaBuscar(req)
        const RutaImagen = await GuardarImagen(req, res)
        const RutaApk = await GuardarAPK(req, res)
        const RutaDocs = await GuardarDocumento(req, res)
        req.body.urlimg = RutaImagen
        req.body.urlArchivoapk = RutaApk
        req.body.urlDoc = RutaDocs


        const Proyectos = await ProyectosService.createProyectos(req.body);
        res.status(201).json(Proyectos);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};
//CONTROLADOR PARA MOSTARA PERSONAS CON ID
exports.GetProyectosId = async (req, res) => {
    try {
        const Proyectos = await ProyectosService.getProyectosId(req.params.id, req.body);
        res.status(201).json(Proyectos);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};
//CONTROLADOR PARA MOSTRAR PERSONAS QUE ESTA REGISTRADAS
exports.GetProyectosAll = async (req, res) => {
    try {
        console.log("entrar proeyctos")
        const Proyectos = await ProyectosService.getAllProyectos(req.body);
        res.status(201).json(Proyectos);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};
//CONTROLADOR PARA ACTUALIZAR PERSONA CON ID
exports.PutProyectosId = async (req, res) => {
    try {
        const Ruta = await ProyectosModel.findById(req.params.id)
        if (!Ruta) {
            return res.status(404).json({ message: "Proyecto no encontrado" });
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
            req.body.materia = await MateriaBuscar(req);
        } else {
            req.body.materia = Ruta.materia;
        }

        req.body.urlimg = await ActualizarImagen(req, res, Ruta.urlimg)
        req.body.urlDoc = await ActualizarDocumento(req, res, Ruta.urlDoc)
        req.body.urlArchivoapk = await ActualizarApk(req, res, Ruta.urlArchivoapk)
        
        if (req.body.categoriaId) {
            req.body.categoriaId = await categoriaBuscar(req);
        } else {
            req.body.categoriaId = Ruta.categoriaId;
        }

        const Proyectos = await ProyectosService.PutProyectosId(req.params.id, req.body);
        res.status(201).json(Proyectos);
    } catch (error) {
        console.error("Error en PutProyectosId:", error);
        res.status(409).json({ message: error.message });
    }
};
//CONTROLADOR PARA ELIMINAR PERSONA CON ID
exports.DeleteProyectosId = async (req, res) => {
    try {
        const Proyectos = await ProyectosService.DeleteProyectosId(req.params.id,);
        res.status(200).json({ message: "Persona deleted successfully" });

    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

exports.RegistrarDescarga = async (req, res) => {
  try {
    const proyecto = await ProyectosService.incrementDownloads(req.params.id);
    if (!proyecto) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }
    res.status(200).json({ downloads: proyecto.downloads });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { usuario, rating, comentario } = req.body;
    const proyecto = await ProyectosModel.findById(req.params.id);

    if (!proyecto) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }

    proyecto.reviews.push({ usuario, rating, comentario });
    await proyecto.save();

    res.status(201).json(proyecto);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { id, reviewId } = req.params;
    const proyecto = await ProyectosModel.findById(id);

    if (!proyecto) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }

    proyecto.reviews = proyecto.reviews.filter(
      (rev) => rev._id.toString() !== reviewId
    );

    await proyecto.save();
    res.status(200).json(proyecto);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
