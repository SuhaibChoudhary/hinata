const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'avatar',
    description: 'Getting avatar og user',
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

        // Create an embed to display the user's avatar
        const avatarEmbed = new EmbedBuilder()
            .setTitle(`${user.username}'s Avatar`)
            .setImage(user.displayAvatarURL({ dynamic: true, size: 4096 }))
            .setColor('#ffffff');

        // Reply with the embed
        await interaction.reply({ embeds: [avatarEmbed] });
    }
}