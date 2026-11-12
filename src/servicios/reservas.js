const Reserva = require("../modelos/reserva");

const salasPermitidas = ["Sala Norte", "Sala Sur", "Sala Multimedia"];

function convertirReserva(reserva) {
  if (!reserva) {
    return null;
  }

  return {
    id: reserva._id.toString(),
    estudiante: reserva.estudiante,
    email: reserva.email,
    sala: reserva.sala,
    fecha: reserva.fecha,
    turno: reserva.turno,
    personas: reserva.personas,
    estado: reserva.estado,
  };
}

async function obtenerTodas(filtros = {}) {
  const reservas = await Reserva.find(filtros).lean();

  return reservas.map(convertirReserva);
}

async function obtenerPorId(id) {
  const reserva = await Reserva.findById(id).lean();

  return convertirReserva(reserva);
}

async function contar() {
  return Reserva.countDocuments();
}

async function crear(datos) {
  const nuevaReserva = await Reserva.create(datos);

  return convertirReserva(nuevaReserva);
}

async function reemplazar(id, datos) {
  const reemplazo = {
    estudiante: datos.estudiante,
    email: datos.email,
    sala: datos.sala,
    fecha: datos.fecha,
    turno: datos.turno,
    personas: datos.personas,
    estado: datos.estado,
  };

  const reserva = await Reserva.findOneAndReplace({ _id: id }, reemplazo, {
    runValidators: true,
    returnDocument: "after",
    upsert: false,
  });

  return convertirReserva(reserva);
}

async function actualizar(id, datos) {
  const cambios = {};

  for (const campo of ["personas", "estado"]) {
    if (Object.hasOwn(datos, campo)) {
      cambios[campo] = datos[campo];
    }
  }

  if (Object.keys(cambios).length === 0) {
    const error = new Error("No se recibieron campos para actualizar.");
    error.codigo = "ENTRADA_INVALIDA";
    throw error;
  }

  const reserva = await Reserva.findOneAndUpdate(
    { _id: id },
    { $set: cambios },
    {
      runValidators: true,
      returnDocument: "after",
      upsert: false,
    },
  );

  return convertirReserva(reserva);
}

async function eliminar(id) {
  const resultado = await Reserva.deleteOne({ _id: id });

  return resultado.deletedCount === 1;
}

function obtenerSalasPermitidas() {
  return salasPermitidas;
}

module.exports = {
  obtenerTodas,
  obtenerPorId,
  contar,
  crear,
  reemplazar,
  actualizar,
  eliminar,
  obtenerSalasPermitidas,
};
