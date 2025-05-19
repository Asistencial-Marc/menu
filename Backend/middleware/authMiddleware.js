const jwt = require('jsonwebtoken');

// Middleware de autenticación
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado, token no proporcionado' });
  }

  // Verificar el token usando la clave secreta
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido', error: err.message });
    }

    // Si el token es válido, agregar los datos del usuario a la solicitud
    req.user = decoded;  
    next();  // Continuar con la siguiente función o controlador
  });
};

module.exports = authMiddleware;
