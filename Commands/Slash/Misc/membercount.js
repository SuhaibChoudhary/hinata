const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'member-count',
    description: 'Gives You The Members Count Of The Server.',

    run: async (client, interaction) => {

        const guild = interaction.guild;

    
        // Create an embed to display the server's banner
        const bannerEmbed = new EmbedBuilder()
          .setTitle(`Members`)
          .setDescription(guild.memberCount.toString())
          .setColor(client.config.embed.color)
          .setTimestamp()
    
        // Reply with the embed
        await interaction.reply({ embeds: [bannerEmbed] });

    }
}