import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Importación de contextos que proveen datos desde distintos módulos
import { useProyectos } from "../context/ProyectoContext";
import { UseSimulaciones } from "../context/SimulacionesContex";
import { usePodcast } from "../context/PodcastContext";
import { useInvestigacion } from "../context/InvestigacionContext";

// Barra de navegación
import Navbar from "../components/Navbar";

const Resultados = () => {
    // Obtener la palabra clave desde la URL (?query=...)
    const query = new URLSearchParams(useLocation().search).get("query") || "";
    const navigate = useNavigate();

    // Obtener datos desde los contextos
    const { Proyectos, TraerProyectos } = useProyectos();
    const { Simulaciones, TraerSimulaciones } = UseSimulaciones();
    const { TraerPodcast, Podcast } = usePodcast();
    const { traerInvestigaciones, investigaciones } = useInvestigacion();

    // Estado para manejar la paginación
    const [paginaActual, setPaginaActual] = React.useState(1);
    const resultadosPorPagina = 6;

    // Índices para determinar qué resultados mostrar según la página actual
    const indiceInicio = (paginaActual - 1) * resultadosPorPagina;
    const indiceFin = indiceInicio + resultadosPorPagina;

    // Combinar todos los datos en un solo arreglo, agregando un campo "tipo"
    const datosCombinados = [
        ...(Array.isArray(Proyectos) ? Proyectos.map(p => ({ ...p, tipo: "proyecto" })) : []),
        ...(Array.isArray(Simulaciones) ? Simulaciones.map(s => ({ ...s, tipo: "simulacion" })) : []),
        ...(Array.isArray(investigaciones) ? investigaciones.map(i => ({ ...i, tipo: "investigacion" })) : []),
        ...(Array.isArray(Podcast?.data) ? Podcast.data.map(p => ({ ...p, tipo: "podcast" })) : []),
    ];

    // Filtrar los datos combinados según la palabra clave (query)
    const resultados = datosCombinados.filter(item =>
        item.nombre_proyecto?.toLowerCase().includes(query.toLowerCase()) ||
        item.descripcion?.toLowerCase().includes(query.toLowerCase()) ||
        (
            Array.isArray(item.autores)
                ? item.autores.join(", ").toLowerCase().includes(query.toLowerCase())
                : item.autores?.toLowerCase().includes(query.toLowerCase())
        )
    );

    // Obtener solo los resultados de la página actual
    const resultadosPaginados = resultados.slice(indiceInicio, indiceFin);
    const totalPaginas = Math.ceil(resultados.length / resultadosPorPagina);

    // Cargar los datos al cargar el componente
    useEffect(() => {
        TraerProyectos();
        TraerSimulaciones();
        TraerPodcast();
        traerInvestigaciones();
    }, []);

    // Redirige al detalle del ítem según su tipo
    const redireccionarDetalle = (item) => {
        switch (item.tipo) {
            case "proyecto":
                return `/detalle/${item._id}`;
            case "simulacion":
                return `/detalle-simulacion/${item._id}`;
            case "podcast":
                return `/podcast`;
            case "investigacion":
                return `/investigaciones/${item._id}`;
            default:
                return "#";
        }
    };

    // Manejar el envío del formulario de búsqueda
    const handleSearch = (e) => {
        e.preventDefault();
        const newQuery = e.target.elements.busqueda.value;
        navigate(`/resultados?query=${newQuery}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            {/* Barra de navegación con formulario de búsqueda */}
            <Navbar>
                <form onSubmit={handleSearch} className="flex justify-center gap-2 p-4 w-full max-w-2xl mx-auto">
                    <input
                        name="busqueda"
                        defaultValue={query}
                        placeholder="Buscar proyectos..."
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
                    />
                    <button
                        type="submit"
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md hover:shadow-lg"
                    >
                        Buscar
                    </button>
                </form>
            </Navbar>

            <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
                {/* Barra lateral: Resumen de búsqueda */}
                <aside className="bg-white rounded-xl shadow-md p-6 w-full lg:w-1/4 h-fit sticky top-6">
                    <h3 className="text-xl font-bold mb-4 text-gray-800">Resumen de búsqueda</h3>
                    <div className="space-y-3">
                        <p className="text-gray-600 flex items-center gap-2 flex-wrap">
                            <span className="font-medium">Palabra clave:</span>
                            <span className="flex items-center gap-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-md">
                                {query}
                                {/* Botón para eliminar búsqueda */}
                                <button
                                    onClick={() => navigate("/resultados")}
                                    className="ml-1 text-blue-500 hover:text-blue-700 font-bold"
                                    title="Eliminar búsqueda"
                                >
                                    ×
                                </button>
                            </span>
                        </p>

                        {/* Cantidad de resultados */}
                        <p className="text-gray-600">
                            <span className="font-medium">Resultados:</span>
                            <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-md">{resultados.length}</span>
                        </p>
                    </div>
                </aside>

                {/* Sección principal de resultados */}
                <main className="w-full lg:w-3/4">
                    {resultados.length > 0 ? (
                        <div className="space-y-6">
                            {/* Lista de resultados */}
                            {resultadosPaginados.map((item, index) => (
                                <div
                                    key={item._id || index}
                                    className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg transition-all duration-300"
                                    onClick={() => navigate(redireccionarDetalle(item))}
                                >
                                    <div className="flex justify-between items-start">
                                        <h4 className="text-xl font-bold text-gray-800 mb-2">
                                            {item.nombre_proyecto || "Sin nombre"}
                                        </h4>
                                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full capitalize">
                                            {item.tipo}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 mb-3">
                                        {item.descripcion?.substring(0, 150)}...
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {Array.isArray(item.autores) ? item.autores.join(", ") : item.autores}
                                    </p>
                                </div>
                            ))}

                            {/* Navegación entre páginas */}
                            {totalPaginas > 1 && (
                                <div className="mt-8 flex justify-center gap-2">
                                    {Array.from({ length: totalPaginas }, (_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setPaginaActual(i + 1)}
                                            className={`px-4 py-2 rounded-lg transition ${paginaActual === i + 1
                                                ? "bg-blue-600 text-white shadow-md"
                                                : "bg-white text-gray-700 hover:bg-gray-100 shadow-sm"}`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        // Mensaje cuando no hay resultados
                        <div className="bg-white rounded-xl shadow-md p-8 text-center">
                            <h3 className="text-xl font-medium text-gray-600 mb-4">No se encontraron resultados</h3>
                            <p className="text-gray-500">Intenta con otros términos de búsqueda</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Resultados;
