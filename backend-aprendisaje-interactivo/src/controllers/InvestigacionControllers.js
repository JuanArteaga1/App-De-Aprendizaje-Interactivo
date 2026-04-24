const InvestigacionService = require('../services/InvestigacionServices');
const { MateriaBuscar, categoriaBuscar } = require("../controllers/MateriaCategoriaController")
const { GuardarImagen, GuardarDocumento, ActualizarImagen,ActualizarDocumento } = require("../middlewares/MulterConfig");
const investigaciones = require("../models/Investigacion")


// CONTROLADOR PARA CREAR INVESTIGACIÓN
exports.createInvestigacion = async (req, res) => {
    try {
        req.body.materia = await MateriaBuscar(req)
        req.body.urlimg = await GuardarImagen(req, res)
        req.body.urlDoc = await GuardarDocumento(req, res)
        const investigacion = await InvestigacionService.createInvestigacion(req.body);
        res.status(201).json(investigacion);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

// CONTROLADOR PARA MOSTRAR INVESTIGACIÓN POR ID
exports.GetInvestigacionId = async (req, res) => {
    try {
        const investigacion = await InvestigacionService.getInvestigacionId(req.params.id);
        res.status(200).json(investigacion);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

// CONTROLADOR PARA MOSTRAR TODAS LAS INVESTIGACIONES
exports.GetInvestigacionAll = async (req, res) => {
    try {
        const investigaciones = await InvestigacionService.getAllInvestigacion();
        res.status(200).json(investigaciones);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

// CONTROLADOR PARA ACTUALIZAR INVESTIGACIÓN POR ID
exports.PutInvestigacionId = async (req, res) => {
    try {
        const Ruta = await investigaciones.findById(req.params.id)
        if (!Ruta) {
            return res.status(404).json({ message: "Investigacion no encontrada" });
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
        
        if (req.body.categoriaId) {
            req.body.categoriaId = await categoriaBuscar(req)
        } else if (Ruta.categoriaId) {
            req.body.categoriaId = Ruta.categoriaId;
        }

        const investigacion = await InvestigacionService.PutInvestigacionId(req.params.id, req.body);
        res.status(200).json(investigacion);
    } catch (error) {
        console.error("Error en PutInvestigacionId:", error);
        res.status(409).json({ message: error.message });
    }
};

// CONTROLADOR PARA ELIMINAR INVESTIGACIÓN POR ID
exports.DeleteInvestigacionId = async (req, res) => {
    try {
        await InvestigacionService.DeleteInvestigacionId(req.params.id);
        res.status(200).json({ message: "Investigación eliminada exitosamente" });
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};
