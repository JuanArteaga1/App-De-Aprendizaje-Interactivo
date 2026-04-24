const { z } = require("zod");

exports.SubirProyectosSchema = z.object({
  nombre_proyecto: z.string({
    required_error: "El nombre completo es obligatorio",
  }).min(3, { message: "El nombre debe tener al menos 3 caracteres" }),

  autores: z.string({
    required_error: "El nombre de los autores es obligatorio",
  }).min(5, { message: "El nombre de los autores al menos 5 caracteres" }),

  fechaPublicacion: z.coerce.date({
    required_error: "La fecha es obligatoria",
    invalid_type_error: "Fecha inválida",
  }).min(new Date("2024-01-01"), {
    message: "La fecha debe ser posterior a enero 2024",
  }),
  categoriaId: z.string({
    required_error: "La categoría es obligatoria",
  }).min(1, { message: "Debes seleccionar una categoría" }),

  descripcion: z.string({
    required_error: "La descripción es obligatoria",
  }).max(500, { message: "La descripción no puede superar los 500 caracteres" }),

  materia: z.string({
    required_error: "La materia es obligatoria",
  }).min(4, { message: "Debes ingresar una materia" }),
  Usuario: z.string({
    required_error: "Id no encontrado",
  }),
  youtubeLink: z.string()
  .optional()
  .refine((value) => {
    if (!value) return true;
    
    const patterns = [
      /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=[\w-]+(&[\w=&%-]*)?$/,
      /^(https?:\/\/)?youtu\.be\/[\w-]+(\?[\w=&%-]*)?$/,
      /^(https?:\/\/)?(www\.)?youtube\.com\/embed\/[\w-]+(\?[\w=&%-]*)?$/,
      /^(https?:\/\/)?(www\.)?youtube\.com\/v\/[\w-]+(\?[\w=&%-]*)?$/,
      /^(https?:\/\/)?(www\.)?youtube\.com\/shorts\/[\w-]+(\?[\w=&%-]*)?$/,
    ];
    
    return patterns.some(pattern => pattern.test(value));
  }, {
    message: "Debe ser un enlace válido de YouTube"
  })
});
  