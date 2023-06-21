const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check the bot\'s ping'),

  run: async(client, interaction) => {
    const ping = Date.now() - interaction.createdTimestamp;
    await interaction.reply(`Pong! The bot's ping is ${ping}ms.`);
  },
};
