const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function importarUsuariosDesdeCSV(filePath) {
  console.log("Importando desde:", filePath);

  if (!fs.existsSync(filePath)) {
    throw new Error(`El fitxer ${filePath} no existeix`);
  }

  return new Promise((resolve, reject) => {
    const usuarios = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => usuarios.push(row))
      .on('end', async () => {
        try {
          for (const u of usuarios) {
            const plainPassword = u.password || '123456aA*'; // Password por defecto si falta

            const hashedPassword = await bcrypt.hash(plainPassword, 10);

            const nuevoUsuario = new User({
              codi: u.codi,
              name: u.name,
              username: u.username,
              email: u.email || undefined,
              password: hashedPassword,
              role: u.role,
              selectedMenus: []
            });

            await nuevoUsuario.save();
            console.log(`✅ Usuario ${u.username} importado correctamente.`);
          }

          resolve();
        } catch (err) {
          reject(err);
        }
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

module.exports = importarUsuariosDesdeCSV;
