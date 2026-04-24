import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useProyectos } from "../context/ProyectoContext";
import { UseSimulaciones } from "../context/SimulacionesContex";

const IngCivil = () => {
  const { Proyectos, TraerProyectos } = useProyectos();
  const { Simulaciones, TraerSimulaciones } = UseSimulaciones();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_RUTA1;

  useEffect(() => {
    const cargarDatos = async () => {
      await TraerProyectos();
      await TraerSimulaciones();
      setLoading(false);
    };
    cargarDatos();
  }, []);

  const simulacionesIngCivil = useMemo(
    () =>
      Simulaciones.filter((sim) => sim.materia?.nombre === "Ingeniería Civil").map(
        (sim) => ({
          nombre: sim.nombre_proyecto,
          imagen: `${apiUrl}/uploads/${sim.urlimg
            ?.replace(/\\/g, "/")
            .split("uploads/")[1]}`,
          tipo: "Simulación",
          categoria: "Ingeniería Civil",
          autores: sim.autores,
          descripcion: sim.descripcion,
          _id: sim._id,
        })
      ),
    [Simulaciones, apiUrl]
  );

  const aplicacionesIngCivil = useMemo(
    () =>
      Proyectos.filter((app) => app.materia?.nombre === "Ingeniería Civil").map(
        (app) => ({
          nombre: app.nombre_proyecto,
          imagen: `${apiUrl}/uploads/${app.urlimg
            ?.replace(/\\/g, "/")
            .split("uploads/")[1]}`,
          tipo: "Aplicación",
          categoria: "Ingeniería Civil",
          autores: app.autores,
          descripcion: app.descripcion,
          _id: app._id,
        })
      ),
    [Proyectos, apiUrl]
  );

  const formatAutores = (autores) => {
    if (!autores) return "No especificado";
    try {
      if (typeof autores === "string" && autores.startsWith("[")) {
        const parsed = JSON.parse(autores);
        if (Array.isArray(parsed)) return parsed.join(", ");
      }
      if (Array.isArray(autores)) return autores.join(", ");
      if (typeof autores === "string") {
        return autores
          .replace(/[\[\]"']/g, "")
          .replace(/,\s*,/g, ",")
          .replace(/^\s*,|,\s*$/g, "")
          .trim();
      }
    } catch (error) {
      return String(autores)
        .replace(/[\[\]"']/g, "")
        .replace(/,\s*,/g, ",")
        .replace(/^\s*,|,\s*$/g, "")
        .trim();
    }
    return "No especificado";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="min-h-screen flex flex-col justify-center items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-sm text-cyan-600">
            Cargando proyectos de Ingeniería Civil...
          </p>
        </div>
      </div>
    );
  }

  // 🔹 Renderizador de tarjetas
  const renderTarjetas = (items, icono) => (
    <div className="flex flex-wrap gap-8 justify-start py-6">
      {items.length > 0 ? (
        items.map((app, i) => {
          const imagenURL = app.imagen;
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
                {/* Frente */}
                <div
                  className="absolute inset-0 rounded-2xl shadow-xl overflow-hidden"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <img
                    src={imagenURL}
                    alt={app.nombre}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Reverso */}
                <div
                  className="absolute inset-0 bg-blue-900 text-white p-7 flex flex-col rounded-2xl shadow-2xl"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <div className="flex items-center mb-4">
                    <span className="text-yellow-400 text-3xl mr-2">
                      {icono}
                    </span>
                    <span className="text-yellow-400 font-bold uppercase text-base">
                      {app.tipo}
                    </span>
                  </div>

                  <h3 className="text-3xl font-extrabold mb-4 leading-snug">
                    {app.nombre}
                  </h3>

                  <p className="text-lg leading-relaxed mb-5 opacity-95 line-clamp-4">
                    {app.descripcion ||
                      "Este proyecto busca fomentar la innovación tecnológica..."}
                  </p>

                  <div className="mb-6 space-y-2 text-base">
                    <p>
                      <span className="font-semibold">Autores:</span>{" "}
                      {formatAutores(app.autores)}
                    </p>
                    <p>
                      <span className="font-semibold">Categoría:</span>{" "}
                      {app.categoria}
                    </p>
                  </div>

                  <button
                    className="bg-yellow-400 text-blue-900 font-bold py-3 px-6 rounded-md text-lg uppercase tracking-wide shadow-md hover:bg-yellow-500 transition-all duration-300 w-fit"
                    onClick={() => navigate(`/detalle/${app._id}`)}
                  >
                    Ver más
                  </button>

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
        })
      ) : (
        <p>No hay proyectos disponibles.</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
            Explorando la Ingeniería Civil
          </h1>
          <p className="text-2xl text-gray-600 max-w-3xl mx-auto">
            Descubre simulaciones interactivas y aplicaciones móviles que hacen
            de la ingeniería civil una experiencia fascinante.
          </p>
        </div>

        {/* Simulaciones */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold text-gray-800 mb-8">
            Simulaciones de Ing. Civil
          </h2>
          {renderTarjetas(simulacionesIngCivil, "🏗️")}
        </section>

        {/* Aplicaciones */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold text-gray-800 mb-8">
            Aplicaciones de Ing. Civil
          </h2>
          {renderTarjetas(aplicacionesIngCivil, "📱")}
        </section>
      </div>
    </div>
  );
};

export default IngCivil;
