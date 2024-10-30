// models/UserRole.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserRole = sequelize.define('UserRole', {
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'users', // Nombre de la tabla de usuarios
            key: 'id'
        },
        onDelete: 'CASCADE',
        allowNull: false,
    },
    roleId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'roles', // Nombre de la tabla de roles
            key: 'id'
        },
        onDelete: 'CASCADE',
        allowNull: false,
    },
}, {
    tableName: 'user_roles',
    timestamps: false,
});

module.exports = UserRole;
