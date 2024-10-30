// routes/userRoutes.js
const express = require('express');
const { createUser } = require('../controllers/userController');
const { getIpUser } = require('../controllers/utilsController');
const { loginUser, validateToken } = require('../controllers/loginController');

const router = express.Router();

router.post('/users', createUser);
router.post('/login', loginUser);
router.post('/validate-token', validateToken);
router.get('/get-user-ip', getIpUser);


module.exports = router;