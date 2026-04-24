const { z } = require("zod");

exports.SubirCategoriaSchema = z.object({
  Nombre_Categoria: z.string({
    required_error: "El nombre es obligatorio",
  }).min(3, { message: "El nombre debe tener al menos 3 caracteres" }),

  Descripcion: z.string({
    required_error: "La descripción es obligatoria",
  }).max(500, { message: "La descripción no puede superar los 500 caracteres" }),
});