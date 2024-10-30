// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Role = require('./Role'); // Asegúrate de importar el modelo Role

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  habboName: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  birthDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  role: {
    type: DataTypes.INTEGER, // Cambia el tipo a INTEGER para relacionar con Role
    allowNull: false,
    references: {
      model: Role,
      key: 'id'
    }
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  ip: {
    type: DataTypes.STRING,
    allowNull: true
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'users',
  timestamps: false,
});

// Establecer la relación
User.belongsTo(Role, { foreignKey: 'role', targetKey: 'id' }); // Establece que User pertenece a Role

module.exports = User;
