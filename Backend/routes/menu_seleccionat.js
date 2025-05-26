const express = require('express');
const router = express.Router();
const Menu = require('../models/Menu');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// Ruta para seleccionar menú
router.post('/select', authMiddleware, async (req, res) => {
  const { day, firstOption, secondOption, dessertOption, ubicacio } = req.body;
  const userId = req.user.id;

  try {
    const menu = await Menu.findOne({ day });

    if (!menu) {
      return res.status(404).json({ message: 'Menú no trobat per aquest dia' });
    }

    // Comprobación de si ya ha seleccionado menú ese día
    const existing = await User.findOne({
      _id: userId,
      'selectedMenus.day': {
        $gte: new Date(new Date(day).setHours(0, 0, 0, 0)),
        $lte: new Date(new Date(day).setHours(23, 59, 59, 999))
      }
    });

    if (existing) {
      return res.status(400).json({ message: 'Ja has seleccionat menú per aquest dia.' });
    }

    const userSelection = { userId, day, firstOption, secondOption, dessertOption, ubicacio  };

    await User.findByIdAndUpdate(userId, {
      $push: { selectedMenus: userSelection }
    });

    res.status(200).json({ message: 'Selecció guardada amb èxit' });
  } catch (error) {
    res.status(500).json({ message: 'Error al guardar la selecció', error: error.message });
  }
});

// Ruta para obtener selecciones de usuarios por día
router.get('/selections/:day', authMiddleware, async (req, res) => {
  const { day } = req.params;

  try {
    const startDate = new Date(day);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(day);
    endDate.setHours(23, 59, 59, 999);

    const users = await User.find({
      "selectedMenus.day": { $gte: startDate, $lte: endDate }
    }).select("name selectedMenus");

    const usersWithMenu = [];

    users.forEach(user => {
      user.selectedMenus.forEach(selection => {
        const selectionDate = new Date(selection.day);
        selectionDate.setHours(0, 0, 0, 0);
        const targetDate = new Date(day);
        targetDate.setHours(0, 0, 0, 0);

        if (selectionDate.getTime() === targetDate.getTime()) {
          usersWithMenu.push({
            name: user.name,
            firstOption: selection.firstOption,
            secondOption: selection.secondOption,
            dessertOption: selection.dessertOption,
            ubicacio: selection.ubicacio
          });
        }
      });
    });

    res.status(200).json({ users: usersWithMenu });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener les seleccions', error: error.message });
  }
});

// ✅ NUEVA RUTA: Verificar si ya seleccionó menú para ese día
router.get('/check/:day', authMiddleware, async (req, res) => {
  const { day } = req.params;
  const userId = req.user.id;

  const startDate = new Date(day);
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(day);
  endDate.setHours(23, 59, 59, 999);

  try {
    const user = await User.findOne({
      _id: userId,
      'selectedMenus.day': { $gte: startDate, $lte: endDate }
    });

    return res.json({ alreadySelected: !!user });
  } catch (error) {
    res.status(500).json({ message: 'Error al verificar la selecció', error: error.message });
  }
});

// Ruta per modificar selecció d'un usuari per un dia futur
router.put('/update', authMiddleware, async (req, res) => {
  const { day, firstOption, secondOption, dessertOption, ubicacio } = req.body;
  const userId = req.user.id;

  try {
    const dayDate = new Date(day);
    dayDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dayDate <= today) {
      return res.status(403).json({ message: 'Només pots modificar menús de dies futurs' });
    }

    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: 'Usuari no trobat' });
    }

    const selection = user.selectedMenus.find(sel => {
      const selDate = new Date(sel.day);
      selDate.setHours(0, 0, 0, 0);
      return selDate.getTime() === dayDate.getTime();
    });

    if (!selection) {
      return res.status(404).json({ message: 'No s\'ha trobat cap selecció per aquest dia' });
    }

    // Actualitzar els camps
    selection.firstOption = firstOption;
    selection.secondOption = secondOption;
    selection.dessertOption = dessertOption;
    selection.ubicacio = ubicacio;

    await user.save();
    res.status(200).json({ message: 'Selecció modificada amb èxit' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al modificar la selecció', error: error.message });
  }
});

// Eliminar selección de menú de un usuario para un día
router.delete('/delete/:day', authMiddleware, async (req, res) => {
  const { day } = req.params;
  const userId = req.user.id;

  const startDate = new Date(day);
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(day);
  endDate.setHours(23, 59, 59, 999);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (startDate <= today) {
    return res.status(400).json({ message: 'No pots eliminar seleccions per avui o dies anteriors' });
  }

  try {
    const result = await User.updateOne(
      {
        _id: userId,
        'selectedMenus.day': { $gte: startDate, $lte: endDate }
      },
      {
        $pull: {
          selectedMenus: {
            day: { $gte: startDate, $lte: endDate }
          }
        }
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'No s\'ha trobat cap selecció per aquest dia' });
    }

    res.status(200).json({ message: 'Selecció eliminada correctament' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la selecció', error: error.message });
  }
});

// Obtener la selección del usuario autenticado para un día concreto
router.get('/day/:day', authMiddleware, async (req, res) => {
  const { day } = req.params;
  const userId = req.user.id;

  const start = new Date(day);
  start.setHours(0, 0, 0, 0);
  const end = new Date(day);
  end.setHours(23, 59, 59, 999);

  try {
    const user = await User.findOne({
      _id: userId,
      'selectedMenus.day': { $gte: start, $lte: end }
    });

    if (!user) return res.status(404).json({ message: 'No s\'ha trobat cap selecció.' });

    const selection = user.selectedMenus.find(sel => {
      const selDate = new Date(sel.day);
      selDate.setHours(0, 0, 0, 0);
      return selDate.getTime() === start.getTime();
    });

    if (!selection) return res.status(404).json({ message: 'No s\'ha trobat cap selecció.' });

    res.status(200).json(selection);
  } catch (err) {
    res.status(500).json({ message: 'Error al recuperar la selecció', error: err.message });
  }
});

module.exports = router;
