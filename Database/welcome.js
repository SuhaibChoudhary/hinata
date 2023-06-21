const mongoose = require("mongoose");

const welcomeSchema = new mongoose.Schema({
    guildId : {type: String},
    welcomeChannel: { type: String },
    welcomeMessage: {type: String},
    isEnabled: {type: Boolean, default: false}
});

module.exports = new mongoose.model("Welcome", welcomeSchema);