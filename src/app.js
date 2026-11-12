const path = require("node:path");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const morgan = require("morgan");
const servicioReservas = require("./servicios/reservas");
const manejarErrores = require("./middleware/errores");
const apiReservasRouter = require("./rutas/api-reservas");
const reservasRouter = require("./rutas/reservas");

const { NODE_ENV } = require("./config/entorno");

const {
  identificarSolicitud,
  medirDuracion,
} = require("./middleware/solicitudes");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "..", "views"));
app.set("layout", "layouts/main");

app.use(morgan(NODE_ENV === "production" ? "combined" : "dev"));

app.use(identificarSolicitud);
app.use(medirDuracion);

app.use(expressLayouts);

app.use(express.static(path.join(__dirname, "..", "public")));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.render("inicio", {
    title: "Inicio",
  });
});

app.get("/estado", async (req, res, next) => {
  try {
    const cantidadReservas = await servicioReservas.contar();

    res.json({
      servicio: "activo",
      reservas: cantidadReservas,
      solicitudId: res.locals.solicitudId,
    });
  } catch (error) {
    next(error);
  }
});

app.use("/reservas", reservasRouter);
app.use("/api/reservas", apiReservasRouter);

app.use("/api", (req, res) => {
  res.status(404).json({
    error: "Ruta de API no encontrada.",
  });
});

app.use((req, res) => {
  res.status(404).render("no-encontrado", {
    titulo: "Página no encontrada",
    mensaje: "La dirección solicitada no existe.",
  });
});

app.use((req, res) => {
  res.status(404).render("no-encontrado", {
    titulo: "Página no encontrada",
    mensaje: "La dirección solicitada no existe.",
  });
});

app.use(manejarErrores);

module.exports = app;
