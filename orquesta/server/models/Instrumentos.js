const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.js");

//Instrumentos que se pueden utilizar en el sistema
const Instrumento = sequelize.define("instrumento", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Instrumento.associate = (models) => {
//   Instrumento.hasMany(models.Instrumento_Original, {
//     foreignKey: "id_instrumento",
//     as: "partituras_originales",
//   });
// };

// Instrumento.associate = (models) => {
//   Instrumento.hasMany(models.Instrumento_Copia, {
//     foreignKey: "id_instrumento",
//     as: "partituras_copias",
//   });
// };
Instrumento.associate = (models) => {
  Instrumento.hasMany(models.Instrumento_Original, {
    foreignKey: "id_instrumento",
    as: "partituras_originales",
  });

  Instrumento.hasMany(models.Instrumento_Copia, {
    foreignKey: "id_instrumento",
    as: "partituras_copias",
  });
};

module.exports = Instrumento;
