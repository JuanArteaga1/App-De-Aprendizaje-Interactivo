import axios from "axios";

const Api = import.meta.env.VITE_RUTA1; // tu IP local aquí


export const subirDocenteAPI = Usuario => axios.post(`${Api}/Usuarios`, Usuario)

export const GetAllDocentes = () => axios.get(`${Api}/Usuarios/C`)
export const GetSolicitudes = () => axios.get(`${Api}/Usuarios/solicitudes/`);
export const GetIdDocentes = (id) => axios.get(`${Api}/Usuarios/${id}`)
export const PutDocentes = (id, docente) => axios.put(`${Api}/Usuarios/${id}`, docente)
export const DeleteDocentes = (id) => axios.delete(`${Api}/Usuarios/${id}`)


export const DeleteSolicitudes = (id) => axios.delete(`${Api}/Usuarios/solicitudes/${id}`)


