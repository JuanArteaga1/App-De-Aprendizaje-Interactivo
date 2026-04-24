import axios from "axios";

const Api = import.meta.env.VITE_RUTA1; // tu IP local aquí


export const GetAllProyectos = () => axios.get(`${Api}/TraerProyectos`)
export const GetIdProyectos = (id) => axios.get(`${Api}/TraerProyectos/${id}`)
export const DeleteProyectos = (id,proyectos) => axios.delete(`${Api}/TraerProyectos/${id}`,{data: { tipo: proyectos }})
export const PutProyectos = () => axios.put(`${Api}/TraerProyectos`)