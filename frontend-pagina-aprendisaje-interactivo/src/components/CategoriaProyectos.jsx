import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CategoriaProyectos = ({ titulo, categoria, proyectos }) => {
    const navigate = useNavigate();
    const [busqueda, setBusqueda] = useState("");
    const [etiquetas, setEtiquetas] = useState([]);

    const goToDetalle = (proyecto) => {
        if (proyecto.tipo === "Simulación") {
            navigate(`/detalle-simulacion/${proyecto._id}`);
        } else {
            navigate(`/detalle/${proyecto._id}`);
        }
    };

    const handleAddEtiqueta = () => {
        if (busqueda.trim() && !etiquetas.some(e => e.text === busqueda.trim().toLowerCase())) {
            setEtiquetas([
                ...etiquetas,
                { text: busqueda.trim().toLowerCase(), color: getRandomColor() }
            ]);
            setBusqueda("");
        }
    };

    const handleRemoveEtiqueta = (text) => {
        setEtiquetas(etiquetas.filter(et => et.text !== text));
    };


    const eliminarEtiqueta = (etiqueta) => {
        setEtiquetas(etiquetas.filter(e => e !== etiqueta));
    };

    const items = proyectos || [];

    // Filtrar por búsqueda local (solo dentro de esta categoría) ahora con etiquetas incluidas
    const filtrados = items.filter((proyecto) =>
        etiquetas.every(({ text }) => {
            const e = text.toLowerCase();

            return (
                proyecto.nombre.toLowerCase().includes(e) ||
                (proyecto.descripcion && proyecto.descripcion.toLowerCase().includes(e)) ||
                (proyecto.autores && proyecto.autores.toString().toLowerCase().includes(e))
            );
        })
    );

    const getRandomColor = () => {
        const hue = Math.floor(Math.random() * 360);
        return `hsl(${hue}, 70%, 80%)`; // tono pastel
    };



    return (
        <div className="categoria px-4">
            <div className="mb-4 max-w-xl">
                <div className="flex items-center gap-2"> {/* Elimina 'relative' y usa gap */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Buscar en esta categoría..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAddEtiqueta()}
                            className="w-full sm:w-96 lg:w-[300px] pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                    </div>

                    <button
                        onClick={handleAddEtiqueta}
                        className="px-4 py-2 text-sm font-medium bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                        Buscar
                    </button>
                </div>


                {/* Etiquetas */}
                <div className="flex flex-wrap gap-2 mt-3">
                    {etiquetas.map((etiqueta, index) => (
                        <span
                            key={index}
                            className="flex items-center text-sm px-3 py-1 rounded-full"
                            style={{ backgroundColor: etiqueta.color, color: "#333" }}
                        >
                            {etiqueta.text}
                            <button
                                onClick={() => handleRemoveEtiqueta(etiqueta.text)}
                                className="ml-2 text-black/60 hover:text-red-600 font-bold"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>

            </div>

            <h2 className="text-xl font-semibold mb-4">{titulo}</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtrados.length > 0 ? (
                    filtrados.map((proyecto, i) => (
                        <div className="card" key={i}>
                            <div className="card-inner">
                                <div className="card-front">
                                    <img
                                        src={proyecto.imagen}
                                        alt={`Imagen de ${proyecto.nombre}`}
                                        className="w-full h-48 object-cover rounded-lg"
                                    />
                                </div>
                                <div className="card-back p-4 bg-white rounded-lg shadow">
                                    <h3 className="text-lg font-bold">{proyecto.nombre}</h3>
                                    <p>{proyecto.descripcion || "Sin descripción."}</p>
                                    <p className="text-sm"><strong>Materia:</strong> {proyecto.categoria || "Sin materia"}</p>
                                    <p className="text-sm"><strong>Autor:</strong> {proyecto.autores || "No hay autor"}</p>
                                    <button
                                        onClick={() => goToDetalle(proyecto)}
                                        className="mt-2 inline-block bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded"
                                    >
                                        Ver más
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-600">No hay resultados disponibles.</p>
                )}
            </div>
        </div>
    );
};

export default CategoriaProyectos;
