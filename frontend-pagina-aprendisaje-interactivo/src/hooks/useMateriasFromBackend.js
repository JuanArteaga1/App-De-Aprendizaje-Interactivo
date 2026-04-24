import { useState, useEffect } from "react";
import { GetAllMateria } from "../api/AdmiMateria";

/**
 * Lista de materias desde GET /Materia (mismo origen que alta de proyectos).
 * value del <option> = nombre, alineado con lo que envía el backend al guardar.
 */
export function useMateriasFromBackend() {
  const [materias, setMaterias] = useState([]);

  useEffect(() => {
    let cancelado = false;
    (async () => {
      try {
        const res = await GetAllMateria();
        if (!cancelado) setMaterias(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        console.error("Error cargando materias", e);
        if (!cancelado) setMaterias([]);
      }
    })();
    return () => {
      cancelado = true;
    };
  }, []);

  return materias;
}
