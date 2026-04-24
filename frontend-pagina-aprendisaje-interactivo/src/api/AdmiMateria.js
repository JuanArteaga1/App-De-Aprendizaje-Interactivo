import axios from "axios";

const Api = import.meta.env.VITE_RUTA1 + "/Materia"; // 👈 importante

export const GetAllMateria = () => axios.get(Api);
export const GetMateriaId = (id) => axios.get(`${Api}/${id}`);
export const PostMateria = (data) => axios.post(Api, data);
export const PutMateria = (id, data) => axios.put(`${Api}/${id}`, data);
export const DeleteMateria = (id) => axios.delete(`${Api}/${id}`);
