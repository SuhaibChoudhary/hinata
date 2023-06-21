const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'banner-user',
  description: 'Shows the banner of a user.',
  options: [
    {
        name: 'user',
        description: 'The user',
        type: 6, // User type
        required: false,
    },
],
  run: async (client, interaction) => {
    const user = interaction.options.getUser('user') || interaction.user;

    // Check if the user has a banner
    if (!user.banner) {
      await interaction.reply('This user does not have a banner.');
      return;
    }

    // Create an embed to display the user's banner
    const bannerEmbed = new EmbedBuilder()
      .setTitle(`${user.username}'s Banner`)
      .setImage(user.bannerURL({ format: 'png', size: 4096 }))
      .setColor('#ffffff');

    // Reply with the embed
    await interaction.reply({ embeds: [bannerEmbed] });
  },
};
