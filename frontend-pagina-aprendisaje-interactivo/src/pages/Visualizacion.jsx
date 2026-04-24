import React from "react";
import { useParams } from "react-router-dom";

const Visualizacion = () => {
  // Obtener el parámetro 'simulacion' de la URL
  const { simulacion } = useParams();

  return (
    <div>
      <h1>Detalles de {simulacion}</h1>
      {/* Aquí puedes agregar más detalles de la simulación */}
    </div>
  );
};

export default Visualizacion;