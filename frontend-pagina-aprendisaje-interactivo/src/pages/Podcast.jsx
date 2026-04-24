import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { usePodcast } from "../context/PodcastContext";

const Podcast = () => {
  const [seccionActual] = useState("Podcasts");
  const { TraerPodcast, Podcast } = usePodcast();
  const apiUrl = import.meta.env.VITE_RUTA1;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerDatos = async () => {
      await TraerPodcast();
      setTimeout(() => {
        setLoading(false);
      }, 500);
    };
    obtenerDatos();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="min-h-screen flex flex-col justify-center items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-sm text-cyan-600">Cargando podcasts...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      {/* Imagen de portada */}
      <div className="imagen-seccion">
        <img src="img/DSC05007.JPG" alt="Imagen de podcasts" />
        <h1 className="titulo-seccion">Ahora estás en: {seccionActual}</h1>
      </div>

      <h2 className="text-left pl-[200px] text-2xl font-bold mt-5 text-gray-800 w-full">
        Lista de Episodios
      </h2>

      {/* Contenedor de episodios con tarjetas interactivas */}
      <div className="flex justify-center gap-8 flex-wrap mt-8">
        {Podcast?.data.map((ep, i) => {
          const rutaLimpia = ep.ArchivoImagen
            ? ep.ArchivoImagen.replace(/\\/g, "/")
            : null;

          const imagenURL = rutaLimpia
            ? `${apiUrl}/uploads/${rutaLimpia.split("uploads/")[1]}`
            : "img/default-podcast.png";

          return (
            <div
              key={i}
              className="w-96 h-[32rem] m-4 group cursor-pointer"
              style={{ perspective: "1000px" }}
            >
              <div
                className="relative w-full h-full duration-700 group-hover:rotate-y-180"
                style={{
                  transformStyle: "preserve-3d",
                  transition: "transform 0.7s",
                }}
              >
                {/* Parte frontal */}
                <div
                  className="absolute inset-0 rounded-2xl shadow-xl overflow-hidden"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <img
                    src={imagenURL}
                    alt={ep.nombre_proyecto}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Parte trasera */}
                <div
                  className="absolute inset-0 bg-blue-900 text-white p-7 flex flex-col rounded-2xl shadow-2xl"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  {/* Header */}
                  <div className="flex items-center mb-4">
                    <span className="text-yellow-400 text-3xl mr-2">🎙️</span>
                    <span className="text-yellow-400 font-bold uppercase text-base">
                      Podcast
                    </span>
                  </div>

                  {/* Título */}
                  <h3 className="text-3xl font-extrabold mb-4 leading-snug">
                    {ep.nombre_proyecto}
                  </h3>

                  {/* Descripción */}
                  <p className="text-lg leading-relaxed mb-5 opacity-95 line-clamp-4">
                    {ep.descripcion || "Episodio sobre innovación y tecnología..."}
                  </p>

                  {/* Autores y Materia */}
                  <div className="mb-6 space-y-2 text-base">
                    <p>
                      <span className="font-semibold">Autores:</span>{" "}
                      {ep.autores || "No especificados"}
                    </p>
                    <p>
                      <span className="font-semibold">Materia:</span>{" "}
                      {ep.materia || "Sin especificar"}
                    </p>
                  </div>

                  {/* Botón */}
                  <a
                    href={ep.UrlAudio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-yellow-400 text-blue-900 font-bold py-3 px-6 rounded-md text-lg uppercase tracking-wide shadow-md hover:bg-yellow-500 transition-all duration-300 w-fit"
                  >
                    Escuchar
                  </a>

                  {/* Footer */}
                  <div className="absolute bottom-6 right-6 text-right opacity-90">
                    <span className="text-base font-bold leading-tight tracking-wide">
                      Universidad<br />
                      Autónoma<br />
                      del Cauca
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Podcast;
