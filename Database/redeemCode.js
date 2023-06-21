const mongoose = require("mongoose");

const redeemCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  used: {
    type: Boolean,
    required: true,
  },
  expirationDate: {
    type: Date,
    required: true,
  },
});

const RedeemCode = new mongoose.model("RedeemCode", redeemCodeSchema);

module.exports = RedeemCode;
