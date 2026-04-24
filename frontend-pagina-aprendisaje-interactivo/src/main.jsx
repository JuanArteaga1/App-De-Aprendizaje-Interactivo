import React from "react";
import ReactDOM from "react-dom/client";
import { Outlet } from 'react-router-dom';
import { BrowserRouter, Routes, Route, Router } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Simulaciones from "./pages/Simulaciones";
import Podcast from "./pages/Podcast";
import Appmovil from "./pages/Appmovil"
import Investigaciones from "./pages/Investigaciones";
import Subirsimulaciones from "./pages/subir_Simulaciones";
import "./index.css";
import SubirInvestigaciones from "./pages/SubirInvestigaciones";
import MenuAdmin from "./pages/MenuAdmin";
import MenuDocen from "./pages/MenuDocen";
import SubirDocente from "./pages/SubirDocente";
import { LoginProvider } from "./context/LoginContext"
import SubirProyecto from "./pages/SubirProyecto";
import SubirPodcast from "./pages/SubirPodcast";
import NuevaCategoria from "./pages/NuevaCategoria";
import MisProyectos from "./pages/MisProyectos";
import AdministrarDocentes from "./pages/AdministracionDocente";
import MirarProyectos from "./pages/VerProyectos";
import ProyectosPorAprobar from "./pages/ProyectosAprobar";
import RegistrarDocente from "./pages/registroDocente";
import Fisica from "./pages/Fisica";
import IngCivil from "./pages/IngCivil";
import Matematicas from "./pages/Matematicas";
import DetalleProyecto from "./pages/DetalleProyecto";
import DetalleSimulacion from "./pages/DetalleSimulacion";
import ActualizarProyecto from "./pages/ActualizarProyectos";
import Episodio from "./pages/Episodio";
import AyudaT from "./pages/Ayuda";
import InvestigacionDetalle from "./pages/InvestigacionDetalle";
import QuienesSomos from "./pages/quienes-somos";
import { DocenteProvider } from "./context/DocenteContext"
import { ProyectosProvider } from "./context/ProyectoContext"
import { PodcastProvider } from "./context/PodcastContext";
import { InvestigacionProvider } from "./context/InvestigacionContext";
import { CategoriaProvider } from "./context/CategoriaContext";
import { TraerProyectosProvider } from "./context/TraerProyectos";
import { SimulacionesProvider } from "./context/SimulacionesContex";
import { RegistroProvider } from "./context/RegristroContext";
import { MateriaProvider } from "./context/MateriaContext";

import ProtectedRote from "./ProtectedRoute";
import EditarProyecto from "./pages/EditarProyecto";
import EditarPodcast from "./pages/EditarPodcast";
import EditarInvestigacion from "./pages/EditarInvestigacion";
import EditarSimulaciones from "./pages/EditarSimulaciones";
import EditarDocente from "./pages/EditarDocente";

import Resultados from "./pages/Resultados";
import ListaCategorias from "./pages/ListaCategorias";

import NuevaMateria from "./pages/NuevaMateria";
import ListaMaterias from "./pages/ListaMaterias";

import Comentarios from "./pages/Comentarios";

