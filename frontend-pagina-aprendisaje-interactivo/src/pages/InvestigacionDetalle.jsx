import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useInvestigacion } from "../context/InvestigacionContext";
import { Download, FileText, CalendarDays, Users, Link as LinkIcon, Image } from "lucide-react";

const InvestigacionDetalle = () => {
  const { id } = useParams();
  const { investigaciones, traerInvestigaciones } = useInvestigacion();
  const apiUrl = import.meta.env.VITE_RUTA1;

  useEffect(() => {
    if (!investigaciones.some(i => i._id === id)) {
      traerInvestigaciones();
    }
  }, [id, investigaciones, traerInvestigaciones]);

  if (!investigaciones || investigaciones.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center space-y-4 p-8">
            <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-gray-600">Cargando investigación...</p>
          </div>
        </div>
      </>
    );
  }

  const investigacion = investigaciones.find((inv) => inv._id === id);
  if (!investigacion) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center space-y-4 p-8">
            <h2 className="text-xl font-semibold text-gray-900">Investigación no encontrada</h2>
            <p className="text-gray-600">La investigación que buscas no existe</p>
          </div>
        </div>
      </>
    );
  }

  // URLs
  const rutaLimpia = investigacion.urlimg?.replace(/\\/g, "/");
  const imagenURL = rutaLimpia ? `${apiUrl}/uploads/${rutaLimpia.split("uploads/")[1]}` : "img/placeholder.jpg";

  const rutaDoc = investigacion.urlDoc?.replace(/\\/g, "/");
  const archivoURL = rutaDoc ? `${apiUrl}/uploads/${rutaDoc.split("uploads/")[1]}` : null;

  const fuenteURL = investigacion.urlArticulo;

  const handleDescarga = () => {
    if (!archivoURL) return;
    const link = document.createElement("a");
    link.href = archivoURL;
    link.download = archivoURL.split("/").pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
                          alt={investigacion.nombre_proyecto}
                          className="w-40 h-40 sm:w-48 sm:h-48 rounded-xl object-cover border-2 border-white shadow-lg"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h1 className="text-2xl sm:text-4xl font-bold mb-4 leading-tight text-gray-900">
                          {investigacion.nombre_proyecto}
                        </h1>
                        <div className="flex flex-wrap justify-center gap-2 mb-4">
                          {investigacion.autores?.split(",").map((autor, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 px-3 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg shadow-sm"
                            >
                              <Users size={14} />
                              {autor.trim()}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-center gap-2 text-gray-600 text-sm bg-gray-100 px-4 py-2 rounded-lg">
                          <CalendarDays size={16} />
                          {new Date(investigacion.fechaPublicacion).toLocaleDateString("es-CO", {
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Descripción */}
                  <div className="flex-1 mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">Resumen</h2>
                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                      <p className="text-gray-700 leading-relaxed text-base text-center">
                        {investigacion.descripcion}
                      </p>
                    </div>
                  </div>

                  {/* Botones */}
                  <div className="flex-shrink-0 space-y-4">
                    {archivoURL && (
                      <button
                        onClick={handleDescarga}
                        className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800 text-white px-6 py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                      >
                        <Download size={20} />
                        Descargar Documento
                      </button>
                    )}
                    {fuenteURL && (
                      <a
                        href={fuenteURL}
                        target="_blank"
                        rel="noopener noreferrer"
                         className="w-full flex items-center justify-center gap-3 border-2 border-indigo-500 hover:bg-indigo-500 text-indigo-600 hover:text-white px-6 py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105"
                      >
                        <LinkIcon size={20} />
                        Ver Fuente Externa
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Section - Media */}
              <div className="xl:w-3/5 p-8 sm:p-10 bg-gray-50">
                <div className="h-full space-y-8">

                  {/* Si no hay multimedia */}
                  {!fuenteURL && !archivoURL && (
                    <div className="flex items-center justify-center h-64 text-gray-500 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                      <div className="text-center space-y-3">
                        <div className="p-4 bg-gray-100 rounded-full inline-block">
                          <Image size={40} className="text-gray-500" />
                        </div>
                        <p className="font-medium">No hay material adicional disponible</p>
                      </div>
                    </div>
                  )}

                  {/* Sección de documentación */}
                  {archivoURL && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 bg-white rounded-lg p-4 shadow-md border-l-4 border-indigo-600">
                        <div className="p-2 bg-indigo-600 rounded-lg">
                          <FileText size={20} className="text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Documentación Adjunta</h3>
                      </div>
                      <iframe
                        src={archivoURL}
                        title="Documento de investigación"
                        className="w-full h-[500px] rounded-xl border-2 border-gray-200 shadow-lg"
                      ></iframe>
                    </div>
                  )}

                  {/* Fuente externa */}
                  {fuenteURL && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 bg-white rounded-lg p-4 shadow-md border-l-4 border-green-600">
                        <div className="p-2 bg-green-600 rounded-lg">
                          <LinkIcon size={20} className="text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Fuente Externa</h3>
                      </div>
                      <a
                        href={fuenteURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-center text-indigo-600 hover:text-indigo-800 font-medium underline"
                      >
                        Ir al artículo original
                      </a>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvestigacionDetalle;
