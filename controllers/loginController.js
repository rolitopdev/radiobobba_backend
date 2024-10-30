// controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Token = require('../models/Token');
const User = require('../models/User');

const loginUser = async (req, res) => {

    const { habboName, password } = req.body;

    if (habboName && password) {

        const user = await User.findOne({ where: { habboName } });

        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Verificar la contraseña
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Generar el token y almacenarlo
        const tokenValue = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '2d' });
        const expiresAt = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);

        await Token.create({
            token: tokenValue,
            expiresAt,
            userId: user.id,
        });

        // Obtener los datos del usuario
        const userData = user.get();

        // Eliminar la contraseña del objeto userData
        delete userData.password;

        res.json({ user: userData, token: tokenValue, expiresAt });

    } else {
        res.status(500).json({ message: 'Error al intentar loguearse.', error: 'No params' });
    }

};

// Validar token de la sesión
const validateToken = async (req, res) => {
    const { token } = req.body;

    const storedToken = await Token.findOne({ where: { token } });

    if (!storedToken) {
        return res.status(401).json({ message: 'Token not found or invalid' });
    }

    // Validar si el token ha expirado
    const isTokenExpired = storedToken.expiresAt < new Date();

    if (isTokenExpired) {
        return res.status(401).json({ message: 'Token expired' });
    }

    res.json({ message: 'Token is valid' });
};

module.exports = { loginUser, validateToken };
