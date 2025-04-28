const db = require("../config/db.js");
const models = require("../models/index.js"); // Ruta correcta a tu index de modelos
const { Instrumento } = models;

const obtenerInstrumentos = async (_req, res) => {
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

module.exports = {
  obtenerInstrumentos
};
