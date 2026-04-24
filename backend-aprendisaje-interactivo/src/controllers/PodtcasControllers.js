
const PodtcasServices = require('../services/PodtcasServices');
const PodtcasModel = require('../models/Podtcas');
const { GuardarImagen,ActualizarImagen } = require("../middlewares/MulterConfig");


exports.getAllPodtcas = async (req, res) => {
    try {

        const Podtcas = await PodtcasServices.getAllPodtcas();
        Podtcas.forEach(item => {
            const rutaimagen = item.ArchivoImagen
        });
        res.status(200).json(Podtcas);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

exports.getAllPodtcasId = async (req, res) => {  // ✅ Ahora coincide con la importación
    try {
        const Podtcas = await PodtcasServices.getAllPodtcasId(req.params.id);
        res.status(200).json(Podtcas);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};


exports.createPodtcas = async (req, res) => {
    try {

        console.log("llego aqui")
        const RutaImagen = GuardarImagen(req,res)
        req.body.ArchivoImagen = RutaImagen
        const newPodtcas = await PodtcasServices.createPodtcas(req.body);
        res.status(201).json(newPodtcas);
    } catch (error) {

        res.status(409).json({ message: error.message });
    }
};

exports.updatedPodtcasId = async (req, res) => {
    try {
        const Ruta = await PodtcasModel.findById(req.params.id)
        if (!Ruta) {
            return res.status(404).json({ message: "Podcast no encontrado" });
        }

        // Limpiar literales string "undefined" o "null"
        for (const key in req.body) {
            if (req.body[key] === "undefined" || req.body[key] === "null") {
                delete req.body[key];
            }
        }
        req.body.ArchivoImagen = await ActualizarImagen(req, res, Ruta.ArchivoImagen)
        const Podtcas = await PodtcasServices.updatedPodtcasId(req.params.id, req.body);
        res.status(200).json(Podtcas);
    } catch (error) {
        console.error("Error en updatedPodtcasId:", error);
        res.status(409).json({ message: error.message });
    }
};

exports.deletePodtcas = async (req, res) => {
    try {
        await PodtcasServices.deletePodtcas(req.params.id);
        res.status(200).json({ message: "podcast deleted successfully" });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};