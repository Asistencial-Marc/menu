const Menu = require('../models/Menu');

// Crear un nuevo menú
const createMenu = async (req, res) => {
  try {
    const {
      day,
      firstOption,
      firstOption2,
      secondOption,
      secondOption2,
      dessertOption,
      dessertOption2
    } = req.body;

    // Convertir YYYY-MM-DD a fecha UTC sin desfase horario
    const [year, month, date] = day.split('-').map(Number);
    const dayDate = new Date(Date.UTC(year, month - 1, date));

    // Verificar si ya existe un menú para esa fecha exacta
    const existingMenu = await Menu.findOne({ day: dayDate });

    if (existingMenu) {
      return res.status(409).json({ message: 'Ja existeix un menú per aquest dia' });
    }

    // Crear nuevo menú
    const newMenu = new Menu({
      day: dayDate,
      firstOption,
      firstOption2,
      secondOption,
      secondOption2,
      dessertOption,
      dessertOption2
    });

    await newMenu.save();
    res.status(201).json(newMenu);
  } catch (error) {
    res.status(500).json({
      message: 'Error al registrar el menú',
      error: error.message
    });
  }
};

// Ver menú por día
const getMenuByDay = async (req, res) => {
  try {
    const { day } = req.params;

    const [year, month, date] = day.split('-').map(Number);
    const startDate = new Date(Date.UTC(year, month - 1, date));
    const endDate = new Date(Date.UTC(year, month - 1, date));
    endDate.setUTCHours(23, 59, 59, 999);

    const menu = await Menu.findOne({
      day: {
        $gte: startDate,
        $lte: endDate
      }
    });

    if (!menu) {
      return res.status(404).json({ message: 'Menú no encontrado para este día' });
    }

    res.status(200).json({
      firstOption: [menu.firstOption, menu.firstOption2],
      secondOption: [menu.secondOption, menu.secondOption2],
      dessertOption: [menu.dessertOption, menu.dessertOption2]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error intern del servidor', error: error.message });
  }
};

const updateMenuByDay = async (req, res) => {
  try {
    const { day } = req.params;
    const {
      firstOption,
      firstOption2,
      secondOption,
      secondOption2,
      dessertOption,
      dessertOption2
    } = req.body;

    const [year, month, date] = day.split('-').map(Number);
    const startDate = new Date(Date.UTC(year, month - 1, date));
    const endDate = new Date(Date.UTC(year, month - 1, date));
    endDate.setUTCHours(23, 59, 59, 999);

    const menu = await Menu.findOneAndUpdate(
      {
        day: { $gte: startDate, $lte: endDate }
      },
      {
        firstOption,
        firstOption2,
        secondOption,
        secondOption2,
        dessertOption,
        dessertOption2
      },
      { new: true }
    );

    if (!menu) {
      return res.status(404).json({ message: 'No s\'ha trobat cap menú per aquest dia' });
    }

    res.status(200).json({ message: 'Menú actualitzat amb èxit', menu });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualitzar el menú', error: error.message });
  }
};

const getMenusByMonth = async (req, res) => {
  try {
    const { year, month } = req.params;
    const start = new Date(Date.UTC(year, month - 1, 1));
    const end = new Date(Date.UTC(year, month, 0));
    end.setUTCHours(23, 59, 59, 999);

    const menus = await Menu.find({ day: { $gte: start, $lte: end } });

    res.status(200).json(menus);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtenir els menús', error: error.message });
  }
};

module.exports = {
  createMenu,
  getMenuByDay,
  updateMenuByDay,
  getMenusByMonth
};
