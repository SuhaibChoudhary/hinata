const mongoose = require('mongoose');

const premiumSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  premium: { type: Boolean, default: false },
  expirationDate: { type: Date },
  // Add any additional fields relevant to your premium model
});

module.exports = new mongoose.model('Guild Premiums', premiumSchema);
