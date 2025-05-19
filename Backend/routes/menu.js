const express = require('express');
const router = express.Router();
const { createMenu, getMenuByDay, updateMenuByDay, getMenusByMonth } = require('../controllers/menuController');
const jwt = require('jsonwebtoken');

// Middleware de autenticación
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Accés denegat, token no proporcionat' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token invàlid', error: err.message });
    }

    req.user = decoded;
    next();
  });
};

// Rutas protegidas
router.post('/', authMiddleware, createMenu);
router.get('/:day', authMiddleware, getMenuByDay);
router.put('/:day', authMiddleware, updateMenuByDay);
router.get('/month/:year/:month', authMiddleware, getMenusByMonth);

module.exports = router;
