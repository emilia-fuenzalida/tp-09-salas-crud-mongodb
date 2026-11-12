const servicioReservas = require("../servicios/reservas");

const listarReservas = async (req, res, next) => {
  try {
    const reservas = await servicioReservas.obtenerTodas();

    res.render("reservas/lista", {
      title: "Reservas",
      reservas,
    });
  } catch (error) {
    next(error);
  }
};

const mostrarFormulario = (req, res) => {
  res.render("reservas/nueva", {
    title: "Nueva reserva",
    error: null,
    valores: {},
  });
};

const mostrarDetalle = async (req, res, next) => {
  try {
    const reserva = await servicioReservas.obtenerPorId(req.params.id);

    if (!reserva) {
      return res.status(404).render("no-encontrado", {
        titulo: "Reserva no encontrada",
        mensaje: "La reserva solicitada no existe.",
      });
    }

    res.render("reservas/detalle", {
      title: "Detalle de reserva",
      reserva,
    });
  } catch (error) {
    next(error);
  }
};

const crearReserva = async (req, res, next) => {
  try {
    await servicioReservas.crear(req.reservaValidada);

    res.redirect("/reservas");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listarReservas,
  mostrarFormulario,
  mostrarDetalle,
  crearReserva,
};
