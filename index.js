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
  'http://localhost:4200'
];

const publicEndpoints = [
  '/login',
  '/register',
  '/get-user-ip'
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

// Middleware de autorización JWT
const verifyToken = (req, res, next) => {
  console.log('req.path', req.path);
  if (publicEndpoints.includes(req.path)) {
    return next();
  }

  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ message: 'No se proporcionó un token' });

  const tokenWithoutBearer = token.replace("Bearer ", "");
  jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Token inválido o expirado' });
    req.user = decoded;
    next();
  });
};

// Aplicar el limitador de tasa globalmente
app.use(limiter);

// Middleware para parsear JSON
app.use(express.json());

// Rutas
app.use('/api', verifyToken, routes);

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
