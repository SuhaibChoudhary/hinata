const { ApplicationCommandType, Client, CommandInteraction, PermissionFlagsBits, EmbedBuilder, voiceChannel } = require("discord.js");
const { codeBlock } = require("@discordjs/builders");

module.exports = {
  name: "ping",
  description: "Getting ping of bot",
  category: "Info",
  cooldown: 10,
  aliases: ["network"],
  type: ApplicationCommandType.ChatInput,
  userPermissions: [PermissionFlagsBits.SendMessages],
  botPermissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.Speak, PermissionFlagsBits.Connect],

  run: async (client, message, args) => {
    const embed = new EmbedBuilder()
      .setColor("#ffffff")
      .setAuthor({ name: client.user.username + "Internet Pings:", iconURL: client.user.displayAvatarURL() })
      .setTitle("**🏓 Is It Okay? I Can't Look**")
      .addFields({ name: "DISCORD A PI", value: codeBlock('js', `${client.ws.ping}ms`) })
    message.reply({ embeds: [embed] })
  }
}
