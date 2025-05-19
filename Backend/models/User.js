/**const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  codi_empleat: { type: String, required: true},
  role: { type: String, enum: ['cocinero', 'empleado', 'administrador'], required: true }
});

module.exports = mongoose.model('User', UserSchema);**/

/**
 * Version nueva del Schema de los Usuarios
 */
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  codi: { type: String, required: true, unique: true },  // Codi único y requerido
  name: { type: String, required: true },                // Nombre requerido
  username: { type: String, required: true},
  email: { 
    type: String, 
    required: false, 
    unique: true, 
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,  // Validación del correo electrónico
    lowercase: true
  },
  password: { type: String, required: true },  // Contraseña requerida
  role: { 
    type: String, 
    enum: ['empleado', 'cocinero', 'administrador'], 
    required: true 
  },
  selectedMenus: [{ 
    day: { type: Date }, 
    firstOption: { type: String }, 
    secondOption: { type: String }, 
    dessertOption: { type: String } 
  }],
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }
});

// Añadir índices para mejorar el rendimiento de las consultas
UserSchema.index({ email: 1 });  // Índice único en el correo
UserSchema.index({ codi: 1 });   // Índice único en el codi

module.exports = mongoose.model('User', UserSchema);
