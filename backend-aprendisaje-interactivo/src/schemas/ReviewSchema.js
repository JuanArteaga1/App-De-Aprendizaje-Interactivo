const { z } = require("zod");

exports.ReviewSchema = z.object({
  usuario: z.string({
    required_error: "El usuario es obligatorio",
  }).min(3, { message: "El usuario debe tener al menos 3 caracteres" }),

  rating: z.number({
    required_error: "La calificación es obligatoria",
    invalid_type_error: "La calificación debe ser un número"
  }).min(1, { message: "Mínimo 1 estrella" }).max(5, { message: "Máximo 5 estrellas" }),

  comentario: z.string().max(500, { message: "El comentario no puede superar 500 caracteres" }).optional()
});
