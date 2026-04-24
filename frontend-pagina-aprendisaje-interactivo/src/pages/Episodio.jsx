import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const episodios = [
  {
    id: 1,
    titulo: "Episodio 1",
    descripcion: "Introducción al aprendizaje",
    autor: "Juan Pérez",
    fecha: "15 de marzo de 2024",
    imagen: "/img/pdexample.jpg",
    spotify: "https://open.spotify.com/track/example1",
  },
  {
    id: 2,
    titulo: "Episodio 2",
    descripcion: "Técnicas avanzadas",
    autor: "María Gómez, Pedro Rodríguez",
    fecha: "22 de marzo de 2024",
    imagen: "/img/pdexample.jpg",
    spotify: "https://open.spotify.com/track/example2",
  },
  {
    id: 3,
    titulo: "Episodio 3",
    descripcion: "Casos de éxito",
    autor: "Carlos López",
    fecha: "29 de marzo de 2024",
    imagen: "/img/pdexample.jpg",
    spotify: "https://open.spotify.com/track/example3",
  },
];

const Episodio = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const episodio = episodios.find(ep => ep.id === parseInt(id));

  if (!episodio) {
    return (
      <div>
        <Navbar />
        <div className="max-w-screen-xl mx-auto p-5">
          {/* Contenedor con el mismo estilo que los episodios normales */}
          <div className="flex gap-6 bg-white shadow-md rounded-lg p-6 justify-center items-center">
            <div className="flex-1 text-center">
              <h2 className="text-2xl font-semibold text-gray-700">Episodio no encontrado 😢</h2>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      {/* Contenedor principal */}
      <div className="max-w-screen-xl mx-auto p-5">

        {/* Layout con dos columnas */}
        <div className="flex gap-6 bg-white shadow-md rounded-lg p-6">

          {/* Columna Izquierda */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{episodio.titulo}</h1>
            <img className="w-full max-w-sm rounded-lg mb-4" src={episodio.imagen} alt={episodio.titulo} />
            <a className="inline-block bg-green-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-400 w-95 text-center" href={episodio.spotify} target="_blank" rel="noopener noreferrer">
              🎵 Escuchar en Spotify
            </a>
          </div>

          {/* Columna Derecha */}
          <div className="flex-1">
            <p className="font-semibold text-lg text-gray-700 mb-2">Descripción:</p>
            <p className="text-gray-600 mb-4">{episodio.descripcion}</p>
            <p className="text-sm text-gray-500 mb-2"><strong>Autor(es):</strong> {episodio.autor}</p>
            <p className="text-sm text-gray-500"><strong>Fecha de publicación:</strong> {episodio.fecha}</p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Episodio;
