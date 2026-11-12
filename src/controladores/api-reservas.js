const servicioReservas = require("../servicios/reservas");

function validarId(id) {
  return /^[a-fA-F0-9]{24}$/.test(id);
}

const listarReservas = async (req, res, next) => {
  try {
    const { sala } = req.query;

    if (sala !== undefined && typeof sala !== "string") {
      return res.status(400).json({
        error: "El parámetro sala debe enviarse una sola vez y como texto.",
      });
    }

    const filtros = {};

    if (sala !== undefined) {
      filtros.sala = sala;
    }

    const reservas = await servicioReservas.obtenerTodas(filtros);

    res.json(reservas);
  } catch (error) {
    next(error);
  }
};

const obtenerReserva = async (req, res, next) => {
  try {
    const id = req.params.id;

    if (!validarId(id)) {
      return res.status(400).json({
        error: "El identificador de la reserva no tiene un formato válido.",
      });
    }

    const reserva = await servicioReservas.obtenerPorId(id);

    if (!reserva) {
      return res.status(404).json({
        error: "La reserva solicitada no existe.",
      });
    }

    res.json(reserva);
  } catch (error) {
    next(error);
  }
};

const crearReserva = async (req, res, next) => {
  try {
    const nuevaReserva = await servicioReservas.crear(req.reservaValidada);

    res
      .location(`/api/reservas/${nuevaReserva.id}`)
      .status(201)
      .json(nuevaReserva);
  } catch (error) {
    next(error);
  }
};

const reemplazarReserva = async (req, res, next) => {
  try {
    const id = req.params.id;

    if (!validarId(id)) {
      return res.status(400).json({
        error: "El identificador de la reserva no tiene un formato válido.",
      });
    }

    const reserva = await servicioReservas.reemplazar(id, req.reservaValidada);

    if (!reserva) {
      return res.status(404).json({
        error: "La reserva solicitada no existe.",
      });
    }

    res.json(reserva);
  } catch (error) {
    next(error);
  }
};

const actualizarReserva = async (req, res, next) => {
  try {
    const id = req.params.id;

    if (!validarId(id)) {
      return res.status(400).json({
        error: "El identificador de la reserva no tiene un formato válido.",
      });
    }

    const reserva = await servicioReservas.actualizar(id, req.cambiosValidados);

    if (!reserva) {
      return res.status(404).json({
        error: "La reserva solicitada no existe.",
      });
    }

    res.json(reserva);
  } catch (error) {
    next(error);
  }
};

const eliminarReserva = async (req, res, next) => {
  try {
    const id = req.params.id;

    if (!validarId(id)) {
      return res.status(400).json({
        error: "El identificador de la reserva no tiene un formato válido.",
      });
    }

    const eliminado = await servicioReservas.eliminar(id);

    if (!eliminado) {
      return res.status(404).json({
        error: "La reserva solicitada no existe.",
      });
    }

    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listarReservas,
  obtenerReserva,
  crearReserva,
  reemplazarReserva,
  actualizarReserva,
  eliminarReserva,
};
