import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { UseSimulaciones } from "../context/SimulacionesContex";

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
const SimCard = ({ simulacion, imagenURL, onVerMas }) => {
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
      aria-label={`Ver detalles de ${simulacion.nombre_proyecto}`}
    >
      <div className="flip-card-inner">
        {/* Frente */}
        <div className="flip-card-front">
          <img
            src={imagenURL}
            alt={simulacion.nombre_proyecto}
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

          <h3 className="text-xl font-extrabold mb-3 leading-snug">{simulacion.nombre_proyecto}</h3>

          <p className="text-sm leading-relaxed mb-4 opacity-95 line-clamp-4">
            {simulacion.descripcion || "Este proyecto busca fomentar la innovación tecnológica en el área de desarrollo."}
          </p>

          <div className="mb-4 space-y-1 text-sm">
            <p><span className="font-semibold">Autores:</span> {formatAutores(simulacion.autores)}</p>
            <p><span className="font-semibold">Programa:</span> {simulacion.materia?.nombre || "Sin especificar"}</p>
          </div>

          <button
            className="bg-yellow-400 text-blue-900 font-bold py-2 px-5 rounded-md text-sm uppercase tracking-wide shadow-md hover:bg-yellow-500 transition-all duration-300 w-fit mt-auto"
            onClick={(e) => {
              e.stopPropagation();
              onVerMas(simulacion._id);
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

const Simulaciones = () => {
  const navigate = useNavigate();
  const { Simulaciones, TraerSimulaciones } = UseSimulaciones();
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_RUTA1;

  useEffect(() => {
    TraerSimulaciones().finally(() => setLoading(false));
  }, []);

  const simulacionesOrdenadas = useMemo(
    () => [...Simulaciones].sort((a, b) => new Date(b.fechaPublicacion) - new Date(a.fechaPublicacion)),
    [Simulaciones]
  );

  const simulacionesAgrupadas = simulacionesOrdenadas.reduce((acc, simulacion) => {
    const categoria = simulacion.materia?.nombre || "Sin categoría";
    if (!acc[categoria]) acc[categoria] = [];
    acc[categoria].push(simulacion);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="min-h-[80vh] flex flex-col justify-center items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-cyan-600">Cargando simulaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="simulaciones">
      <Navbar />

      <div className="imagen-seccion">
        <img src="img/DSC04973.JPG" alt="Simulaciones" />
        <h1 className="titulo-seccion">Simulaciones</h1>
      </div>

      <div className="contenido-proyectos">
        {Object.entries(simulacionesAgrupadas).map(([categoria, items]) => (
          <div key={categoria} className="categoria mt-6">
            <h2 className="text-2xl sm:text-3xl font-bold mt-4 ml-2 text-blue-900">{categoria}</h2>

            {items.length > 0 ? (
              <div className="flip-card-grid">
                {items.map((simulacion, i) => {
                  const rutaLimpia = simulacion.urlimg?.replace(/\\/g, "/");
                  const imagenURL = `${apiUrl}/uploads/${rutaLimpia?.split("uploads/")[1]}`;
                  return (
                    <SimCard
                      key={i}
                      simulacion={simulacion}
                      imagenURL={imagenURL}
                      onVerMas={(id) => navigate(`/detalle-simulacion/${id}`)}
                    />
                  );
                })}
              </div>
            ) : (
              <p className="text-left ml-2 py-4 text-gray-500">No hay simulaciones disponibles.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Simulaciones;
