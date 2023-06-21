const { InteractionType, EmbedBuilder, VoiceChannel, ChannelType } = require("discord.js");
const client = require('../index.js');

client.on("interactionCreate", async (interaction) => {
  // code
  if (interaction.type == InteractionType.ApplicationCommand) {
    const command = client.scommands.get(interaction.commandName);
    if (!command) {
      return interaction.reply({
        content: `\`${interaction.commandName}\` is not valid command !!`,
        ephemeral: true,
      });
    } else {
      if (
        command.userPermissions &&
        !interaction.member.permissions.has(command.userPermissions)
      ) {
        return interaction.reply({
          content: `you don't have enough permissions !!`,
          ephemeral : true
        });
      } else if (
        command.botPermissions &&
        !interaction.guild.members.me.permissions.has(command.botPermissions)
      ) {
        return interaction.reply({
          content: `i don't have enough permissions !!`,
          ephemeral : true
        });
      } else if (command?.voiceCommand === true) {
        if (!interaction.member.voice.channel) {
          return interaction.reply({
            embeds: [new EmbedBuilder().setAuthor({name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true})}).setDescription("You need to be in a voice channel to use this command!").setColor(client.config.embed.color)],
            ephemeral: true,
          });
        }
      } else {
      
      command.run(client, interaction);
      }
    }
  }
});