import { Children, createContext, useEffect, useState, useContext } from "react";
import { subirSimulacionesAPI, GetAllSimulaciones, PutSimulaciones, GetIdSimulaciones, DeleteSimulaciones, addReview, deleteReview } from "../api/AdmiSimulaciones";
import { GetAllPodcast } from "../api/AdmiPodcast";
import { notifyApiError, notifySuccess } from "../lib/notify";

export const SimulacionesContext = createContext();

export const UseSimulaciones = () => {
    const context = useContext(SimulacionesContext);
    if (!context) {
        throw new Error("Debe estar dentro de un provider");
    }
    return context;
};

export const SimulacionesProvider = ({ children }) => {
    const [Simulaciones, SetSimulaciones] = useState([]);
    const [errors, setErrors] = useState([])


    const [mensaje, setMensaje] = useState(null);
    const ActualizarSimulaciones = async (Id, data) => {
        try {
            const response = await PutSimulaciones(Id, data);
            SetSimulaciones(response);
            notifySuccess("Simulación actualizada", "Los cambios se guardaron correctamente.");
            return { success: true, data: response };
        } catch (error) {
            setMensaje(null);
            setErrors(error.response?.data?.errors || [{ msg: "Error desconocido" }]);
            notifyApiError(error, "Error al actualizar simulación");
            return { success: false, error: error.response?.data?.errors };
        }

    };



    const EliminarSimulaciones = async (id) => {
        try {
            await DeleteSimulaciones(id);
            await TraerSimulaciones();
            notifySuccess("Simulación eliminada", "");
            return { success: true };
        } catch (error) {
            console.log("Error al eliminar el proyecto:", error);
            notifyApiError(error, "Error al eliminar simulación");
            return { success: false, error };
        }
    };

    const TraerSimulaciones = async () => {
        try {
            const response = await GetAllSimulaciones();
            console.log(response.data)
            SetSimulaciones(response.data);
        } catch (error) {
            console.error("Error al traer simulaciones:", error);
            notifyApiError(error, "No se pudieron cargar las simulaciones");
        }
    };


    const sigout = async (data) => {
        try {
            setErrors([]);
            const response = await subirSimulacionesAPI(data);
            SetSimulaciones(response.data);

            if (response.status >= 200 && response.status <= 399) {
                setMensaje("¡Proyecto registrado correctamente!"); // <-- Mensaje de éxito
                setErrors([]); // Limpiar errores anteriores
                notifySuccess("Simulación creada", "Registro guardado correctamente.");
            }

        } catch (error) {
            setMensaje(null); // Ocultar mensaje anterior de éxito si hay error
            setErrors(error.response?.data?.errors || [{ msg: "Error desconocido" }]);
            notifyApiError(error, "Error al crear simulación");
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
    return (
        <SimulacionesContext.Provider value={{ sigout, Simulaciones, errors, setErrors, mensaje, setMensaje, ActualizarSimulaciones, EliminarSimulaciones, TraerSimulaciones, AgregarReview, EliminarReview}}>
            {children}
        </SimulacionesContext.Provider>
    );

}