ReactDOM.createRoot(document.getElementById("root")).render(
  <LoginProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/resultados" element={
          <InvestigacionProvider>
            <PodcastProvider>
              <SimulacionesProvider>
                <ProyectosProvider>
                  <Resultados />
                </ProyectosProvider>
              </SimulacionesProvider>
            </PodcastProvider>
          </InvestigacionProvider>
        }
        />

      //Rutas sin autenticacion
        //ruta registro de docente
        <Route path="/registro-docente/:token" element={<RegistroProvider><DocenteProvider><RegistrarDocente /></DocenteProvider></RegistroProvider>} />
        //rutas de estudiante y visualizacion
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/simulaciones" element={<SimulacionesProvider><Simulaciones /></SimulacionesProvider>} />
        <Route path="/podcast" element={<PodcastProvider><Podcast /></PodcastProvider>} />
        <Route path="/appmovil" element={<ProyectosProvider><Appmovil /></ProyectosProvider>} />
        <Route path="/investigaciones" element={<InvestigacionProvider><Investigaciones /></InvestigacionProvider>} />
        <Route path="/ayuda" element={<AyudaT />} />
        <Route path="/quienes-somos" element={<QuienesSomos />} />
      //Rutas de las categorias de HOME
        <Route path="/Fisica" element={<SimulacionesProvider> <ProyectosProvider><Fisica /></ProyectosProvider> </SimulacionesProvider>} />
        <Route path="/IngCivil" element={<SimulacionesProvider> <ProyectosProvider><IngCivil /></ProyectosProvider> </SimulacionesProvider>} />
        <Route path="/Matematicas" element={<SimulacionesProvider> <ProyectosProvider><Matematicas /></ProyectosProvider> </SimulacionesProvider>} />
        <Route path="/detalle/:id" element={<ProyectosProvider><DetalleProyecto /></ProyectosProvider>} />
        <Route path="/detalle-simulacion/:id" element={<SimulacionesProvider><DetalleSimulacion /></SimulacionesProvider>} />
        <Route path="/investigaciones/:id" element={<InvestigacionProvider><InvestigacionDetalle /></InvestigacionProvider>} />

        <Route path="/episodio/:id" element={<Episodio />} />


      //Rutas con autenticacion
        <Route element={<ProtectedRote />}>

          {/* rutas de Administrador */}
          <Route path="/menuadministrador" element={<MenuAdmin />} />
          <Route path="/categorias" element={<ListaCategorias />} />
          <Route path="/SubirCategoria" element={<CategoriaProvider><NuevaCategoria /></CategoriaProvider>} />

          {/* --- NUEVAS RUTAS DE MATERIAS --- */}
          <Route path="/materias" element={<MateriaProvider><ListaMaterias /></MateriaProvider>} />
          <Route path="/SubirMateria" element={<MateriaProvider><NuevaMateria /></MateriaProvider>} />

          <Route path="/VerProyectos" element={
            <ProyectosProvider>
              <PodcastProvider>
                <InvestigacionProvider>
                  <SimulacionesProvider>
                    <TraerProyectosProvider><MirarProyectos /></TraerProyectosProvider>
                  </SimulacionesProvider>
                </InvestigacionProvider>
              </PodcastProvider>
            </ProyectosProvider>
          } />

          <Route path="/Aprobar" element={<ProyectosPorAprobar />} />
          <Route path="/AdministrarDocente" element={<DocenteProvider><AdministrarDocentes /></DocenteProvider>} />

          {/* ⭐⭐⭐ AQUI VA LA RUTA DE COMENTARIOS ⭐⭐⭐ */}
          <Route
            path="/comentarios"
            element={
              <ProyectosProvider>
                <Comentarios />
              </ProyectosProvider>
            }
          />
          {/* ⭐⭐⭐ FIN DE LA RUTA DE COMENTARIOS ⭐⭐⭐ */}

          {/* rutas de docentes */}
          <Route element={<><CategoriaProvider><Outlet /></CategoriaProvider></>}>

            <Route path="/menudocente" element={<MenuDocen />} />

            <Route path="/subir-proyecto" element={<ProyectosProvider><SubirProyecto /></ProyectosProvider>} />

            <Route path="/misproyectos" element={
              <SimulacionesProvider>
                <InvestigacionProvider>
                  <PodcastProvider>
                    <ProyectosProvider>
                      <TraerProyectosProvider>
                        <MisProyectos />
                      </TraerProyectosProvider>
                    </ProyectosProvider>
                  </PodcastProvider>
                </InvestigacionProvider>
              </SimulacionesProvider>
            } />

            <Route path="/actualizar-proyectos" element={<ActualizarProyecto />} />
            <Route path="/subirsimulaciones" element={<SimulacionesProvider><Subirsimulaciones /></SimulacionesProvider>} />
            <Route path="/SubirInvestigaciones" element={<InvestigacionProvider><SubirInvestigaciones /></InvestigacionProvider>} />
            <Route path="/SubirDocente" element={<RegistroProvider><SubirDocente /></RegistroProvider>} />
            <Route path="/subir-podcast" element={<PodcastProvider><SubirPodcast /></PodcastProvider>} />

            {/* rutas para editar */}
            <Route path="/editar-proyecto/:id" element={<ProyectosProvider><EditarProyecto /></ProyectosProvider>} />
            <Route path="/editar-podcast/:id" element={<PodcastProvider><EditarPodcast /></PodcastProvider>} />
            <Route path="/editar-investigacion/:id" element={<InvestigacionProvider><EditarInvestigacion /></InvestigacionProvider>} />
            <Route path="/editar-simulacion/:id" element={<SimulacionesProvider><EditarSimulaciones /></SimulacionesProvider>} />
            <Route path="/editar-docente/:id" element={<DocenteProvider><EditarDocente /></DocenteProvider>} />

          </Route>
        </Route>


      </Routes>
    </BrowserRouter>
  </LoginProvider>
);