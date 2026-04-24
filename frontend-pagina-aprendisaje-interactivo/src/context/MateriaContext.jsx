// context/MateriaContext.jsx
import { createContext, useState, useContext } from "react";
import { PostMateria, GetAllMateria } from "../api/AdmiMateria"; // <-- importa tus funciones de la API
import { notifyApiError, notifySuccess } from "../lib/notify";

export const MateriaContext = createContext();

export const UseMateria = () => {
  const context = useContext(MateriaContext);
  if (!context) {
    throw new Error("Debe estar dentro de un MateriaProvider");
  }
  return context;
};

export const MateriaProvider = ({ children }) => {
  const [materias, setMaterias] = useState(null);
  const [errors, setErrors] = useState([]);
  const [mensaje, setMensaje] = useState(null);

  // Obtener todas las materias
  const TraerMaterias = async () => {
    try {
      const res = await GetAllMateria();
      setMaterias(res.data);
    } catch (error) {
      console.error("Error al traer materias:", error);
      notifyApiError(error, "No se pudieron cargar las materias");
    }
  };

  // Registrar una nueva materia
  const sigout = async (data) => {
    try {
      const response = await PostMateria(data);
      setMaterias((prev) => [...(prev || []), response.data]);

      if (response.status >= 200 && response.status <= 399) {
        setMensaje("¡Materia registrada correctamente!");
        setErrors([]);
        notifySuccess("Materia creada", "Registro guardado correctamente.");
      }
    } catch (error) {
      setMensaje(null);
      setErrors(
        error.response?.data?.errors || [{ msg: "Error desconocido en materia" }]
      );
      notifyApiError(error, "Error al crear materia");
    }
  };

  return (
    <MateriaContext.Provider
      value={{
        sigout,
        materias,
        TraerMaterias,
        errors,
        mensaje,
        setMensaje,
      }}
    >
      {children}
    </MateriaContext.Provider>
  );
};
