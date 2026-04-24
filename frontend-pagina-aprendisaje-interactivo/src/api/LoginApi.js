import axios from "axios";

const Api = import.meta.env.VITE_RUTA1; // tu IP local aquí


export const apiClient = axios.create({
    baseURL: Api,
    withCredentials: true // ✅ siempre enviará cookies
});

// endpoints
export const LoginUsuario = (loginEntrada) => apiClient.post("/login", loginEntrada);
export const verificarToken = () => apiClient.get("/login/perfil"); // o /profile
export const outUsuario = () => apiClient.post("/login/out"); // ajusta ruta según tu router