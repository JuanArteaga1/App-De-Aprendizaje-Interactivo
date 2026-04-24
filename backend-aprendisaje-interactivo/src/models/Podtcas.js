const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PodtcasSchema = new Schema({
    nombre_proyecto: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    ArchivoImagen: {
        type: String,
        required: true
    },
    UrlAudio: {
        type: String,
        required: true
    },
    autores: {
        type: Array, // ✅ Usa 'Schema.Types.ObjectId'
        required: true,
        ref: 'Usuarios' // Opcional: referencia a otra colección
    },
    fechaPublicacion: {
        type: Date, // ✅ Si es una fecha, usa 'Date'
        required: true
    },
    materia: {
        type: String,
        ref: 'Materia',
        required: true
    },
    Usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuarios',
        required: true
    }
});


module.exports = mongoose.model("Podtcas", PodtcasSchema)