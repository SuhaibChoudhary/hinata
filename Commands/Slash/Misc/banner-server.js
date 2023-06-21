const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'banner-server',
    description: 'Shows Baanner Of The Server.',

    run: async (client, interaction) => {

        const guild = interaction.guild;

        // Check if the server has a banner
        if (!guild.banner) {
          await interaction.reply('This server does not have a banner.');
          return;
        }
    
        // Create an embed to display the server's banner
        const bannerEmbed = new EmbedBuilder()
          .setTitle(`${guild.name}'s Banner`)
          .setImage(guild.bannerURL({ format: 'png', size: 4096 }))
          .setColor('#ffffff');
    
        // Reply with the embed
        await interaction.reply({ embeds: [bannerEmbed] });

    }
}