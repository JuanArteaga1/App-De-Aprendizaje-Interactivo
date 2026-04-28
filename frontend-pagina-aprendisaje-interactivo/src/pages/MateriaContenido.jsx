import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { GetMateriaId } from "../api/AdmiMateria";
import { GetAllProyectos } from "../api/AdmiProyecto";
import { GetAllSimulaciones } from "../api/AdmiSimulaciones";
import { GetAllInvestigacion } from "../api/AdmiInvestigacion";
import { GetAllPodcast } from "../api/AdmiPodcast";

const normalize = (value) => (value ? String(value).trim().toLowerCase() : "");

const normalizeMateriaName = (item) =>
  normalize(item?.materia?.nombre || item?.materia || item?.nombre_materia);

const MateriaContenido = () => {
  const { id } = useParams();
  const apiUrl = import.meta.env.VITE_RUTA1;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [materia, setMateria] = useState(null);
  const [contenido, setContenido] = useState({
    simulaciones: [],
    aplicaciones: [],
    investigaciones: [],
    podcast: [],
  });

  useEffect(() => {
    let cancelado = false;

    const cargarContenido = async () => {
      try {
        setLoading(true);
        setError("");
        const [materiaRes, simulacionesRes, aplicacionesRes, investigacionesRes, podcastRes] =
          await Promise.all([
            GetMateriaId(id),
            GetAllSimulaciones(),
            GetAllProyectos(),
            GetAllInvestigacion(),
            GetAllPodcast(),
          ]);

        if (cancelado) return;

        const materiaData = materiaRes?.data;
        const materiaNombre = normalize(materiaData?.nombre);
        const materiaId = materiaData?._id;

        const matchByMateria = (item) => {
          const itemMateriaId = item?.materia?._id || item?.materia;
          if (materiaId && itemMateriaId && String(itemMateriaId) === String(materiaId)) {
            return true;
          }
          return normalizeMateriaName(item) === materiaNombre;
        };

        const podcastData = Array.isArray(podcastRes?.data?.data)
          ? podcastRes.data.data
          : Array.isArray(podcastRes?.data)
            ? podcastRes.data
            : [];

        setMateria(materiaData);
        setContenido({
          simulaciones: (simulacionesRes?.data || []).filter(matchByMateria),
          aplicaciones: (aplicacionesRes?.data || []).filter(matchByMateria),
          investigaciones: (investigacionesRes?.data || []).filter(matchByMateria),
          podcast: podcastData.filter(matchByMateria),
        });
      } catch (err) {
        console.error("Error cargando contenido de materia", err);
        if (!cancelado) {
          setError(
            "No fue posible obtener el contenido de esta materia. Verifica tu conexión con el backend."
          );
        }
      } finally {
        if (!cancelado) setLoading(false);
      }
    };

    cargarContenido();
    return () => {
      cancelado = true;
    };
  }, [id]);

  const totalContenido = useMemo(
    () =>
      contenido.simulaciones.length +
      contenido.aplicaciones.length +
      contenido.investigaciones.length +
      contenido.podcast.length,
    [contenido]
  );

  const buildImageURL = (rawPath) => {
    if (!rawPath) return "/img/pdexample.jpg";
    const clean = String(rawPath).replace(/\\/g, "/");
    return `${apiUrl}/uploads/${clean.split("uploads/").pop()}`;
  };

  const sections = [
    {
      key: "simulaciones",
      title: "Simulaciones",
      pathBuilder: (item) => `/detalle-simulacion/${item._id}`,
    },
    {
      key: "aplicaciones",
      title: "Aplicaciones",
      pathBuilder: (item) => `/detalle/${item._id}`,
    },
    {
      key: "investigaciones",
      title: "Investigaciones",
      pathBuilder: (item) => `/investigaciones/${item._id}`,
    },
    {
      key: "podcast",
      title: "Podcast",
      pathBuilder: (item) => `/episodio/${item._id}`,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">
            {materia?.nombre || "Materia"}
          </h1>
          <p className="mt-2 text-slate-600">
            Contenido asociado disponible para esta materia.
          </p>
          {!loading && !error && (
            <p className="mt-3 text-sm font-medium text-[#3C64C9]">
              {totalContenido} recursos encontrados
            </p>
          )}
        </header>

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600">
            Cargando contenido...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-700">
            {error}
          </div>
        ) : totalContenido === 0 ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center text-amber-700">
            Esta materia no tiene contenido publicado todavía.
          </div>
        ) : (
          <div className="space-y-8">
            {sections.map((section) => {
              const items = contenido[section.key];
              if (!items.length) return null;
              return (
                <section key={section.key}>
                  <h2 className="mb-4 text-2xl font-semibold text-slate-900">{section.title}</h2>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {items.map((item) => (
                      <Link
                        key={`${section.key}-${item._id}`}
                        to={section.pathBuilder(item)}
                        className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                      >
                        <img
                          src={buildImageURL(item.urlimg || item.ArchivoImagen)}
                          alt={item.nombre_proyecto}
                          className="h-44 w-full object-cover"
                          loading="lazy"
                        />
                        <div className="p-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-[#3C64C9]">
                            {section.title}
                          </p>
                          <h3 className="mt-2 line-clamp-2 text-lg font-semibold text-slate-900">
                            {item.nombre_proyecto}
                          </h3>
                          <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                            {item.descripcion || "Sin descripción disponible."}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default MateriaContenido;
