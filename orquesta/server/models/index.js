const sequelize = require("../config/db.js");
const Partitura = require("./Partitura.js");
const Instrumento = require("./Instrumentos.js"); // Nombre en singular
const Instrumento_Original = require("./Instrumentos_Originales.js");
const Instrumento_Copia = require("./Instrumentos_Copias.js");
const Prestamo = require("./Prestamo.js");

// Configurar asociaciones
const setupAssociations = () => {
  // Asociaciones de Partitura
  Partitura.associate({
    Instrumento_Original,
    Instrumento_Copia,
    Instrumento
  });

  // Asociaciones de Instrumento
  Instrumento.associate({
    Instrumento_Original,
    Instrumento_Copia,
    Partitura
  });

  // Asociaciones de Instrumento_Original
  Instrumento_Original.associate({
    Partitura,
    Instrumento
  });

  // Asociaciones de Instrumento_Copia
  Instrumento_Copia.associate({
    Partitura,
    Instrumento
  });
};

setupAssociations();

const models = {
  Partitura,
  Instrumento, // Clave en singular
  Instrumento_Original,
  Instrumento_Copia,
  Prestamo
};

module.exports = models;