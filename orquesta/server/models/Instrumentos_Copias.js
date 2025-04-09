import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

//Copias de instrumentos asociados a una partitura
const Instrumento_Copia = sequelize.define("instrumento_copia", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  //Relacion con la tabla instrumentos
  id_instrumento: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  //Relacion con la tabla partituras
  id_partitura: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Instrumento_Copia.associate = (models) => {
  Instrumento_Copia.belongsTo(models.Instrumento, {
    // Usar mismo nombre que en el index
    foreignKey: "id_instrumento",
    as: "instrumento",
  });

  Instrumento_Copia.belongsTo(models.Partitura, {
    foreignKey: "id_partitura",
    as: "partitura",
  });
};
export default Instrumento_Copia;
