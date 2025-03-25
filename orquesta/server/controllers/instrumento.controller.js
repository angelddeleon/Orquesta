import db from "../config/db.js";

import models from "../models/index.js"; // Ruta correcta a tu index de modelos
const { Instrumento } = models;

export const obtenerInstrumentos = async (_req, res) => {
  try {
    const instrumentos = await Instrumento.findAll();
    res.json(instrumentos);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error en el servidor",
    });
  }
};
