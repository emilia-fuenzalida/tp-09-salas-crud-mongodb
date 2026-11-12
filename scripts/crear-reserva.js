const {
  conectarBaseDatos,
  cerrarBaseDatos,
} = require("../src/config/base-datos");
const Reserva = require("../src/modelos/reserva");

async function crearReserva() {
  try {
    await conectarBaseDatos();

    const reserva = new Reserva({
      estudiante: "Lucía Fernández",
      email: "lucia.fernandez@example.com",
      sala: "Sala Norte",
      fecha: "2026-11-05",
      turno: "Mañana",
      personas: 3,
    });

    const reservaGuardada = await reserva.save();

    console.log("Reserva guardada correctamente.");
    console.log(`ID de la reserva: ${reservaGuardada._id}`);
  } catch (error) {
    console.error("No se pudo crear la reserva.");

    if (error.name === "ValidationError") {
      console.error("Error de validación:", error.message);
    } else {
      console.error("Detalle:", error.message);
    }

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

crearReserva();
