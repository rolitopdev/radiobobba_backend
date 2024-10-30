// index.js
const express = require('express');
const sequelize = require('./config/database');
const routes = require('./routes/routes');
const cors = require('cors'); // Importar cors
const rateLimit = require('express-rate-limit'); // Importar rateLimit
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Definir los dominios permitidos
const allowedOrigins = [
  'https://radiobobba.com',
  'https://*.radiobobba.com', // Permite todos los subdominios
  'http://localhost:4200'
];

// Configuración de CORS
app.use(cors({
  origin: (origin, callback) => {
    if (process.env.CLOUD == "false") {
      // Permitir cualquier origen si CLOUD es false
      return callback(null, true);
    } else {
      // Validar el origen cuando CLOUD es true
      const isAllowed = allowedOrigins.some(allowedOrigin =>
        new RegExp(allowedOrigin.replace('*.', '.*')).test(origin)
      );
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  }
}));

// Configuración del límite de peticiones
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limitar a 100 solicitudes por IP cada 15 minutos
  message: 'Demasiadas solicitudes desde esta IP, intente nuevamente más tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Aplicar el limitador de tasa globalmente
app.use(limiter);

// Middleware para parsear JSON
app.use(express.json());

// Rutas
app.use('/api', routes);

// Sincronizar los modelos
const syncDatabase = async () => {
  await sequelize.sync({ alter: true }); // Modifica las tablas existentes según los modelos
  console.log("[RADIOBOBBA_API]: Tablas sincronizadas");
};

syncDatabase().catch(error => console.error(error));

// Iniciar el servidor
app.listen(port, () => {
  console.log(`[RADIOBOBBA_API]: Server running on http://localhost:${port}`);
});
