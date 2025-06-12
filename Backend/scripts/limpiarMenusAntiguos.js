require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const mongoose = require('mongoose');
const Menu = require('../models/Menu');
const User = require('../models/User');

module.exports = async function limpiarMenusAntiguos() {
    const now = new Date();
    const Mesos2 = new Date();
    Mesos2.setMonth(now.getMonth() - 2);
    try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const now = new Date();
    const Mesos2 = new Date(now.getFullYear(), now.getMonth() - 2, 1);

    const deletedMenus = await Menu.deleteMany({ day: { $lt: Mesos2 } });
    console.log(`✅ Menús eliminados: ${deletedMenus.deletedCount}`);

    const users = await User.find({ 'selectedMenus.day': { $lt: Mesos2 } });
    for (const user of users) {
      const originalLength = user.selectedMenus.length;
      user.selectedMenus = user.selectedMenus.filter(menu => menu.day >= Mesos2);
      if (user.selectedMenus.length < originalLength) {
        await user.save();
        console.log(`🧹 Menús antiguos eliminados para ${user.username}`);
      }
    }

    console.log('🎉 Limpieza mensual completada.');
    process.exit();
  } catch (error) {
    console.error('❌ Error durante la limpieza:', error);
    process.exit(1);
  }
}

cleanOldMenus();
