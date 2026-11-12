const salasPermitidas = ["Sala Norte", "Sala Sur", "Sala Multimedia"];
const turnosPermitidos = ["Mañana", "Tarde", "Noche"];
const estadosPermitidos = ["pendiente", "confirmada"];

function validarPersonas(valor) {
  if (typeof valor !== "number" && typeof valor !== "string") {
    return null;
  }

  if (typeof valor === "string" && !valor.trim()) {
    return null;
  }

  const personas = Number(valor);

  if (
    !Number.isFinite(personas) ||
    !Number.isInteger(personas) ||
    personas < 1 ||
    personas > 6
  ) {
    return null;
  }

  return personas;
}

function validarCuerpo(req, res) {
  if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
    res.status(400).json({
      error: "El cuerpo de la solicitud debe ser un objeto JSON.",
    });

    return false;
  }

  return true;
}

// POST: validar los datos para crear una reserva.
function validarApiReserva(req, res, next) {
  if (!validarCuerpo(req, res)) {
    return;
  }

  const camposTexto = ["estudiante", "email", "sala", "fecha", "turno"];
  const datos = {};

  for (const campo of camposTexto) {
    if (typeof req.body[campo] !== "string" || !req.body[campo].trim()) {
      return res.status(400).json({
        error: `El campo ${campo} es obligatorio y debe ser texto.`,
      });
    }

    datos[campo] = req.body[campo].trim();
  }

  if (!datos.email.includes("@")) {
    return res.status(400).json({
      error: "El email debe contener @.",
    });
  }

  if (!salasPermitidas.includes(datos.sala)) {
    return res.status(400).json({
      error: "La sala seleccionada no es válida.",
    });
  }

  if (!turnosPermitidos.includes(datos.turno)) {
    return res.status(400).json({
      error: "El turno seleccionado no es válido.",
    });
  }

  const personas = validarPersonas(req.body.personas);

  if (personas === null) {
    return res.status(400).json({
      error: "La cantidad de personas debe ser un entero entre 1 y 6.",
    });
  }

  datos.personas = personas;

  req.reservaValidada = datos;

  next();
}

// PUT: reemplazar todos los campos de una reserva.
function validarReemplazoReserva(req, res, next) {
  if (!validarCuerpo(req, res)) {
    return;
  }

  const camposPermitidos = [
    "estudiante",
    "email",
    "sala",
    "fecha",
    "turno",
    "personas",
    "estado",
  ];

  const camposRecibidos = Object.keys(req.body);

  const camposDesconocidos = camposRecibidos.filter(
    (campo) => !camposPermitidos.includes(campo),
  );

  if (camposDesconocidos.length > 0) {
    return res.status(400).json({
      error: "La solicitud contiene campos no permitidos.",
    });
  }

  for (const campo of camposPermitidos) {
    if (!Object.hasOwn(req.body, campo)) {
      return res.status(400).json({
        error: `El campo ${campo} es obligatorio para reemplazar la reserva.`,
      });
    }
  }

  const camposTexto = ["estudiante", "email", "sala", "fecha", "turno"];
  const datos = {};

  for (const campo of camposTexto) {
    if (typeof req.body[campo] !== "string" || !req.body[campo].trim()) {
      return res.status(400).json({
        error: `El campo ${campo} es obligatorio y debe ser texto.`,
      });
    }

    datos[campo] = req.body[campo].trim();
  }

  if (!datos.email.includes("@")) {
    return res.status(400).json({
      error: "El email debe contener @.",
    });
  }

  if (!salasPermitidas.includes(datos.sala)) {
    return res.status(400).json({
      error: "La sala seleccionada no es válida.",
    });
  }

  if (!turnosPermitidos.includes(datos.turno)) {
    return res.status(400).json({
      error: "El turno seleccionado no es válido.",
    });
  }

  const personas = validarPersonas(req.body.personas);

  if (personas === null) {
    return res.status(400).json({
      error: "La cantidad de personas debe ser un entero entre 1 y 6.",
    });
  }

  if (
    typeof req.body.estado !== "string" ||
    !estadosPermitidos.includes(req.body.estado.trim())
  ) {
    return res.status(400).json({
      error: "El estado debe ser pendiente o confirmada.",
    });
  }

  datos.personas = personas;
  datos.estado = req.body.estado.trim();

  req.reservaValidada = datos;

  next();
}

// PATCH: actualizar solamente personas y/o estado.
function validarActualizacionReserva(req, res, next) {
  if (!validarCuerpo(req, res)) {
    return;
  }

  const camposPermitidos = ["personas", "estado"];
  const camposRecibidos = Object.keys(req.body);

  if (camposRecibidos.length === 0) {
    return res.status(400).json({
      error: "Debe indicar al menos un campo para actualizar.",
    });
  }

  const camposDesconocidos = camposRecibidos.filter(
    (campo) => !camposPermitidos.includes(campo),
  );

  if (camposDesconocidos.length > 0) {
    return res.status(400).json({
      error: "Solo se pueden actualizar los campos personas y estado.",
    });
  }

  const cambios = {};

  if (Object.hasOwn(req.body, "personas")) {
    const personas = validarPersonas(req.body.personas);

    if (personas === null) {
      return res.status(400).json({
        error: "La cantidad de personas debe ser un entero entre 1 y 6.",
      });
    }

    cambios.personas = personas;
  }

  if (Object.hasOwn(req.body, "estado")) {
    if (
      typeof req.body.estado !== "string" ||
      !estadosPermitidos.includes(req.body.estado.trim())
    ) {
      return res.status(400).json({
        error: "El estado debe ser pendiente o confirmada.",
      });
    }

    cambios.estado = req.body.estado.trim();
  }

  req.cambiosValidados = cambios;

  next();
}

module.exports = {
  validarApiReserva,
  validarReemplazoReserva,
  validarActualizacionReserva,
};
