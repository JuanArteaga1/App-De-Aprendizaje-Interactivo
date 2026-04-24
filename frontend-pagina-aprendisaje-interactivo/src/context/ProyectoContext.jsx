// Importación de funciones necesarias de React y del archivo de la API
import { Children, createContext, useEffect, useState, useContext } from "react";
import { GetAllProyectos, subirProyectosAPI, PutProyectos, DeleteProyectos, GetIdProyectos, addReview, deleteReview } from "../api/AdmiProyecto";
import { notifyApiError, notifySuccess } from "../lib/notify";

// Crear el contexto que se usará para compartir datos entre componentes
export const ProyectoContext = createContext();

// Hook personalizado para consumir el contexto de proyectos
export const useProyectos = () => {
    const context = useContext(ProyectoContext); // Obtener el contexto actual
    if (!context) {
        // Asegurarse de que se use dentro de un ProyectosProvider
        throw new Error("Debe estar dentro de un provider");
    }
    return context;
};

// Componente proveedor que envuelve a los componentes hijos y les proporciona acceso al contexto
export const ProyectosProvider = ({ children }) => {
    const [Proyectos, SetProyectos] = useState([]); // Lista de proyectos
    const [errors, setErrors] = useState([]); // Errores devueltos por la API
    const [mensaje, setMensaje] = useState(null); // Mensaje de éxito
    const [traerProyectoId, SettraerProyectoId] = useState(null);


    // Función para obtener todos los proyectos desde la API
    const TraerProyectos = async () => {
        try {
            console.log("proyectoos")
            const proyectos = await GetAllProyectos();
            console.log(proyectos) // Llamada a la API // Imprimir respuesta para depuración
            SetProyectos(proyectos.data); // Guardar los datos en el estado
        } catch (error) {
            console.log(error); // Mostrar error en consola si falla la API
            notifyApiError(error, "No se pudieron cargar los proyectos");
        }
    };
    const ActualizarProyectos = async (Id, data) => {
        try {
            const response = await PutProyectos(Id, data);
            SetProyectos(response);
            console.log(response)
            notifySuccess("Proyecto actualizado", "Los cambios se guardaron correctamente.");
            return { success: true, data: response };
        } catch (error) {
            setMensaje(null);
            setErrors(error.response?.data?.errors || [{ msg: "Error desconocido" }]);
            notifyApiError(error, "Error al actualizar");

            return { success: false, error: error.response?.data?.errors };
        }
    };
    const EliminarProyectos = async (id) => {
        try {
            await DeleteProyectos(id);
            // Opcional: volver a cargar la lista actualizada
            await TraerProyectos();
            notifySuccess("Eliminado", "El proyecto se eliminó correctamente.");
            return { success: true };
        } catch (error) {
            console.log("Error al eliminar el proyecto:", error);
            notifyApiError(error, "Error al eliminar");
            return { success: false, error };
        }
    };

    const TraerProyectoId = async (Id) => {
        try {
            const response = await GetIdProyectos(Id); // Llamada a la API por ID
            console.log(response.data); // Mostrar en consola para depuración
            SettraerProyectoId(response.data); // Guardar el resultado en el estado
        } catch (error) {
            console.log(error); // Mostrar errores en consola
        }
    };


    // Función para subir o registrar un nuevo proyecto a través de la API
    const sigout = async (data) => {
        try {
            setErrors([]);
            const response = await subirProyectosAPI(data); // Enviar los datos del proyecto
            SetProyectos(response.data); // Actualizar lista con la respuesta

            if (response.status >= 200 && response.status <= 399) {
                setMensaje("¡Proyecto registrado correctamente!"); // Mostrar mensaje de éxito
                setErrors([]); // Limpiar errores anteriores
                notifySuccess("Proyecto creado", "El proyecto se registró correctamente.");
                return { success: true };
            }
            return { success: false };
        } catch (error) {
            setMensaje(null); // Ocultar mensaje de éxito si ocurre un error
            // Guardar errores devueltos por la API o un mensaje genérico si no hay detalles
            setErrors(error.response?.data?.errors || [{ msg: "Error desconocido" }]);
            notifyApiError(error, "Error al registrar proyecto");
            return { success: false };
        }
    };

    const AgregarReview = async (id, review) => {
        try {
            const response = await addReview(id, review);
            notifySuccess("Comentario publicado", "");
            return { success: true, data: response.data };
        } catch (error) {
            console.error("Error agregando review:", error);
            notifyApiError(error, "No se pudo publicar el comentario");
            return { success: false, error };
        }
    };

    const EliminarReview = async (id, reviewId) => {
        try {
            const response = await deleteReview(id, reviewId);
            notifySuccess("Comentario eliminado", "");
            return { success: true, data: response.data };
        } catch (error) {
            console.error("Error eliminando review:", error);
            notifyApiError(error, "No se pudo eliminar el comentario");
            return { success: false, error };
        }
    };


    // Proveer los valores a los componentes hijos que estén dentro del contexto
    return (
        <ProyectoContext.Provider value={{ sigout, Proyectos, errors, mensaje, setMensaje, TraerProyectos, TraerProyectoId, ActualizarProyectos, EliminarProyectos, setErrors, AgregarReview, EliminarReview }}>
            {children}
        </ProyectoContext.Provider>
    );
};
