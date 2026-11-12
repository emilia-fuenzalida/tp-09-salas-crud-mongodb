const express = require("express");

const {
  validarApiReserva,
  validarReemplazoReserva,
  validarActualizacionReserva,
} = require("../middleware/validar-api-reserva");

const {
  listarReservas,
  obtenerReserva,
  crearReserva,
  reemplazarReserva,
  actualizarReserva,
  eliminarReserva,
} = require("../controladores/api-reservas");

const apiReservasRouter = express.Router();

apiReservasRouter.get("/", listarReservas);
apiReservasRouter.get("/:id", obtenerReserva);
apiReservasRouter.post("/", validarApiReserva, crearReserva);
apiReservasRouter.put("/:id", validarReemplazoReserva, reemplazarReserva);
apiReservasRouter.patch("/:id", validarActualizacionReserva, actualizarReserva);
apiReservasRouter.delete("/:id", eliminarReserva);

module.exports = apiReservasRouter;
