const { PORT } = require("./config/entorno");
const { conectarBaseDatos, cerrarBaseDatos } = require("./config/base-datos");
const app = require("./app");

async function iniciar() {
  try {
    await conectarBaseDatos();

    const servidor = app.listen(PORT, () => {
      console.log(`Aplicación disponible en http://localhost:${PORT}`);
    });

    async function cerrarServidor() {
      servidor.close(async () => {
        try {
          await cerrarBaseDatos();
          process.exit(0);
        } catch {
          console.error("Error al cerrar la conexión con MongoDB.");
          process.exit(1);
        }
      });
    }

    process.on("SIGINT", cerrarServidor);
    process.on("SIGTERM", cerrarServidor);
  } catch (error) {
    console.error(
      "No se pudo iniciar la aplicación. Verificá la conexión con MongoDB.",
    );
    console.error(error.message);
    await cerrarBaseDatos().catch(() => {});
    process.exitCode = 1;
  }
}

iniciar();
