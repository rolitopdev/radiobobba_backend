// controllers/userController.js
const User = require('../models/User');
const Role = require('../models/Role');
const bcrypt = require('bcrypt'); // Importa bcrypt

// Crear un nuevo usuario
const createUser = async (req, res) => {
  try {
    const { name, habboName, email, password, birthDate, roles, location } = req.body; // Cambiar 'role' a 'roles'

    if (!habboName || !email || !password || !roles || !birthDate) {
      return res.status(400).json({ message: 'Parámetros no enviados' });
    }

    // Encriptar la contraseña
    const saltRounds = 10; // Puedes ajustar el número de rondas
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
      name: name || null,
      habboName,
      email,
      password: hashedPassword,
      birthDate,
      location: location || null,
    });

    // Asignar roles al usuario
    await newUser.setRoles(roles); // roles debe ser un array de ids

    res.status(201).json({ message: 'Usuario creado exitosamente.', user: newUser });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error al crear el usuario.', error });
  }
};

module.exports = { createUser };