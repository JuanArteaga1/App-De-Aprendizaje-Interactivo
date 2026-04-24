import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Fisica from "./pages/Fisica";
import IngCivil from "./pages/IngCivil";
import Matematicas from "./pages/Matematicas";
import Simulaciones from "./Simulaciones";
import Visualizacion from "./Visualizacion";
import DetalleProyecto from "./pages/DetalleProyecto";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/simulaciones" element={<Simulaciones />} />
        <Route path="/simulacion/:simulacion" element={<Visualizacion />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Fisica" element={<Fisica />} />
        <Route path="/IngCivil" element={<IngCivil />} />
        <Route path="/Matematicas" element={<Matematicas />} />
        <Route path="/detalle/:proyecto" element={<DetalleProyecto />} />
      </Routes>
    </Router>
  );
}