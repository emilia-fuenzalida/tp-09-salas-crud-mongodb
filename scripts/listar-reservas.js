const {
  conectarBaseDatos,
  cerrarBaseDatos,
} = require("../src/config/base-datos");
const Reserva = require("../src/modelos/reserva");

async function listarReservas() {
  try {
    await conectarBaseDatos();

    const reservas = await Reserva.find();
    if (reservas.length === 0) {
      console.log("No hay reservas registradas.");
    } else {
      console.log("Reservas registradas:");

      for (const reserva of reservas) {
        console.log("------------------------------");
        console.log(`ID: ${reserva._id}`);
        console.log(`Estudiante: ${reserva.estudiante}`);
        console.log(`Email: ${reserva.email}`);
        console.log(`Sala: ${reserva.sala}`);
        console.log(`Fecha: ${reserva.fecha}`);
        console.log(`Turno: ${reserva.turno}`);
        console.log(`Personas: ${reserva.personas}`);
        console.log(`Estado: ${reserva.estado}`);
      }
    }
    console.log(`Total de reservas: ${reservas.length}`);
  } catch (error) {
    console.error("No se pudieron listar las reservas.");
    console.error("Detalle:", error.message);
    process.exitCode = 1;
  } finally {
    try {
      await cerrarBaseDatos();
      console.log("Conexión con MongoDB cerrada correctamente.");
    } catch (error) {
      console.error("No se pudo cerrar la conexión correctamente.");
      console.error("Detalle:", error.message);
      process.exitCode = 1;
    }
  }
}
listarReservas();
