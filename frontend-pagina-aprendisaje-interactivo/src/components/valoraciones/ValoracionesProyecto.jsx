import React, { useState } from "react";
import Swal from "sweetalert2";
import { Trash2, Star } from "lucide-react";

/* ⭐ COMPONENTE DE ESTRELLAS INTERACTIVO */
function StarRating({ value, onChange }) {
    const [hover, setHover] = useState(null);

    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => {
                const filled = star <= (hover || value);

                return (
                    <Star
                        key={star}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(null)}
                        onClick={() => onChange(star)}
                        className={`
                            w-7 h-7 cursor-pointer transition 
                            ${filled ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
                        `}
                    />
                );
            })}
        </div>
    );
}

const ValoracionesProyecto = ({
    proyecto,
    Usuario,
    puedeComentar,
    AgregarReview,
    EliminarReview,
    TraerProyectos
}) => {

    const puedeEliminar = Usuario?.Rol === "Administrador" || Usuario?.Rol === "Docente";

    const handleEliminar = async (reviewId) => {
        const result = await Swal.fire({
            title: "¿Eliminar comentario?",
            text: "Esta acción no se puede deshacer.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar"
        });

        if (result.isConfirmed) {
            await EliminarReview(proyecto._id, reviewId);
            await TraerProyectos();
            Swal.fire("Eliminado", "El comentario ha sido eliminado.", "success");
        }
    };

    /* ⭐ Estado para el rating interactivo */
    const [rating, setRating] = useState(0);

    return (
        <div className="mt-12 max-w-6xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">

            {/* Título */}
            <div className="mb-8 text-center">
                <h2 className="text-2xl font-semibold text-gray-900">
                    Valoraciones del Proyecto
                </h2>
                <p className="text-gray-500 mt-1">
                    Opiniones y puntuaciones de los usuarios
                </p>
            </div>

            {/* Estadísticas */}
            {proyecto.reviews?.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-500">Total de valoraciones</p>
                        <p className="text-3xl font-semibold text-gray-800">
                            {proyecto.reviews.length}
                        </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-500">Promedio general</p>
                        <div className="flex items-center gap-2">
                            <Star className="w-6 h-6 text-yellow-500" />
                            <p className="text-3xl font-semibold text-gray-800">
                                {(
                                    proyecto.reviews.reduce((acc, rev) => acc + rev.rating, 0) /
                                    proyecto.reviews.length
                                ).toFixed(1)}
                                <span className="text-gray-500 text-lg"> / 5</span>
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Lista de comentarios */}
            {proyecto.reviews?.length > 0 ? (
                <div className="space-y-6 mb-12">
                    {proyecto.reviews.map((rev) => (
                        <div
                            key={rev._id}
                            className="bg-gray-50 border border-gray-200 p-5 rounded-lg shadow-sm"
                        >
                            <div className="flex flex-wrap justify-between gap-3 mb-3">
                                <div className="flex flex-col">
                                    <span className="font-medium text-gray-800">{rev.usuario}</span>
                                    <span className="text-xs text-gray-400">
                                        {new Date().toLocaleDateString()}
                                    </span>
                                </div>

                                <div className="flex items-center gap-1 text-yellow-500">
                                    {[...Array(rev.rating)].map((_, idx) => (
                                        <Star key={idx} className="w-4 h-4 fill-yellow-500" />
                                    ))}
                                </div>
                            </div>

                            <p className="text-gray-700 leading-relaxed">{rev.comentario}</p>

                            {puedeEliminar && (
                                <div className="mt-4 flex justify-end">
                                    <button
                                        onClick={() => handleEliminar(rev._id)}
                                        className="flex items-center gap-2 px-3 py-2 text-sm bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Eliminar
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-gray-50 border border-gray-200 rounded-lg mb-10">
                    <p className="text-gray-500 text-lg">Aún no hay valoraciones</p>
                </div>
            )}

            {/* Formulario con estrellas interactivas */}
            {puedeComentar && (
                <form
                    onSubmit={async (e) => {
                        e.preventDefault();
                        await AgregarReview(proyecto._id, {
                            usuario: e.target.usuario.value,
                            rating,
                            comentario: e.target.comentario.value,
                        });
                        setRating(0);
                        e.target.reset();
                        await TraerProyectos();
                    }}
                    className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
                >
                    <h3 className="text-lg font-medium text-gray-900 mb-6">
                        Añadir valoración
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        
                        {/* Usuario */}
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Nombre</label>
                            <input
                                name="usuario"
                                required
                                className="w-full border border-gray-300 rounded-md p-3"
                                placeholder="Tu nombre"
                            />
                        </div>

                        {/* ⭐ Rating interactivo */}
                        <div className="flex flex-col">
                            <label className="block text-sm text-gray-600 mb-1">Puntuación</label>

                            <StarRating value={rating} onChange={setRating} />

                            {/* valor oculto */}
                            <input type="hidden" name="rating" value={rating} required />
                        </div>

                        {/* Comentario */}
                        <div className="md:col-span-3">
                            <label className="block text-sm text-gray-600 mb-1">Comentario</label>
                            <textarea
                                name="comentario"
                                rows={3}
                                required
                                className="w-full border border-gray-300 rounded-md p-3 resize-none"
                                placeholder="Escribe un comentario..."
                            />
                        </div>
                    </div>

                    <div className="flex justify-end mt-6">
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md shadow-sm transition"
                        >
                            Publicar
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default ValoracionesProyecto;
