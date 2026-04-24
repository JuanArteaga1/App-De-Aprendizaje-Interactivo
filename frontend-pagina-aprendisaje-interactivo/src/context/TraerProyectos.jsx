import { Children, createContext, useEffect, useState, useContext } from "react";
import { GetAllProyectos, GetIdProyectos, DeleteProyectos } from "../api/AdminTraerProyectos"; // Funciones para obtener proyectos desde la API

// Creamos el contexto que compartirá los datos relacionados con los proyectos
export const TraerProyectosContext = createContext();

// Hook personalizado para consumir el contexto de proyectos
export const UseTraerProyectos = () => {
    const context = useContext(TraerProyectosContext);

    // Asegura que este hook se use dentro del proveedor correspondiente
    if (!context) {
        throw new Error("Debe estar dentro de un provider");
    }
    return context;
};

// Componente proveedor del contexto que envuelve a los componentes hijos
export const TraerProyectosProvider = ({ children }) => {
    const [TraerProyectos, SetTraerProyectos] = useState(null); // Estado para almacenar todos los proyectos
    const [traerProyectoId, SettraerProyectoId] = useState(null); // Estado para almacenar un proyecto individual por ID
    const [errors, setErrors] = useState([]); // Estado para errores (por ahora no se usa activamente)
    const [mensaje, setMensaje] = useState(null); // Estado para mostrar mensajes al usuario

    // Función para obtener todos los proyectos desde la API
    const TraerProyectosT = async () => {
        try {
            const TraerProyectos = await GetAllProyectos(); // Llamada a la API
            console.log("Respuesta GetAllProyectos:", TraerProyectos); // Mostrar en consola para depuración
            SetTraerProyectos(TraerProyectos); // Guardar los datos en el estado
        } catch (error) {
            console.log(error); // Mostrar errores en consola
        }
    };

    // Función para obtener un solo proyecto por su ID
    const TraerProyectosId = async (Id) => {
        try {
            const traerProyectoId = await GetIdProyectos(Id); // Llamada a la API por ID
            SettraerProyectoId(traerProyectoId); // Guardar el resultado en el estado
        } catch (error) {
            console.log(error); // Mostrar errores en consola
        }
    };
    const EliminarProyectos = async (fila, proyectos) => {
        const response = await DeleteProyectos(fila, proyectos)
        SetTraerProyectos(response);
        return { success: true, data: response };
    }

    // Proveer todos los estados y funciones a los componentes hijos que usen este contexto
    return (
        <TraerProyectosContext.Provider
            value={{
                TraerProyectos,
                errors,
                mensaje,
                setMensaje,
                SetTraerProyectos,
                TraerProyectosT,
                TraerProyectosId,
                traerProyectoId,
                
            }}
        >
            {children}
        </TraerProyectosContext.Provider>
    );
};
