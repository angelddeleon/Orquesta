const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.js");

//Instrumentos Originales asociados a una partitura
const Instrumento_Original = sequelize.define("instrumento_original", {
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

  //Cantidad de instrumentos originales
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Instrumento_Original.associate = (models) => {
  Instrumento_Original.belongsTo(models.Instrumento, {
    // Usar mismo nombre que en el index
    foreignKey: "id_instrumento",
    as: "instrumento",
  });

  Instrumento_Original.belongsTo(models.Partitura, {
    foreignKey: "id_partitura",
    as: "partitura",
  });
};

module.exports = Instrumento_Original;
