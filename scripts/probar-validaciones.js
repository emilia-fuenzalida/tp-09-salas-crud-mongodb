const mongoose = require("mongoose");
const Reserva = require("../src/modelos/reserva");

async function probarValidaciones() {
  const casos = [
    {
      nombre: "Reserva válida",
      datos: {
        estudiante: "Lucía Fernández",
        email: "lucia.fernandez@example.com",
        sala: "Sala Norte",
        fecha: "2026-11-05",
        turno: "Mañana",
        personas: 3,
      },
      esperado: true,
    },

    {
      nombre: "Estudiante obligatorio",
      datos: {
        email: "lucia@example.com",
        sala: "Sala Norte",
        fecha: "2026-11-05",
        turno: "Mañana",
        personas: 3,
      },
      esperado: false,
    },

    {
      nombre: "Email sin arroba",
      datos: {
        estudiante: "Lucía Fernández",
        email: "lucia.example.com",
        sala: "Sala Norte",
        fecha: "2026-11-05",
        turno: "Mañana",
        personas: 3,
      },
      esperado: false,
    },
    {
      nombre: "Sala no permitida",
      datos: {
        estudiante: "Lucía Fernández",
        email: "lucia@example.com",
        sala: "Sala Este",
        fecha: "2026-11-05",
        turno: "Mañana",
        personas: 3,
      },
      esperado: false,
    },
    {
      nombre: "Turno no permitido",
      datos: {
        estudiante: "Lucía Fernández",
        email: "lucia@example.com",
        sala: "Sala Norte",
        fecha: "2026-11-05",
        turno: "Madrugada",
        personas: 3,
      },
      esperado: false,
    },
    {
      nombre: "Personas igual a 0",
      datos: {
        estudiante: "Lucía Fernández",
        email: "lucia@example.com",
        sala: "Sala Norte",
        fecha: "2026-11-05",
        turno: "Mañana",
        personas: 0,
      },
      esperado: false,
    },
    {
      nombre: "Personas igual a 7",
      datos: {
        estudiante: "Lucía Fernández",
        email: "lucia@example.com",
        sala: "Sala Norte",
        fecha: "2026-11-05",
        turno: "Mañana",
        personas: 7,
      },
      esperado: false,
    },
    {
      nombre: "Personas decimal",
      datos: {
        estudiante: "Lucía Fernández",
        email: "lucia@example.com",
        sala: "Sala Norte",
        fecha: "2026-11-05",
        turno: "Mañana",
        personas: 2.5,
      },
      esperado: false,
    },
    {
      nombre: "Personas con texto",
      datos: {
        estudiante: "Lucía Fernández",
        email: "lucia.fernandez@example.com",
        sala: "Sala Norte",
        fecha: "2026-11-05",
        turno: "Mañana",
        personas: "abc",
      },
      esperado: false,
    },
    {
      nombre: "Fecha obligatoria",
      datos: {
        estudiante: "Lucía Fernández",
        email: "lucia@example.com",
        sala: "Sala Norte",
        turno: "Mañana",
        personas: 3,
      },
      esperado: false,
    },
  ];

  let errores = 0;

  for (const caso of casos) {
    const reserva = new Reserva(caso.datos);

    try {
      await reserva.validate();

      if (caso.esperado) {
        console.log(`CORRECTO: ${caso.nombre}`);
      } else {
        errores++;
        console.error(`ERROR: ${caso.nombre} debía rechazarse.`);
      }
    } catch (error) {
      if (!caso.esperado && error instanceof mongoose.Error.ValidationError) {
        console.log(`CORRECTO: ${caso.nombre} fue rechazado.`);
      } else {
        errores++;
        console.error(`ERROR en ${caso.nombre}:`, error.message);
      }
    }
  }

  console.log(`Pruebas fallidas: ${errores} de ${casos.length}`);

  if (errores > 0) {
    process.exitCode = 1;
  }
}

probarValidaciones();
