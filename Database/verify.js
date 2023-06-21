const { json } = require("express");
const mongoose = require("mongoose");

const verification = new mongoose.Schema({
    guildId: {type: String},
    isEnabled: {type: Boolean},
    verificationChannel: {type: String},
    verificationRole: {type: String}
});

module.exports = new mongoose.model("Verification", verification);