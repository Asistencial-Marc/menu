const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // Asegúrate que esta ruta es correcta

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// 1. Servir archivos estáticos
app.use(express.static(path.join(__dirname, '../Frontend')));

// 2. Conectar a MongoDB y crear usuario admin si no existe
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ Conectado a MongoDB');

    // Bloque para crear usuario administrador
    const adminExistente = await User.findOne({ role: 'administrador' });
    if (!adminExistente) {
      const hashedPassword = await bcrypt.hash('admin123', 10); // Puedes cambiar la contraseña aquí
      await User.create({
        codi: 'ADMIN001',
        name: 'Administrador',
        username: 'admin',
        email: 'admin@demo.com',
        password: hashedPassword,
        role: 'administrador'
      });
      console.log('🆕 Usuario administrador creado');
    } else {
      console.log('ℹ️ Usuario administrador ya existe');
    }

  })
  .catch(err => {
    console.log('❌ Error al conectar a MongoDB:', err);
  });

// 3. APIs
app.use('/api/auth', require('./routes/auth'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/menu_seleccionat', require('./routes/menu_seleccionat'));

// 4. Redirección y páginas
app.get('/:page', (req, res, next) => {
  const page = req.params.page;
  const filePath = path.join(__dirname, '../Frontend', `${page}.html`);
  
  res.sendFile(filePath, (err) => {
    if (err) {
      next(); // Si no existe, pasa al error 404
    }
  });
});

app.get('/', (req, res) => {
  res.redirect('/login');
});

// 5. Página 404 final
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '../Frontend', '404.html'));
});

// 6. Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
