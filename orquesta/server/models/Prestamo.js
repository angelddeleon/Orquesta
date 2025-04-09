import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Prestamo = sequelize.define('Prestamo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  obra: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  caja: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  entrego: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Nombre de la persona que entrega el material'
  },
  recibio: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Nombre de la persona que recibe el material'
  },
  dia: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  hora: {
    type: DataTypes.TIME,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  anterior: {
    type: DataTypes.STRING,
    comment: 'Ubicación anterior del material'
  },
  actual: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Ubicación actual del material'
  },
  observaciones: {
    type: DataTypes.TEXT,
    comment: 'Observaciones adicionales sobre el préstamo'
  },
  estado: {
    type: DataTypes.ENUM('activo', 'devuelto', 'pendiente'),
    defaultValue: 'activo'
  }
}, {
  tableName: 'prestamos',
  timestamps: true, // Habilita createdAt y updatedAt
  paranoid: true, // Habilita deletedAt para borrado lógico
  indexes: [
    {
      fields: ['obra']
    },
    {
      fields: ['caja']
    },
    {
      fields: ['estado']
    }
  ]
});

export default Prestamo;