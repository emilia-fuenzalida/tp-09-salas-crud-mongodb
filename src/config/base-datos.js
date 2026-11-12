const dns = require("node:dns");
const mongoose = require("mongoose");
const { MONGODB_URI } = require("./entorno");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

async function conectarBaseDatos() {
  if (!MONGODB_URI || !/^mongodb(\+srv)?:\/\//.test(MONGODB_URI)) {
    throw new Error(
      "Configuración inválida: MONGODB_URI está vacía o tiene un prefijo incorrecto.",
    );
  }

  await mongoose.connect(MONGODB_URI, {
    dbName: "reservas_salas_u9",
  });

  return mongoose.connection;
}

async function cerrarBaseDatos() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}

module.exports = {
  conectarBaseDatos,
  cerrarBaseDatos,
};
