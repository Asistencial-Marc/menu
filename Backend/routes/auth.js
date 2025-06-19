const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middleware/verifyToken');

// Rutas de autenticación
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/verificacio', authController.verificacio);

// Recuperar contrasenya
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

router.post('/acepta_politica', verifyToken, authController.acceptaPolitica);
router.get('/user-info', verifyToken, authController.informació_usuari);


module.exports = router;
