const express = require('express');
const router = express.Router();
const multer = require('multer');
const User = require('../models/User');
const path = require('path');
const importUsers = require('../scripts/importUsers');
const authMiddleware = require('../middleware/authMiddleware');

// Configuración de multer
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, `import-${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

// Solo admins
function requireAdmin(req, res, next) {
  if (req.user.role !== 'administrador') {
    return res.status(403).json({ message: 'Accés no autoritzat' });
  }
  next();
}

const enviarInforme = require('../scripts/enviarInformeMensual');
router.post('/enviar-informe', authMiddleware, requireAdmin, async (req, res) => {
  try {
    await enviarInforme(); // llama a la misma función del cron manualmente
    res.json({ message: 'Informe enviat correctament!' });
  } catch (error) {
    console.error('Error manual informe:', error);
    res.status(500).json({ message: 'Error en enviar informe.', error });
  }
});


// Nueva ruta para subir CSV
router.post('/importar-usuaris',authMiddleware,requireAdmin,
   upload.single('csv'),  // 👈 Aquí multer sube el archivo CSV
  async (req, res) => {
    try {
      console.log("Archivo recibido:", req.file);  // 👀 Mira si multer recibe el archivo

      if (!req.file) {
        return res.status(400).json({ message: 'No s\'ha rebut cap fitxer' });
      }

      await importUsers(req.file.path); // 👈 Aquí mandas el path al script
      res.status(200).json({ message: 'Importació completada correctament' });
    } catch (error) {
      console.error("ERROR durant la importació:", error.stack || error);  // 👈 Mostrar el error completo
      res.status(500).json({ message: 'Error durant la importació', error: error.message });
    }
  }
);


// ✅ Obtener lista de usuarios
router.get('/llista-usuaris', authMiddleware, requireAdmin, async (req, res) => {
  try {
    const users = await User.find().select('name codi email _id');
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtenir els usuaris', error: error.message });
  }
});

// ✅ Eliminar usuario por ID
router.delete('/eliminar-usuari/:id', authMiddleware, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.json({ message: 'Usuari eliminat correctament' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar l\'usuari', error: error.message });
  }
});
module.exports = router;
