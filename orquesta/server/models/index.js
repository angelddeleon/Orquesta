import sequelize from "../config/db.js";
import Partitura from "./Partitura.js";
import Instrumento from "./Instrumentos.js"; // Nombre en singular
import Instrumento_Original from "./Instrumentos_Originales.js";
import Instrumento_Copia from "./Instrumentos_Copias.js";
import Prestamo from "./Prestamo.js";

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

export default models;