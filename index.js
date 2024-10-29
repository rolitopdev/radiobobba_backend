// index.js
const express = require('express');
const app = express();
const port = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('¡Hola, esta es tu API en Node.js!');
});

// Ejemplo de endpoint GET
app.get('/api/usuarios', (req, res) => {
  res.json([{ id: 1, nombre: 'Juan' }, { id: 2, nombre: 'María' }]);
});

// Ejemplo de endpoint POST
app.post('/api/usuarios', (req, res) => {
  const nuevoUsuario = req.body;
  res.status(201).json({ mensaje: 'Usuario creado', usuario: nuevoUsuario });
});

// Servidor escuchando
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
