function manejarErrores(error, req, res, next) {
  // Evitar que Express intente responder nuevamente.
  if (res.headersSent) {
    return next(error);
  }

  const esApi = req.originalUrl.startsWith("/api/");

  // Detectar JSON mal formado.
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    if (esApi) {
      return res.status(400).json({
        error: "El cuerpo de la solicitud contiene JSON inválido.",
      });
    }

    return res.status(400).render("no-encontrado", {
      titulo: "Solicitud inválida",
      mensaje: "Los datos enviados no tienen un formato válido.",
    });
  }

  if (esApi) {
    return res.status(500).json({
      error: "Ocurrió un error interno del servidor.",
    });
  }

  return res.status(500).render("no-encontrado", {
    titulo: "Error del servidor",
    mensaje:
      "Ocurrió un problema al procesar la solicitud. Intentá nuevamente.",
  });
}

module.exports = manejarErrores;
