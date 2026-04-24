import React, { useState, useEffect, useMemo, useCallback } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useProyectos } from "../context/ProyectoContext";

const formatAutores = (autores) => {
  if (!autores) return "No especificado";
  try {
    if (typeof autores === "string" && autores.startsWith("[")) {
      const parsed = JSON.parse(autores);
      if (Array.isArray(parsed)) return parsed.join(", ");
    }
    if (Array.isArray(autores)) return autores.join(", ");
    if (typeof autores === "string") {
      return autores.replace(/[\[\]"']/g, "").replace(/,\s*,/g, ",").replace(/^\s*,|,\s*$/g, "").trim();
    }
  } catch {
    return String(autores).replace(/[\[\]"']/g, "").trim() || "No especificado";
  }
  return "No especificado";
};

// Tarjeta individual con soporte hover (desktop) y click/touch (móvil)
const AppCard = ({ app, imagenURL, onVerMas }) => {
  const [flipped, setFlipped] = useState(false);

  const toggleFlip = useCallback(() => {
    setFlipped((f) => !f);
  }, []);

  return (
    <div
      className={`flip-card${flipped ? " is-flipped" : ""}`}
      onClick={toggleFlip}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && toggleFlip()}
      aria-label={`Ver detalles de ${app.nombre_proyecto}`}
    >
      <div className="flip-card-inner">
        {/* Frente */}
        <div className="flip-card-front">
          <img
            src={imagenURL}
            alt={app.nombre_proyecto}
            className="w-full h-full object-cover"
          />
          <span className="flip-card-touch-hint">Toca para ver más</span>
        </div>

        {/* Reverso */}
        <div className="flip-card-back">
          <div className="flex items-center mb-3">
            <span className="text-yellow-400 text-2xl mr-2">💡</span>
            <span className="text-yellow-400 font-bold uppercase text-sm">Proyecto Estudiantil</span>
          </div>

          <h3 className="text-xl font-extrabold mb-3 leading-snug">{app.nombre_proyecto}</h3>

          <p className="text-sm leading-relaxed mb-4 opacity-95 line-clamp-4">
            {app.descripcion || "Este proyecto busca fomentar la innovación tecnológica en el área de desarrollo."}
          </p>

          <div className="mb-4 space-y-1 text-sm">
            <p><span className="font-semibold">Autores:</span> {formatAutores(app.autores)}</p>
            <p><span className="font-semibold">Programa:</span> {app.materia?.nombre || "Sin especificar"}</p>
          </div>

          <button
            className="bg-yellow-400 text-blue-900 font-bold py-2 px-5 rounded-md text-sm uppercase tracking-wide shadow-md hover:bg-yellow-500 transition-all duration-300 w-fit mt-auto"
            onClick={(e) => {
              e.stopPropagation();
              onVerMas(app._id);
            }}
          >
            Ver más
          </button>

          <div className="absolute bottom-4 right-4 text-right opacity-80">
            <span className="text-xs font-bold leading-tight tracking-wide">
              Universidad<br />Autónoma<br />del Cauca
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const AplicacionesMoviles = () => {
  const navigate = useNavigate();
  const { Proyectos, TraerProyectos } = useProyectos();
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_RUTA1;

  useEffect(() => {
    TraerProyectos().finally(() => setLoading(false));
  }, []);

  const proyectosOrdenados = useMemo(
    () => [...Proyectos].sort((a, b) => new Date(b.fechaPublicacion) - new Date(a.fechaPublicacion)),
    [Proyectos]
  );

  const proyectosAgrupados = proyectosOrdenados.reduce((acc, proyecto) => {
    const categoria = proyecto.materia?.nombre || "Sin categoría";
    if (!acc[categoria]) acc[categoria] = [];
    acc[categoria].push(proyecto);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="min-h-[80vh] flex flex-col justify-center items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-cyan-600">Cargando aplicaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="aplicaciones-moviles">
      <Navbar />

      <div className="imagen-seccion">
        <img src="img/DSC04968.JPG" alt="Aplicaciones Móviles" />
        <h1 className="titulo-seccion">Aplicaciones Móviles</h1>
      </div>

      <div className="contenido-proyectos">
        {Object.entries(proyectosAgrupados).map(([categoria, items]) => (
          <div key={categoria} className="categoria mt-6">
            <h2 className="text-2xl sm:text-3xl font-bold mt-4 ml-2 text-blue-900">{categoria}</h2>

            {items.length > 0 ? (
              <div className="flip-card-grid">
                {items.map((app, i) => {
                  const rutaLimpia = app.urlimg?.replace(/\\/g, "/");
                  const imagenURL = `${apiUrl}/uploads/${rutaLimpia?.split("uploads/")[1]}`;
                  return (
                    <AppCard
                      key={i}
                      app={app}
                      imagenURL={imagenURL}
                      onVerMas={(id) => navigate(`/detalle/${id}`)}
                    />
                  );
                })}
              </div>
            ) : (
              <p className="text-left ml-2 py-4 text-gray-500">No hay aplicaciones disponibles.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AplicacionesMoviles;
