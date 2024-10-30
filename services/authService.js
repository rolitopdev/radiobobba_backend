// services/authService.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.generateToken = (user) => {
    return jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '2d' }
    );
};