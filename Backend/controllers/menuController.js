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

    // Normalizar la fecha al inicio del día (en hora local del servidor)
    const dayDate = new Date(day);
    dayDate.setHours(0, 0, 0, 0);

    // Verificar si ya existe un menú para esa fecha exacta
    const existingMenu = await Menu.findOne({ day: dayDate });
    console.log("Buscando menú para:", day);
    if (existingMenu) {
      return res.status(409).json({ message: 'Ja existeix un menú per aquest dia' });
    }
    else if (!existingMenu){

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
    }
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

    const startDate = new Date(day);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(day);
    endDate.setHours(23, 59, 59, 999);

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
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
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

    const startDate = new Date(day);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(day);
    endDate.setHours(23, 59, 59, 999);

    const menu = await Menu.findOneAndUpdate(
      {
        day: {
          $gte: startDate,
          $lte: endDate
        }
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
    const start = new Date(`${year}-${month}-01`);
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
    end.setHours(23, 59, 59, 999);

    const menus = await Menu.find({ day: { $gte: start, $lte: end } });

    res.status(200).json(menus);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtenir els menús', error: error.message });
  }
};


module.exports = { createMenu, getMenuByDay, updateMenuByDay, getMenusByMonth };
