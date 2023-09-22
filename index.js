const { Client, Collection, GatewayIntentBits, Partials } = require("discord.js");
const { readdirSync } = require("fs");
const path = require('path');
const config = require("./config");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
  ],
  partials: [
    Partials.Channel,
    Partials.Message,
    Partials.User,
    Partials.GuildMember,
  ],
});

client.login(config.bot.token);
client.config = config;

client.once("ready", () => {
  console.log("I am ready!");
  });

module.exports = client;

const mongoose = require("./Structure/mongoose");
const Dashboard = require("./Structure/dashboard.js");


try {
let eventCount = 0;
readdirSync("./events")
.filter((f) => f.endsWith(".js")) .forEach((event) => {
require(`./events/${event}`);
eventCount++;
  console.log(`${event} File Loaded`);
});
  
console.log(`${eventCount} event loaded`);
} catch(error){
  console.log(error);
}


client.scommands = new Collection();
try {
  let allCommands = [];
  readdirSync("./Commands/Slash").forEach((dir) => {
    const commands = readdirSync(`./Commands/Slash/${dir}`).filter((f) =>
      f.endsWith(".js")
    );

    for (const cmd of commands) {
      const command = require(`./Commands/Slash/${dir}/${cmd}`);
      if (command.name) {
        client.scommands.set(command.name, command);
        allCommands.push(command);
      } else {
        console.log(`${cmd} is not ready`);
      }
    }
  });
  client.on("ready", async () => {
    client.application.commands.set(allCommands);
  });
  console.log(`${client.scommands.size} Slash Commands Loaded`);
} catch (error) {
  console.log(error);
}



