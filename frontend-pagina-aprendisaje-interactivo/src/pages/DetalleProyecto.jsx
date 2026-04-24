import React, { useEffect } from "react";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useProyectos } from "../context/ProyectoContext";
import { Download, FileText, CalendarDays, Users, Video, Image, Trash2 } from "lucide-react";
import { useLogin } from "../context/LoginContext";
import ValoracionesProyecto from "../components/valoraciones/ValoracionesProyecto";

const DetalleProyecto = () => {
    const { id } = useParams();
    const { Proyectos, TraerProyectos, AgregarReview, EliminarReview } = useProyectos();
    const apiUrl = import.meta.env.VITE_RUTA1;
    const { Usuario, isAuthenticated, isLoading } = useLogin();

    useEffect(() => {
        if (!Proyectos.some(p => p._id === id)) {
            TraerProyectos();
        }
    }, [id, Proyectos, TraerProyectos]);

    if (!Proyectos || Proyectos.length === 0) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center space-y-4 p-8">
                        <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
                        <p className="text-gray-600">Cargando proyecto...</p>
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

    const proyecto = Proyectos.find((p) => p._id === id);
    if (!proyecto) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center space-y-4 p-8">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Proyecto no encontrado
                        </h2>
                        <p className="text-gray-600">El proyecto que buscas no existe</p>
                    </div>
                </div>
            </>
        );
    }

    // URLs usando la variable de entorno (versión segura)
    const rutaLimpia = proyecto.urlimg?.replace(/\\/g, "/");
    const imagenURL = `${apiUrl}/uploads/${rutaLimpia?.split("uploads/")[1]}`;

    const rutaAPK = proyecto.urlArchivoapk?.replace(/\\/g, "/");
    const archivoURL = `${apiUrl}/uploads/${rutaAPK?.split("uploads/")[1]}`;

    const rutaDoc = proyecto.urlDoc?.replace(/\\/g, "/");
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
            await EliminarReview(proyecto._id, reviewId);
            await TraerProyectos();
        }
    };

    const puedeComentar = true;
    //const puedeComentar = !isLoading && isAuthenticated && (Usuario?.Rol === "Administrador" || Usuario?.Rol === "Docente");


    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                    {/* Main Horizontal Layout */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                        <div className="flex flex-col xl:flex-row min-h-[700px]">

                            {/* Left Section - Project Info */}
                            <div className="xl:w-2/5 p-8 sm:p-10 border-b xl:border-b-0 xl:border-r border-gray-200 bg-white">
                                <div className="flex flex-col h-full">

                                    {/* Project Header */}
                                    <div className="flex-shrink-0 mb-8">
                                        <div className="flex flex-col gap-6 items-center text-center">
                                            <div className="flex-shrink-0">
                                                <div className="relative p-1 bg-gradient-to-r from-blue-600 to-yellow-500 rounded-2xl shadow-lg">
                                                    <img
                                                        src={imagenURL}
                                                        alt={proyecto.nombre_proyecto}
                                                        className="w-40 h-40 sm:w-48 sm:h-48 rounded-xl object-cover border-2 border-white shadow-lg"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h1 className="text-2xl sm:text-4xl font-bold mb-4 leading-tight text-gray-900">
                                                    {proyecto.nombre_proyecto}
                                                </h1>
                                                <div className="flex flex-wrap justify-center gap-2 mb-4">
                                                    {proyecto.autores.map((autor, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="inline-flex items-center gap-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow-sm"
                                                        >
                                                            <Users size={14} />
                                                            {autor}
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="flex flex-wrap justify-center gap-3 mt-4">
                                                    {/* Fecha de publicación */}
                                                    <div className="flex items-center gap-2 text-gray-600 text-sm bg-gray-100 px-4 py-2 rounded-lg">
                                                        <CalendarDays size={16} />
                                                        {new Date(proyecto.fechaPublicacion).toLocaleDateString("es-CO", {
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric",
                                                        })}
                                                    </div>

                                                    {/* Descargas */}
                                                    <div className="text-gray-600 text-sm bg-blue-50 border border-blue-200 px-4 py-2 rounded-lg shadow-sm">
                                                        {formatNumber(proyecto.downloads || 0)} Descargas
                                                    </div>

                                                </div>

                                            </div>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="flex-1 mb-8">
                                        <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">
                                            Descripción
                                        </h2>
                                        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                            <p className="text-gray-700 leading-relaxed text-base text-center">
                                                {proyecto.descripcion}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex-shrink-0 space-y-4">
                                        <button
                                            onClick={async () => {
                                                const link = document.createElement("a");
                                                link.href = archivoURL;
                                                link.download = proyecto.nombre_proyecto + ".apk";
                                                document.body.appendChild(link);
                                                link.click();
                                                document.body.removeChild(link);

                                                // 2. Notificar al backend que hubo una descarga
                                                try {
                                                    await fetch(`${apiUrl}/proyectos/${proyecto._id}/descargar`, {
                                                        method: "POST"
                                                    });
                                                    // opcional: recargar proyectos para que se vea actualizado
                                                    // await TraerProyectos();
                                                } catch (error) {
                                                    console.error("Error registrando descarga:", error);
                                                }
                                            }}
                                            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                                        >
                                            <Download size={20} />
                                            Descargar APK
                                        </button>


                                        {proyecto.urlDoc && (
                                            <a
                                                href={docURL}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full flex items-center justify-center gap-3 border-2 border-yellow-500 hover:bg-yellow-500 text-yellow-600 hover:text-white px-6 py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105"
                                            >
                                                <FileText size={20} />
                                                Ver Documentación
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right Section - Media Content */}
                            <div className="xl:w-3/5 p-8 sm:p-10 bg-gray-50">
                                <div className="h-full space-y-8">

                                    {/* Video Section */}
                                    {proyecto.youtubeLink && (() => {
                                        const videoId = getYouTubeVideoId(proyecto.youtubeLink);
                                        return videoId ? (
                                            <div className="space-y-6">
                                                <div className="flex items-center gap-3 bg-white rounded-lg p-4 shadow-md border-l-4 border-blue-600">
                                                    <div className="p-2 bg-blue-600 rounded-lg">
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
                                                        title="Video de proyecto"
                                                        frameBorder="0"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                    ></iframe>
                                                </div>
                                            </div>
                                        ) : null;
                                    })()}

                                    {/* Images Gallery */}
                                    {proyecto.imagenes && proyecto.imagenes.length > 0 && (
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-3 bg-white rounded-lg p-4 shadow-md border-l-4 border-yellow-500">
                                                <div className="p-2 bg-yellow-500 rounded-lg">
                                                    <Image size={20} className="text-white" />
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-900">
                                                    Capturas de Pantalla
                                                </h3>
                                            </div>

                                            {/* Horizontal scrollable gallery for multiple images */}
                                            {proyecto.imagenes.length > 2 ? (
                                                <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2">
                                                    {proyecto.imagenes.map((img, idx) => {
                                                        const rutaLimpiaImg = img.replace(/\\/g, "/");
                                                        const imagenURLGallery = `${apiUrl}/uploads/${rutaLimpiaImg.split("uploads/")[1]}`;
                                                        return (
                                                            <div key={idx} className="flex-shrink-0 w-56 h-40 rounded-xl overflow-hidden shadow-lg border-2 border-gray-200 hover:border-blue-600 transition-all duration-300">
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
                                                /* Grid for 1-2 images */
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    {proyecto.imagenes.map((img, idx) => {
                                                        const rutaLimpiaImg = img.replace(/\\/g, "/");
                                                        const imagenURLGallery = `${apiUrl}/uploads/${rutaLimpiaImg.split("uploads/")[1]}`;
                                                        return (
                                                            <div key={idx} className="aspect-video rounded-xl overflow-hidden shadow-lg border-2 border-gray-200 hover:border-yellow-500 transition-all duration-300">
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

                                    {/* Fallback content if no media */}
                                    {!proyecto.youtubeLink && (!proyecto.imagenes || proyecto.imagenes.length === 0) && (
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
                <ValoracionesProyecto
                    proyecto={proyecto}
                    Usuario={Usuario}
                    puedeComentar={puedeComentar}
                    AgregarReview={AgregarReview}
                    EliminarReview={EliminarReview}
                    TraerProyectos={TraerProyectos}
                />

            </div>
        </>
    );
};

export default DetalleProyecto;