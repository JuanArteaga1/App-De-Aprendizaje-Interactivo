const { z } = require("zod");

exports.SubirInvestigacionSchema = z.object({
  nombre_proyecto: z.string({
    required_error: "El título es obligatorio",
  }).min(3, { message: "El título debe tener al menos 3 caracteres" }),

  descripcion: z.string({
    required_error: "La descripción es obligatoria",
  }).max(500, { message: "La descripción no puede superar los 500 caracteres" }),

  urlArticulo: z.string({
    required_error: "La URL del artículo es obligatoria",
  }).url({ message: "Debe ser una URL válida" }),

  urlDoi: z.string({
    required_error: "La URL DOI es obligatoria",
  }).url({ message: "Debe ser una URL válida" }),

  autores: z.string({
    required_error: "El nombre de los autores es obligatorio",
  }).min(5, { message: "El nombre de los autores al menos 5 caracteres" }),

  materia: z.string({
    required_error: "La materia es obligatoria",
  }).min(4, { message: "Debes ingresar una materia" }),

  fechaPublicacion: z.coerce.date({
    required_error: "La fecha es obligatoria",
    invalid_type_error: "Fecha inválida",
  }).min(new Date("2024-01-01"), {
    message: "La fecha debe ser posterior a enero 2024",
  }),
  Usuario: z.string({
    required_error: "Id no encontrado",
  })
});
