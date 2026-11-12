const {
  conectarBaseDatos,
  cerrarBaseDatos,
} = require("../src/config/base-datos");

async function comprobarConexion() {
  try {
    await conectarBaseDatos();
    console.log("Conexión con MongoDB establecida correctamente.");
  } catch (error) {
    process.exitCode = 1;

    console.error("No se pudo conectar con MongoDB.");

    if (error.message.startsWith("Configuración inválida:")) {
      console.error(error.message);
    }

    if (error.code) {
      console.error("Código del error:", error.code);
    }

    if (error.syscall) {
      console.error("Operación afectada:", error.syscall);
    }

    if (error.name) {
      console.error("Tipo de error:", error.name);
    }

    console.error("Detalle:", error.message);
  } finally {
    try {
      await cerrarBaseDatos();
      console.log("Conexión con MongoDB cerrada correctamente.");
    } catch (error) {
      process.exitCode = 1;

      console.error("No se pudo cerrar la conexión correctamente.");
      console.error("Detalle:", error.message);

      if (error.code) {
        console.error("Código del error:", error.code);
      }
    }
  }
}

comprobarConexion().catch((error) => {
  console.error("Error inesperado:", error.message);
  process.exitCode = 1;
});
