import React, { useEffect } from "react";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { UseSimulaciones } from "../context/SimulacionesContex";
import { Download, FileText, CalendarDays, Users, Video, Image, Trash2} from "lucide-react";
import { useLogin } from "../context/LoginContext";

const DetalleSimulacion = () => {
    const { id } = useParams();
    const { Simulaciones, TraerSimulaciones, AgregarReview, EliminarReview  } = UseSimulaciones();
    const apiUrl = import.meta.env.VITE_RUTA1;
    const { Usuario, isAuthenticated, isLoading } = useLogin();

    useEffect(() => {
        if (!Simulaciones.some(s => s._id === id)) {
            TraerSimulaciones();
        }
    }, [id, Simulaciones, TraerSimulaciones]);

    if (!Simulaciones || Simulaciones.length === 0) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center space-y-4 p-8">
                        <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
                        <p className="text-gray-600">Cargando simulación...</p>
                    </div>
                </div>
            </>
        );
    }

    const getYouTubeVideoId = (url) => {
        const regex =
            /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = url.match(regex);
        return match ? match[1] : null;
    };

    const simulacion = Simulaciones.find((s) => s._id === id);
    if (!simulacion) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center space-y-4 p-8">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Simulación no encontrada
                        </h2>
                        <p className="text-gray-600">La simulación que buscas no existe</p>
                    </div>
                </div>
            </>
        );
    }

    // URLs usando la variable de entorno (versión segura)
    const rutaLimpia = simulacion.urlimg?.replace(/\\/g, "/");
    const imagenURL = `${apiUrl}/uploads/${rutaLimpia?.split("uploads/")[1]}`;

    const rutaAPK = simulacion.urlArchivoapk?.replace(/\\/g, "/");
    const archivoURL = `${apiUrl}/uploads/${rutaAPK?.split("uploads/")[1]}`;

    const rutaDoc = simulacion.urlDoc?.replace(/\\/g, "/");
    const docURL = `${apiUrl}/uploads/${rutaDoc?.split("uploads/")[1]}`;

    const formatNumber = (num) => {
        if (num >= 1_000_000) {
            return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
        }
        if (num >= 1_000) {
            return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
        }
        return num.toString();
    };

    const handleEliminar = async (reviewId) => {
            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: "¡No podrás deshacer esto!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#f87171',
                cancelButtonColor: '#d1d5db',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            });
    
            if (result.isConfirmed) {
                await EliminarReview(simulacion._id, reviewId);
                await TraerSimulaciones();
            }
        };
    
        const puedeComentar = true;
        //const puedeComentar = !isLoading && isAuthenticated && (Usuario?.Rol === "Administrador" || Usuario?.Rol === "Docente");
    
    

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                        <div className="flex flex-col xl:flex-row min-h-[700px]">

                            {/* Left Section - Info */}
                            <div className="xl:w-2/5 p-8 sm:p-10 border-b xl:border-b-0 xl:border-r border-gray-200 bg-white">
                                <div className="flex flex-col h-full">

                                    {/* Header */}
                                    <div className="flex-shrink-0 mb-8">
                                        <div className="flex flex-col gap-6 items-center text-center">
                                            <div className="relative p-1 bg-gradient-to-r from-indigo-600 to-blue-500 rounded-2xl shadow-lg">
                                                <img
                                                    src={imagenURL}
                                                    alt={simulacion.nombre_proyecto}
                                                    className="w-40 h-40 sm:w-48 sm:h-48 rounded-xl object-cover border-2 border-white shadow-lg"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h1 className="text-2xl sm:text-4xl font-bold mb-4 leading-tight text-gray-900">
                                                    {simulacion.nombre_proyecto}
                                                </h1>
                                                <div className="flex flex-wrap justify-center gap-2 mb-4">
                                                    {simulacion.autores.map((autor, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="inline-flex items-center gap-1 px-3 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg shadow-sm"
                                                        >
                                                            <Users size={14} />
                                                            {autor}
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="flex flex-wrap justify-center gap-3 mt-4">
                                                    <div className="flex items-center justify-center gap-2 text-gray-600 text-sm bg-gray-100 px-4 py-2 rounded-lg">
                                                        <CalendarDays size={16} />
                                                        {new Date(simulacion.fechaPublicacion).toLocaleDateString("es-CO", {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </div>

                                                    {/* Descargas */}
                                                    <div className="text-gray-600 text-sm bg-blue-50 border border-blue-200 px-4 py-2 rounded-lg shadow-sm">
                                                        {formatNumber(simulacion.downloads || 0)} Descargas
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Descripción */}
                                    <div className="flex-1 mb-8">
                                        <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">
                                            Descripción
                                        </h2>
                                        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                            <p className="text-gray-700 leading-relaxed text-base text-center">
                                                {simulacion.descripcion}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Botones */}
                                    <div className="flex-shrink-0 space-y-4">
                                        <button
                                            onClick={async () => {
                                                const link = document.createElement("a");
                                                link.href = archivoURL;
                                                link.download = simulacion.nombre_proyecto + ".apk";
                                                document.body.appendChild(link);
                                                link.click();
                                                document.body.removeChild(link);

                                                try {
                                                    await fetch(`${apiUrl}/simulaciones/${simulacion._id}/descargar`, {
                                                        method: "POST"
                                                    });
                                                    // opcional: recargar proyectos para que se vea actualizado
                                                    // await TraerProyectos();
                                                } catch (error) {
                                                    console.error("Error registrando descarga:", error);
                                                }

                                            }}
                                            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800 text-white px-6 py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                                        >
                                            <Download size={20} />
                                            Descargar APK
                                        </button>

                                        {simulacion.urlDoc && (
                                            <a
                                                href={docURL}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full flex items-center justify-center gap-3 border-2 border-indigo-500 hover:bg-indigo-500 text-indigo-600 hover:text-white px-6 py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105"
                                            >
                                                <FileText size={20} />
                                                Ver Documentación
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right Section - Media */}
                            <div className="xl:w-3/5 p-8 sm:p-10 bg-gray-50">
                                <div className="h-full space-y-8">

                                    {/* Video */}
                                    {simulacion.youtubeLink && (() => {
                                        const videoId = getYouTubeVideoId(simulacion.youtubeLink);
                                        return videoId ? (
                                            <div className="space-y-6">
                                                <div className="flex items-center gap-3 bg-white rounded-lg p-4 shadow-md border-l-4 border-indigo-600">
                                                    <div className="p-2 bg-indigo-600 rounded-lg">
                                                        <Video size={20} className="text-white" />
                                                    </div>
                                                    <h3 className="text-xl font-bold text-gray-900">
                                                        Video Demostración
                                                    </h3>
                                                </div>
                                                <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg border-2 border-gray-200">
                                                    <iframe
                                                        className="w-full h-full"
                                                        src={`https://www.youtube.com/embed/${videoId}`}
                                                        title="Video de simulación"
                                                        frameBorder="0"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                    ></iframe>
                                                </div>
                                            </div>
                                        ) : null;
                                    })()}

                                    {/* Galería */}
                                    {simulacion.imagenes && simulacion.imagenes.length > 0 && (
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-3 bg-white rounded-lg p-4 shadow-md border-l-4 border-yellow-500">
                                                <div className="p-2 bg-yellow-500 rounded-lg">
                                                    <Image size={20} className="text-white" />
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-900">
                                                    Capturas de Pantalla
                                                </h3>
                                            </div>

                                            {simulacion.imagenes.length > 2 ? (
                                                <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2">
                                                    {simulacion.imagenes.map((img, idx) => {
                                                        const rutaLimpiaImg = img.replace(/\\/g, "/");
                                                        const imagenURLGallery = `${apiUrl}/uploads/${rutaLimpiaImg.split("uploads/")[1]}`;
                                                        return (
                                                            <div key={idx} className="flex-shrink-0 w-56 h-40 rounded-xl overflow-hidden shadow-lg border-2 border-gray-200 hover:border-indigo-600 transition-all duration-300">
                                                                <img
                                                                    src={imagenURLGallery}
                                                                    alt={`Captura ${idx + 1}`}
                                                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                                                />
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    {simulacion.imagenes.map((img, idx) => {
                                                        const rutaLimpiaImg = img.replace(/\\/g, "/");
                                                        const imagenURLGallery = `${apiUrl}/uploads/${rutaLimpiaImg.split("uploads/")[1]}`;
                                                        return (
                                                            <div key={idx} className="aspect-video rounded-xl overflow-hidden shadow-lg border-2 border-gray-200 hover:border-indigo-500 transition-all duration-300">
                                                                <img
                                                                    src={imagenURLGallery}
                                                                    alt={`Captura ${idx + 1}`}
                                                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                                                />
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Si no hay media */}
                                    {!simulacion.youtubeLink && (!simulacion.imagenes || simulacion.imagenes.length === 0) && (
                                        <div className="flex items-center justify-center h-64 text-gray-500 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                                            <div className="text-center space-y-3">
                                                <div className="p-4 bg-gray-100 rounded-full inline-block">
                                                    <Image size={40} className="text-gray-500" />
                                                </div>
                                                <p className="font-medium">No hay contenido multimedia disponible</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 max-w-6xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 p-6 lg:p-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
                        Valoraciones del Proyecto
                    </h2>
                    <p className="text-gray-600 text-center mb-8">Comparte tu experiencia con la comunidad</p>

                    {/* Estadísticas rápidas */}
                    {simulacion.reviews?.length > 0 && (
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-8 border border-blue-100">
                            <div className="flex flex-wrap items-center justify-center gap-6 text-center">
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-bold text-blue-700">{simulacion.reviews.length}</span>
                                    <span className="text-gray-600">valoraciones</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-bold text-yellow-600">⭐</span>
                                    <span className="text-gray-600">
                                        {(
                                            simulacion.reviews.reduce((acc, rev) => acc + rev.rating, 0) /
                                            simulacion.reviews.length
                                        ).toFixed(1)}/5
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Listado de comentarios */}
                    {simulacion.reviews?.length > 0 ? (
                        <div className="space-y-6 mb-8">
                            {simulacion.reviews.map((rev, idx) => (
                                <div
                                    key={idx}
                                    className="flex flex-col sm:flex-row justify-between items-start bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-all duration-200"
                                >
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-3 mb-3">
                                            <div className="flex items-center gap-1">
                                                {"⭐".repeat(rev.rating)}
                                                <span className="text-yellow-500 text-sm font-medium ml-1">
                                                    ({rev.rating}.0)
                                                </span>
                                            </div>
                                            <span className="font-semibold text-gray-800 bg-white px-3 py-1 rounded-full text-sm border">
                                                {rev.usuario}
                                            </span>
                                            <span className="text-gray-400 text-sm">
                                                {new Date().toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-gray-700 leading-relaxed pl-1">
                                            {rev.comentario}
                                        </p>
                                    </div>

                                    {/* Mostrar botón eliminar solo si tiene permisos */}
                                    {puedeComentar && (
                                        <button
                                            onClick={() => handleEliminar(rev._id)}
                                            className="mt-3 sm:mt-0 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-red-200 flex items-center gap-2"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Eliminar
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-xl mb-8">
                            <div className="text-6xl mb-4">💬</div>
                            <p className="text-gray-500 text-lg italic mb-2">
                                Aún no hay valoraciones
                            </p>
                            <p className="text-gray-400 text-sm">
                                ¡Sé el primero en compartir tu opinión!
                            </p>
                        </div>
                    )}

                    {/* Formulario */}
                    {puedeComentar ? (
                        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <span>✍️</span>
                                Añadir tu valoración
                            </h3>

                            <form
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    await AgregarReview(simulacion._id, {
                                        usuario: Usuario?.email || Usuario?.nombre || Usuario?.NombreCompleto || "Anon",
                                        rating: Number(e.target.rating.value),
                                        comentario: e.target.comentario.value,
                                    });
                                    e.target.reset();
                                    await TraerSimulaciones();
                                }}

                                className="space-y-4"
                            >
                                <div className="flex flex-col lg:flex-row gap-4">
                                    {/* Selector de rating */}
                                    <div className="lg:w-48">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Tu puntuación
                                        </label>
                                        <div className="relative">
                                            <select
                                                name="rating"
                                                required
                                                className="w-full border border-gray-300 rounded-xl p-3 font-semibold text-yellow-600 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 focus:outline-none appearance-none bg-white shadow-sm"
                                            >
                                                <option value="">Selecciona</option>
                                                <option value="5">⭐⭐⭐⭐⭐ Excelente</option>
                                                <option value="4">⭐⭐⭐⭐ Muy Bueno</option>
                                                <option value="3">⭐⭐⭐ Bueno</option>
                                                <option value="2">⭐⭐ Regular</option>
                                                <option value="1">⭐ Malo</option>
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                                <span>▼</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Área de comentario */}
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Tu comentario
                                        </label>
                                        <textarea
                                            name="comentario"
                                            required
                                            className="w-full border border-gray-300 rounded-xl p-3 resize-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none shadow-sm transition-all duration-200"
                                            placeholder="Comparte tu experiencia, qué te gustó, qué mejorarías..."
                                            rows={3}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
                                    <p className="text-gray-500 text-sm">
                                        Tu opinión ayuda a mejorar la comunidad
                                    </p>
                                    <button
                                        type="submit"
                                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
                                    >
                                        Publicar Valoración
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <p className="text-gray-500 mt-4 text-center">
                            Solo usuarios que hayan iniciado sesión pueden dejar comentarios.
                        </p>
                    )}
                </div>

            </div>
        </>
    );
};

export default DetalleSimulacion;
