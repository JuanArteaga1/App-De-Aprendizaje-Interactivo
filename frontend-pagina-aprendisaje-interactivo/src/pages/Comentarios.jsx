import React, { useEffect, useState } from "react";
import { useProyectos } from "../context/ProyectoContext";
import Swal from "sweetalert2";
// Agregamos nuevos iconos: Star, ChevronLeft, ChevronRight, User
import { Trash2, MessageSquare, Star, ChevronLeft, ChevronRight, User } from "lucide-react";
import MenuDocente from "../components/MenuAdmi_Doc";

const Comentarios = () => {
    const { Proyectos, TraerProyectos, EliminarReview } = useProyectos();

    // Estado para paginación
    const [paginaActual, setPaginaActual] = useState(1);
    const comentariosPorPagina = 7;

    useEffect(() => {
        TraerProyectos();
    }, []);

    if (!Proyectos) return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    const comentarios = Proyectos.flatMap((p) =>
        p.reviews?.map((r) => ({
            ...r,
            proyectoId: p._id,
            proyectoNombre: p.nombre_proyecto,
        })) || []
    );

    // Lógica de paginación
    const totalPaginas = Math.ceil(comentarios.length / comentariosPorPagina);
    const inicio = (paginaActual - 1) * comentariosPorPagina;
    const comentariosPaginados = comentarios.slice(inicio, inicio + comentariosPorPagina);

    const cambiarPagina = (num) => {
        if (num >= 1 && num <= totalPaginas) {
            setPaginaActual(num);
        }
    };

    const handleEliminar = async (proyectoId, reviewId) => {
        const result = await Swal.fire({
            title: "¿Eliminar comentario?",
            text: "Esta acción no se puede deshacer y afectará el promedio del proyecto.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444", // Un rojo más moderno
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
            customClass: {
                popup: 'rounded-xl shadow-xl'
            }
        });

        if (result.isConfirmed) {
            await EliminarReview(proyectoId, reviewId);
            await TraerProyectos();
            Swal.fire("Eliminado", "El comentario se eliminó correctamente.", "success");
        }
    };

    // Función auxiliar para renderizar estrellas
    const renderStars = (rating) => {
        return (
            <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={`w-4 h-4 ${
                            i < rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"
                        }`}
                    />
                ))}
                <span className="ml-2 text-xs font-semibold text-gray-600">({rating}.0)</span>
            </div>
        );
    };

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            <MenuDocente rol="admin" />

            <div className="flex-1 overflow-y-auto p-6 md:p-10">
                <div className="max-w-7xl mx-auto">
                    
                    {/* HEADER DE SECCIÓN */}
                    <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <MessageSquare className="w-6 h-6 text-blue-600" />
                                </div>
                                Moderación de Comentarios
                            </h1>
                            <p className="text-gray-500 mt-1 text-sm md:text-base pl-14">
                                Gestiona las reseñas y calificaciones de los proyectos estudiantiles.
                            </p>
                        </div>
                    </div>

                    {/* CARD PRINCIPAL */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        
                        {/* TABLA */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Proyecto</th>
                                        <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Usuario</th>
                                        <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Valoración</th>
                                        <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Comentario</th>
                                        <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Fecha</th>
                                        <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nivel</th>
                                        <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Acciones</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-100">
                                    {comentariosPaginados.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="py-12 text-center">
                                                <div className="flex flex-col items-center justify-center text-gray-400">
                                                    <MessageSquare className="w-12 h-12 mb-3 opacity-20" />
                                                    <p>No hay comentarios registrados aún.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        comentariosPaginados.map((c) => (
                                            <tr
                                                key={c._id}
                                                className="hover:bg-blue-50/50 transition-colors duration-200 group"
                                            >
                                                <td className="py-4 px-6">
                                                    <span className="font-medium text-gray-900 block truncate max-w-[200px]" title={c.proyectoNombre}>
                                                        {c.proyectoNombre}
                                                    </span>
                                                </td>
                                                
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold uppercase">
                                                            {c.usuario ? c.usuario.charAt(0) : <User className="w-4 h-4"/>}
                                                        </div>
                                                        <span className="text-sm text-gray-700 font-medium">{c.usuario}</span>
                                                    </div>
                                                </td>

                                                <td className="py-4 px-6">
                                                    {renderStars(c.rating)}
                                                </td>

                                                <td className="py-4 px-6">
                                                    <p className="text-sm text-gray-600 max-w-xs truncate leading-relaxed">
                                                        "{c.comentario}"
                                                    </p>
                                                </td>

                                                <td className="py-4 px-6">
                                                    <span className="text-sm text-gray-500">
                                                        {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                    </span>
                                                </td>

                                                <td className="py-4 px-6">
                                                    {/* Aqui podría ir la IA para saber si un comentario es ofensivo o bueno */}
                                                </td>

                                                <td className="py-4 px-6 text-center">
                                                    <button
                                                        onClick={() => handleEliminar(c.proyectoId, c._id)}
                                                        className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition-all"
                                                        title="Eliminar comentario"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* FOOTER / PAGINACIÓN */}
                        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                            <span className="text-sm text-gray-500">
                                Mostrando <span className="font-medium">{inicio + 1}</span> a <span className="font-medium">{Math.min(inicio + comentariosPorPagina, comentarios.length)}</span> de <span className="font-medium">{comentarios.length}</span> resultados
                            </span>
                            
                            {totalPaginas > 1 && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => cambiarPagina(paginaActual - 1)}
                                        disabled={paginaActual === 1}
                                        className="p-2 rounded-lg border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>

                                    {[...Array(totalPaginas)].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => cambiarPagina(i + 1)}
                                            className={`w-8 h-8 rounded-lg text-sm font-medium transition ${
                                                paginaActual === i + 1
                                                    ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                                                    : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
                                            }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => cambiarPagina(paginaActual + 1)}
                                        disabled={paginaActual === totalPaginas}
                                        className="p-2 rounded-lg border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Comentarios;