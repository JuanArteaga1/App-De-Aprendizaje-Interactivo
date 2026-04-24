import React from "react";
import { useNavigate } from "react-router-dom";

const ListaProyectos = ({ proyectos }) => {
    const navigate = useNavigate();
    const goToDetalle = (proyecto) => {
        navigate(`/detalle/${proyecto}`);
    };

    return (
        <div className="contenido-proyectos">
            <div className="contenedor-ordenamiento-proyectos">
                <div className="categorias">
                    {Object.keys(proyectos).map((categoria) => (
                        <div className="categoria" key={categoria}>
                            <h2>{categoria}</h2>
                            <div className="cards-container">
                                {proyectos[categoria].length > 0 ? (
                                    proyectos[categoria].map((proyecto, index) => (
                                        <div className="card" key={index}>
                                            <div className="card-inner">
                                                <div className="card-front w-full h-full">
                                                    <img src="/img/fotoapp.png" 
                                                    alt={`Imagen de ${proyecto}`} 
                                                    style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "10px" }}/>
                                                </div>
                                                <div className="card-back">
                                                    <h3>{proyecto}</h3>
                                                    <button onClick={() => goToDetalle(proyecto)}>Ver más</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>No hay proyectos disponibles</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ListaProyectos;

