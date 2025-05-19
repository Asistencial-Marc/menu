const mongoose = require('mongoose');

const MenuSchema = new mongoose.Schema({
  day: { type: Date, required: true, unique: true },
  firstOption: { type: String, required: true },
  firstOption2: { type: String, required: true },
  secondOption: { type: String, required: true },
  secondOption2: { type: String, required: true },
  dessertOption: { type: String, required: true },
  dessertOption2: { type: String, required: true }
});

MenuSchema.index({ day: 1 }, { unique: true });

module.exports = mongoose.model('Menu', MenuSchema);
