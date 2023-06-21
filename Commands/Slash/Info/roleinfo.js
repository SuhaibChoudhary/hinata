const { EmbedBuilder } = require('discord.js');
const discord = require("discord.js");

module.exports = {
  name: 'roleinfo',
  description: 'Shows you all information about a role.',
  options: [
    {
      name: 'role',
      description: 'Select a role.',
      type: 8, // 8 represents the ROLE type
      required: true,
    },
  ],
  run: async (client, interaction) => {
    const role = interaction.options.getRole('role');

    if (!role) {
      await interaction.reply('Invalid role.');
      return;
    }

    const allowedPermissions = role.permissions.toArray();

    const embed = new EmbedBuilder()
      .setAuthor({ name: role.name, iconURL: client.user.displayAvatarURL() })
      .setThumbnail(role.iconURL() || '')
      .addFields({ name: '__General Info__', value: `**Role Name: ${role.name}\nRole ID: ${role.id}\nRole Position: ${role.position}\nHex Code: ${role.hexColor}\nCreated At: ${role.createdAt}\nMentionability: ${role.mentionable}\nSeparated: ${role.hoist}\nIntegration: ${role.managed}**` })
      .setColor(role.hexColor)
      .addFields({ name: '__Allowed Permissions__', value: `**${allowedPermissions.join(' , ') || '**None**'}**` })
      .setFooter({text: `Requested By ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL()})

    await interaction.reply({ embeds: [embed] });
  },
};
