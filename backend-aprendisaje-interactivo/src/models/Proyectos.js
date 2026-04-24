const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  usuario: { type: String, required: true },  // o ref: 'Usuarios'
  rating: { type: Number, min: 1, max: 5, required: true },
  comentario: { type: String, default: "" },
  fecha: { type: Date, default: Date.now }
});

const ProyectoSchema = new Schema({
    nombre_proyecto: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    urlArchivoapk: {
        type: String,
        required: true
    },
    urlDoc: {
        type: String,
        required: true
    },
    urlimg: {
        type: String,
        required: true
    },
    youtubeLink: {
        type: String,
        required: true
    },
    autores: {
        type: Array,
        required: true,
        ref: 'Usuarios'
    },
    fechaPublicacion: {
        type: Date,
        required: true
    },
    categoriaId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    materia: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Materia',
        required: true
    },
    Usuario: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Usuarios',
        required: true
    },
    // campo nuevo
  downloads: { type: Number, default: 0 },
  reviews: [ReviewSchema]
});
module.exports = mongoose.model("Proyectos", ProyectoSchema)