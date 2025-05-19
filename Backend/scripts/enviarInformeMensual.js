const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const ExcelJS = require('exceljs');
const cron = require('node-cron');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI);

function getDateRange() {
  const now = new Date();
  const currentDay = now.getDate();
  const start = new Date(now);
  const end = new Date(now);

  if (currentDay >= 26) {
    start.setDate(26);
    end.setMonth(end.getMonth() + 1);
    end.setDate(25);
  } else {
    start.setMonth(start.getMonth() - 1);
    start.setDate(26);
    end.setDate(25);
  }

  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

async function generarExcel() {
  const { start, end } = getDateRange();

  const users = await User.find({ 'selectedMenus.day': { $gte: start, $lte: end } });

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Informe de Menú');

  sheet.columns = [
    { header: 'Nom', key: 'name', width: 30 },
    { header: 'Codi', key: 'codi', width: 20 },
    { header: 'Dies amb selecció', key: 'dias', width: 50 },
    { header: 'Mesos', key: 'mesos', width: 15 },
    { header: 'Recompte per mes', key: 'recompte', width: 15 },
    { header: 'Detall per mes', key: 'detall', width: 100 }
  ];

  users.forEach(user => {
    const seleccionsFiltrades = user.selectedMenus.filter(sel => {
      const d = new Date(sel.day);
      return d >= start && d <= end;
    });

    const dias = seleccionsFiltrades.map(sel =>
      new Date(sel.day).toISOString().split('T')[0]).join(', ');

    // Agrupar por mes
    const resumenPerMes = {};
    seleccionsFiltrades.forEach(sel => {
      const date = new Date(sel.day);
      const mes = date.toLocaleString('default', { month: 'long' }); // "May", etc.
      if (!resumenPerMes[mes]) {
        resumenPerMes[mes] = [];
      }
      const formatted = `${date.toLocaleDateString('ca-ES')}: ${sel.firstOption} - ${sel.secondOption} - ${sel.dessertOption}`;
      resumenPerMes[mes].push(formatted);
    });

    const mesos = Object.keys(resumenPerMes).join(', ');
    const recompte = Object.values(resumenPerMes).map(arr => arr.length).join(', ');
    const detall = Object.entries(resumenPerMes)
      .map(([mes, arr]) => `${mes}:\n${arr.join('\n')}`)
      .join('\n\n');

    sheet.addRow({
      name: user.name,
      codi: user.codi,
      dias,
      mesos,
      recompte,
      detall
    });
  });

  const outputPath = path.join(__dirname, 'informe_mensual.xlsx');
  await workbook.xlsx.writeFile(outputPath);
  return outputPath;
}

async function enviarCorreoConInforme() {
  const filePath = await generarExcel();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: 'Sistema de Menú <no-reply@menu.com>',
    to: 'transformaciodigital@grupassistencialevangelic.com',
    subject: 'Informe mensual de selecció de menú',
    text: 'Adjunt tés l’informe de seleccions de menú del mes.',
    attachments: [{ filename: 'informe_mensual.xlsx', path: filePath }]
  };

  await transporter.sendMail(mailOptions);
  console.log('✅ Correu enviat correctament');

  fs.unlinkSync(filePath);
}

cron.schedule('0 8 27 * *', enviarCorreoConInforme);

module.exports = enviarCorreoConInforme;
