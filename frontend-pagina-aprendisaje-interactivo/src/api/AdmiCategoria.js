import axios from "axios";

const Api = import.meta.env.VITE_RUTA1; // tu IP local aquí

export const subirCategoriaAPI = (categoria) => axios.post(`${Api}/Categorias`, categoria);
export const GetAllCategoria = () => axios.get(`${Api}/Categorias`);
export const GetIdCategoria = (id) => axios.get(`${Api}/Categorias/${id}`);
export const PutCategoria = (id, categoria) => axios.put(`${Api}/Categorias/${id}`, categoria);
export const DeleteCategoria = (id) => axios.delete(`${Api}/Categorias/${id}`);
