require('dotenv').config();
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require('cors');
const path = require('path');

const Rusuarios = require("./routes/UsuariosRoutes.js");
const Rpodcast = require('./routes/PodtcasRoutes.js');
const RCategoria = require('./routes/CategoriaRoutes.js');
const RInvestigacion = require('./routes/InvestigacionRoutes.js');
const RRol = require('./routes/RolRoutes.js');
const RPersona = require('./routes/PersonaRoutes.js');
const RProyectos = require('./routes/ProyectosRoute.js');
const Rlogin = require('./routes/LoginRoutes.js');
const Rfuncion = require('./routes/FuncionRoutes.js');
const RMateria = require('./routes/MateriaRoutes.js');
const RSimulaciones = require('./routes/SimulacionesRoutes.js');
const RTraerProyectos = require('./routes/TraerProyectosRoutes.js')

const app = express();
app.use(cors({
  origin: process.env.RUTA_CONECCION_EXTERNA, // o '*', pero es mejor ser específico
  credentials: true, // si usas cookies o auth basada en sesiones
}));

// Hacemos que los archivos dentro de la carpeta 'uploads' sean accesibles públicamente desde la ruta '/uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));

app.use("/Usuarios", Rusuarios);
app.use("/podcast", Rpodcast);
app.use("/Categorias", RCategoria);
app.use("/Investigacion", RInvestigacion);
app.use("/Proyectos", RProyectos);
app.use("/login", Rlogin);
app.use("/Funcion", Rfuncion);
app.use("/Materia", RMateria);
app.use("/Simulaciones", RSimulaciones);
app.use("/TraerProyectos", RTraerProyectos);
app.use("/Roles", RRol);
app.use("/Personas", RPersona);

// Exportación
module.exports = app;
