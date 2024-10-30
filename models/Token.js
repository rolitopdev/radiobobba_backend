// models/Token.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User'); // Importa el modelo de Usuario para la relación

const Token = sequelize.define('Token', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
    onDelete: 'CASCADE', // Elimina el token si el usuario es eliminado
  }
}, {
  tableName: 'tokens',
  timestamps: true, // para `createdAt` y `updatedAt`
});

User.hasMany(Token, { foreignKey: 'userId' });
Token.belongsTo(User, { foreignKey: 'userId' });

module.exports = Token;
