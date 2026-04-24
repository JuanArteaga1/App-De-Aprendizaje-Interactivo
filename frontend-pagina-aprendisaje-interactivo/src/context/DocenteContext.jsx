import { Children, createContext, useEffect, useState, useContext } from "react";
import { subirDocenteAPI, GetAllDocentes, DeleteDocentes, PutDocentes, GetSolicitudes,DeleteSolicitudes } from "../api/AdmimnistrarDocente";
import { notifyApiError, notifySuccess } from "../lib/notify";

export const DocenteContext = createContext();

export const UseDocente = () => {
    const context = useContext(DocenteContext);
    if (!context) {
        throw new Error("Debe estar dentro de un provider");
    }
    return context;
};

export const DocenteProvider = ({ children }) => {
    const [Solicitudes, SetSolicitudes] = useState(null);
    const [Docente, SetDocente] = useState(null);
    const [errors, setErrors] = useState([])
    const [mensaje, setMensaje] = useState(null);

    const TraerDocentes = async () => {
        try {
            const respuesta = await GetAllDocentes()
            SetDocente(respuesta)
        } catch (error) {
            console.log(error)

        }
    }
    const EditarDocentes = async (id, data) => {
        try {
            await PutDocentes(id, data);
            await TraerDocentes();
            notifySuccess("Docente actualizado", "Los cambios se guardaron correctamente.");
            return { success: true };
        } catch (error) {
            setMensaje(null);
            setErrors(error.response?.data?.errors || [{ msg: "Error desconocido" }]);
            notifyApiError(error, "Error al actualizar docente");
            return { success: false, error: error.response?.data?.errors };
        }
    };

    const EliminarDocentes = async (id) => {
        try {
            await DeleteDocentes(id);
            await TraerDocentes();
            notifySuccess("Docente eliminado", "");
            return { success: true };
        } catch (error) {
            console.log("Error al eliminar el docente:", error);
            notifyApiError(error, "Error al eliminar docente");
            return { success: false, error };
        }
    };

    const sigout = async (data) => {
        try {
            const response = await subirDocenteAPI(data);
            SetDocente(response.data);

            if (response.status === 200) {
                setMensaje("¡Docente registrado correctamente!"); // <-- Mensaje de éxito
                setErrors([]); // Limpiar errores anteriores
                notifySuccess("Usuario registrado", "El docente se creó correctamente.");
            }

        } catch (error) {
            setMensaje(null); // Ocultar mensaje anterior de éxito si hay error
            setErrors(error.response?.data?.errors || [{ msg: "Error desconocido" }]);
            notifyApiError(error, "Error al registrar docente");
        }
    };

    const TraerSolicitudes = async () => {
        try {
            const respuesta = await GetSolicitudes()
            SetSolicitudes(respuesta)
        } catch (error) {
            console.log(error)
        }
    }

    const EliminarSolicitud = async (id) => {
        try {
            await DeleteSolicitudes(id);
            await TraerSolicitudes();
            notifySuccess("Solicitud eliminada", "");
            return { success: true };
            
        } catch (error) {
            console.error("Error al eliminar solicitud:", error);
            notifyApiError(error, "Error al eliminar solicitud");
        }
    };

    return (
        <DocenteContext.Provider value={{ EliminarSolicitud, Solicitudes, TraerSolicitudes, sigout, errors, mensaje, setMensaje, SetDocente, TraerDocentes, EliminarDocentes, EditarDocentes, Docente }}>
            {children}
        </DocenteContext.Provider>
    );
};
