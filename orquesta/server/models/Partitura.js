const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.js");

const Partitura = sequelize.define("partitura", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  obra: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  archivista: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  caja: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sede: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  compositor: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  arreglista: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  orquestacion: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  formato: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  categoria: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  score: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  observaciones: {
    type: DataTypes.TEXT, // Cambiado de STRING a TEXT para permitir más caracteres
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

Partitura.associate = (models) => {
  Partitura.hasMany(models.Instrumento_Original, {
    foreignKey: "id_partitura",
    as: "instrumentos_originales",
  });

  Partitura.hasMany(models.Instrumento_Copia, {
    foreignKey: "id_partitura",
    as: "instrumentos_copias",
  });
};

module.exports = Partitura;