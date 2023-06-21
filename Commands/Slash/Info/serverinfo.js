const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'serverinfo',
    description: 'Shows You All Informations About The Server.',

    run: async (client, interaction) => {

        const guild = interaction.guild;

        const bannerEmbed = new EmbedBuilder()
          .setTitle(`${guild.name}'s Information`)
          .addFields({name: '__Server Details__', value: `**Name: ${guild.name}\nOwner: <@${guild.ownerId}>\nCreated At: ${guild.createdAt}\nTotal Members: ${guild.memberCount}\nBanned Members: ${await guild.bans.fetch().then(bans => bans.size)}**`})
          .addFields({name: '__Extras__', value: `**Verification Level: ${guild.verificationLevel}\nUpload Limit: ${guild.premiumTier === 'NONE' ? '8MB' : '100MB'}\nInactive Channel Timeout: ${guild.inactive ? guild.inactive.toFixed() : 'None'} days\nSystem Message Channel: ${guild.systemChannel || 'None'}\nWelcome Messages: ${guild.systemChannelFlags.WELCOME_MESSAGE_ENABLED ? 'Enabled' : 'Disabled'}\nBoost Messages: ${guild.systemChannelFlags.BOOST_MESSAGE_ENABLED ? 'Enabled' : 'Disabled'}\nDefault Notification Settings: ${guild.defaultMessageNotifications}\nExplicit Content Filter: ${guild.explicitContentFilter}\n2FA Requirement: ${guild.mfaLevel}\nBoost Level: ${guild.premiumTier}\nBoost Count: ${guild.premiumSubscriptionCount}\nBoost Bar Enabled: ${guild.premiumTier !== 'NONE'}**`})
          .addFields({name: `__Description__`, value: `**${guild.description ? guild.description : 'No Description Available'}**`})
    

        await interaction.reply({ embeds: [bannerEmbed] });

    }
}