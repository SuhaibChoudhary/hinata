const { Client, Collection, GatewayIntentBits, Partials } = require("discord.js");
const { readdirSync } = require("fs");
const path = require('path');
const config = require("./config");
const { Manager } = require("erela.js");

const nodes = [
  {
    host: "usa.nextgenhosting.cloud",
    password: "youshallnotpass",
    port: 25623,
  }
];

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

client.manager = new Manager({
  // Pass an array of node. Note: You do not need to pass any if you are using the default values (ones shown below).
  nodes: [
    // If you pass a object like so the "host" property is required
    {
      host: "usa.nextgenhosting.cloud", // Optional if Lavalink is local
      port: 25623, // Optional if Lavalink is set to default
      password: "youshallnotpass", // Optional if Lavalink is set to default
    },
  ],
  // A send method to send data to the Discord WebSocket using your library.
  // Getting the shard for the guild and sending the data to the WebSocket.
  send(id, payload) {
    const guild = client.guilds.cache.get(id);
    if (guild) guild.shard.send(payload);
  },
})
  .on("nodeConnect", node => console.log(`Node ${node.options.identifier} connected`))
  .on("nodeError", (node, error) => console.log(`Node ${node.options.identifier} had an error: ${error.message}`))
  .on("trackStart", (player, track) => {
    console.log(track)
    client.channels.cache
      .get(player.textChannel)
      .send(`Now playing: ${track.title}`);
  })
  .on("queueEnd", (player) => {
    client.channels.cache
      .get(player.textChannel)
      .send("Queue has ended.");

    player.destroy();
  });


client.once("ready", () => {
  console.log("I am ready!");
  // Initiate the manager.
  client.manager.init(client.user.id);
});

client.on("raw", (d) => client.manager.updateVoiceState(d));


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



