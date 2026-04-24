const mongoose = require('mongoose');

const MateriaSchema = new mongoose.Schema({
    nombre: { 
        type: String, 
        required: true 
    }

  });

module.exports = mongoose.model('Materia', MateriaSchema);
