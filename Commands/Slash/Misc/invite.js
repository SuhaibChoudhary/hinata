const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'invite',
  description: 'Invite The Bot To Your Server.',
  run: async (client, interaction) => {
    const inviteEmbed = new EmbedBuilder()
      .setTitle('Invite Bot')
      .setDescription('Click the link below to invite the bot to your server!')
      .setColor(client.config.embed.color)

    await interaction.reply({ embeds: [inviteEmbed] });
  },
};
