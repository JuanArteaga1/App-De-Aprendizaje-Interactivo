import axios from "axios";

const Api = import.meta.env.VITE_RUTA1

export const RegistroDocenteAPI = Usuario => axios.post(`${Api}/Usuarios/registro`, Usuario)
export const ValidarTokenAPI = (token) => axios.get(`${Api}/Usuarios/validar-token/${token}`)
