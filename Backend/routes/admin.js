const express = require('express');
const router = express.Router();
const multer = require('multer');
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

module.exports = router;
