// src/context/LoginContext.jsx
import { createContext, useState, useContext, useEffect } from "react";
import { LoginUsuario, outUsuario, verificarToken } from "../api/LoginApi";
import { notifyApiError } from "../lib/notify";

export const LoginContext = createContext();

export const useLogin = () => {
    const context = useContext(LoginContext);
    if (!context) throw new Error("useLogin debe usarse dentro de un LoginProvider");
    return context;
};

export const LoginProvider = ({ children }) => {
    const [Usuario, setUsuario] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Agregar estado de carga
    const [errors, setErrors] = useState([]);
    const [mensaje, setMensaje] = useState(null);

    useEffect(() => {
        const verificarSesion = async () => {
            setIsLoading(true);
            try {
                const response = await verificarToken();


                // Normalizar el usuario
                const usuario = response.data.usuario || response.data;
                const usuarioNormalizado = {
                    ...usuario,
                    Rol: usuario.rol || usuario.Rol
                };

                setUsuario(usuarioNormalizado);
                setIsAuthenticated(true);

                if (usuarioNormalizado.Rol) {
                    localStorage.setItem("Rol", usuarioNormalizado.Rol);
                }



            } catch (error) {

                setUsuario(null);
                setIsAuthenticated(false);
                localStorage.removeItem("Rol");
            } finally {
                setIsLoading(false);
            }
        };

        verificarSesion();
    }, []);

    const signin = async (values) => {
        try {
            const response = await LoginUsuario(values);
            // Obtener el usuario de la respuesta
            const usuario = response.data.usuario || response.data;

            // Normalizar el campo rol a Rol (mayúscula) para consistencia
            const usuarioNormalizado = {
                ...usuario,
                Rol: usuario.rol || usuario.Rol // Usar rol (minúscula) si existe, sino Rol (mayúscula)
            };

            setUsuario(usuarioNormalizado);
            setIsAuthenticated(true);
            setErrors([]);

            // Guardar rol en localStorage
            if (usuarioNormalizado.Rol) {
                localStorage.setItem("Id", usuarioNormalizado.id);
                localStorage.setItem("Rol", usuarioNormalizado.Rol);
            }
        } catch (error) {
            setMensaje(null);
            const errores = error.response?.data?.errors || [{ message: "Error desconocido" }];
            setErrors(errores);
            notifyApiError(error, "No se pudo iniciar sesión");
        }
    };

    const signout = async () => {
        try {
            await outUsuario();
        } catch (err) {
            // ignore errores de logout, igualmente limpiamos localmente
        }

        // Limpiar todo
        setUsuario(null);
        setIsAuthenticated(false);
        setErrors([]);
        setMensaje(null);

        // Limpiar localStorage y cookies
        localStorage.removeItem("Rol");
        localStorage.clear(); // Si tienes otros datos

        // Limpiar cookies
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    };

    return (
        <LoginContext.Provider value={{
            signout,
            signin,
            Usuario,
            setUsuario,
            isAuthenticated,
            isLoading, // Exportar el estado de carga
            errors,
            mensaje
        }}>
            {children}
        </LoginContext.Provider>
    );
};