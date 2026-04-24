const { z } = require("zod");

exports.RegistroDocenteSchema = z.object({
    Nombre: z.string({
      required_error: "El nombre completo es obligatorio",
    }).min(3, "El nombre debe tener al menos 3 caracteres"),
  
    identificacion: z.string({
      required_error: "El número de identificación es obligatorio",
    }).regex(/^\d+$/, "La identificación debe contener solo números"),
  
    contrasena: z.string({
      required_error: "La contraseña es obligatoria",
    }).min(6, "La contraseña debe tener al menos 6 caracteres"),
  
    rol: z.string({
      required_error: "Debe seleccionar un rol",
    }),

  });
  