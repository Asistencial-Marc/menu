const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// 1. Servir archivos estáticos
app.use(express.static(path.join(__dirname, '../Frontend')));

// 2. Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.log('Error al conectar a MongoDB:', err));

// 3. APIs
app.use('/api/auth', require('./routes/auth'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/menu_seleccionat', require('./routes/menu_seleccionat'));

app.get('/:page', (req, res, next) => {
  const page = req.params.page;
  const filePath = path.join(__dirname, '../Frontend', `${page}.html`);
  
  res.sendFile(filePath, (err) => {
      if (err) {
          next(); // Si no existe, pasa al error 404
      }
  });
});

// Inici automatic al login
app.get('/', (req, res) => {
  res.redirect('/login');
});


// Página 404 final
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '../Frontend', '404.html'));
})

// 6. Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Servidor corriendo en puerto ${PORT}`));
