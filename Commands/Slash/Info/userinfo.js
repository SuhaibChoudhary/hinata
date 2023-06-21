const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'userinfo',
    description: 'Getting info of a user',
    options: [
      {
        name: 'member',
        description: 'The user',
        type: 6, // User type
        required: false,
      },
    ],
run: async(client, interaction) => {
    function getBadgeIcon(flag) {
      // Your existing getBadgeIcon function code here
    }

    let member;
    if (interaction.options.getMember('member')) {
      member = interaction.options.getMember('member');
    } else {
      member = interaction.member;
    }

    if (member) {
      const roleNames = member.roles.cache.map((r) => {
        if (r.name !== '@everyone') {
          return `<@&${r.id}>`;
        }
      });

      let rolesString = '';

      if (roleNames.length <= 20) {
        rolesString = roleNames.join(', ');
      } else {
        rolesString = `${roleNames.slice(0, 20).join(', ')} and ${roleNames.length - 20} more roles`;
      }

      const permissionsArray = member.permissions.toArray();
      const permissionsString = permissionsArray.join(', ');

      const badges = member.user.flags.toArray().map((flag) => {
        const badgeIcon = getBadgeIcon(flag);
        return `${badgeIcon}`;
      }).join('  ');

      const Embed = new EmbedBuilder()
        .setColor("#ffffff")
        .setAuthor({ name: `${member.user.tag}`, iconUrl: member.user.displayAvatarURL({ dynamic: true }) })
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .addFields({ name: '**__Basic Information__**', value: `
          **Name :** ${member.user.username}
          **Nickname :** ${member.nickname ? '' : 'None'}
          **Id :** ${member.id}
          **Bot? :** ${member.user.bot ? ` Yes` : ` No`}
          **Badges :** ${badges} 
          **Account Created At :** <t:${Math.floor(member.user.createdTimestamp / 1000)}>
          **Server Joined :** <t:${Math.floor(member.joinedTimestamp / 1000)}>
        `})
        .addFields({ name: '**__Roles Information__**', value: `
          **Highest Role :** ${member.roles.highest ? member.roles.highest : 'No Role Found'}
          **Highest Role Color :** ${member.roles.highest.hexColor ? member.roles.highest.hexColor : '#Default Color'}
          **Roles :** ${rolesString ? rolesString : 'No Roles Found.'}
        `});

      if (member.user.banner) {
        await Embed.setImage(member.user.bannerURL({ dynamic: true, size: 1024 }));
      }

      await interaction.reply({ embeds: [Embed] });
    } else {
      await interaction.reply( "**couldn't find that user**");
    }
  },
};
