const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InvestigacionSchema = new Schema({
    nombre_proyecto: {
        type: String,
        required: true
    },
    descripcion: {
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
    urlArticulo: {
        type: String,
        required: true
    },
    urlDoi: {
        type: String,
        required: true
    },
    autores: {
        type: String,
        required: true,
        ref: 'Usuarios'
    },
    fechaPublicacion: {
        type: Date,
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
    }
});
module.exports = mongoose.model("Investigacion", InvestigacionSchema)
