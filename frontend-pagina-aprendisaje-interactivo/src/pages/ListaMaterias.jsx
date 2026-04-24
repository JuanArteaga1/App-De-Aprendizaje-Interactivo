import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
    GetAllMateria,
    DeleteMateria,
    PutMateria
} from "../api/AdmiMateria";
import MenuDocente from "../components/MenuAdmi_Doc";
import { notifyApiError, notifySuccess } from "../lib/notify";

function ListaMaterias() {
    const [materias, setMaterias] = useState([]);
    const [editandoId, setEditandoId] = useState(null);
    const [formEdit, setFormEdit] = useState({ nombre: "" });
    const navigate = useNavigate();

    const cargarMaterias = async () => {
        try {
            const res = await GetAllMateria();
            setMaterias(res.data);
        } catch (error) {
            console.error("Error cargando materias", error);
            notifyApiError(error, "No se pudieron cargar las materias");
        }
    };

    useEffect(() => {
        cargarMaterias();
    }, []);

    // Eliminar con SweetAlert
    const handleDelete = async (id) => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta acción no se puede deshacer",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await DeleteMateria(id);
                    notifySuccess("Materia eliminada", "Se eliminó correctamente.");
                    cargarMaterias();
                } catch (error) {
                    notifyApiError(error, "Error al eliminar");
                }
            }
        });
    };

    // Guardar cambios con SweetAlert
    const handleSaveEdit = async (id) => {
        Swal.fire({
            title: "¿Guardar cambios?",
            text: "Se actualizará la información de esta materia",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, guardar",
            cancelButtonText: "Cancelar"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await PutMateria(id, { nombre: formEdit.nombre });
                    notifySuccess("Materia actualizada", "Los cambios se guardaron.");
                    setEditandoId(null);
                    cargarMaterias();
                } catch (error) {
                    notifyApiError(error, "Error al actualizar");
                }
            }
        });
    };

    const handleEditClick = (materia) => {
        setEditandoId(materia._id);
        setFormEdit({ nombre: materia.nombre || "" });
    };

    const handleEditChange = (e) => {
        setFormEdit({ ...formEdit, [e.target.name]: e.target.value });
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <MenuDocente rol="admin" />
            <div className="flex-1 overflow-y-auto p-8">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900">Lista de Materias</h2>
                    <button
                        onClick={() => navigate("/SubirMateria")}
                        className="bg-blue-600 text-white px-5 py-2.5 rounded-xl shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
                    >
                        + Añadir nueva materia
                    </button>
                </div>

                <div className="overflow-x-auto rounded-xl shadow-xl">
                    <table className="w-full bg-white">
                        <thead>
                            <tr className="bg-blue-600 text-white text-left">
                                <th className="py-4 px-6 rounded-tl-xl">Nombre</th>
                                <th className="py-4 px-6 rounded-tr-xl">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {materias.map((mat, index) => (
                                <tr
                                    key={mat._id}
                                    className={`border-b transition-all duration-300 ${index % 2 === 0 ? 'bg-gray-50' : ''} hover:bg-blue-50`}
                                >
                                    {/* NOMBRE */}
                                    <td className="py-4 px-6">
                                        {editandoId === mat._id ? (
                                            <input
                                                type="text"
                                                name="nombre"
                                                value={formEdit.nombre}
                                                onChange={handleEditChange}
                                                className="border-2 border-gray-300 px-3 py-1 rounded-lg w-full focus:outline-none focus:border-blue-500"
                                            />
                                        ) : mat.nombre}
                                    </td>

                                    {/* ACCIONES */}
                                    <td className="py-4 px-6 flex gap-3 items-center">
                                        {editandoId === mat._id ? (
                                            <>
                                                <button
                                                    onClick={() => handleSaveEdit(mat._id)}
                                                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors shadow-md"
                                                >
                                                    Guardar
                                                </button>
                                                <button
                                                    onClick={() => setEditandoId(null)}
                                                    className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-colors shadow-md"
                                                >
                                                    Cancelar
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => handleEditClick(mat)}
                                                    className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors shadow-md"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(mat._id)}
                                                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-md"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth={1.5}
                                                        stroke="currentColor"
                                                        className="w-5 h-5"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M6 7h12M9 7V4h6v3m-7 4v8m4-8v8m4-8v8M5 7h14l-1 12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 7z"
                                                        />
                                                    </svg>
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {materias.length === 0 && (
                                <tr>
                                    <td colSpan="2" className="py-8 text-center text-gray-500 italic">
                                        No hay materias disponibles.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ListaMaterias;
