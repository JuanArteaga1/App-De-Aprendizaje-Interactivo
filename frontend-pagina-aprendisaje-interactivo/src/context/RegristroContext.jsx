import { createContext, useState, useContext, useEffect } from "react";
import { RegistroDocenteAPI, ValidarTokenAPI } from "../api/AdmiRegistro";
import { notifyApiError, notifySuccess } from "../lib/notify";

export const RegistroContext = createContext();

export const UseRegistro = () => {
    const context = useContext(RegistroContext);
    if (!context) {
        throw new Error("Debe estar dentro de un provider");
    }
    return context;
};

export const RegistroProvider = ({ children }) => {
    const [Registro, SetRegistro] = useState(null);
    const [errors, setErrors] = useState([]);
    const [mensaje, setMensaje] = useState(null);

    const RegistroDocentes = async (data) => {
        try {
            const response = await RegistroDocenteAPI(data);
            SetRegistro(response.data);

            if (response.status === 200) {
                setMensaje("¡Docente registrado correctamente!");
                setErrors([]);
                notifySuccess("Registro completado", "Tu cuenta quedó activada correctamente.");
            }
        } catch (error) {
            setMensaje(null);
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else if (error.response?.data?.message) {
                setErrors([{ msg: error.response.data.message }]);
            } else {
                setErrors([{ msg: "Error desconocido" }]);
            }
            notifyApiError(error, "Error en el registro");
        }
    };

    const ValidacionToken = async (token) => {
        try{
            const response = await ValidarTokenAPI(token);
            return response.data;


        }
        catch(error){
            return { valid: false, message: "Token inválido o expirado" };

        }
    }

    // 🔥 Limpiar automáticamente mensajes y errores después de 4 segundos
    useEffect(() => {
        if (mensaje || errors.length > 0) {
            const timer = setTimeout(() => {
                setMensaje(null);
                setErrors([]);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [mensaje, errors]);

    return (
        <RegistroContext.Provider value={{ Registro, SetRegistro, errors, mensaje, RegistroDocentes,ValidacionToken }}>
            {children}
        </RegistroContext.Provider>
    );
};
