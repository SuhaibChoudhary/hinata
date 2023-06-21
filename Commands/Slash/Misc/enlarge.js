const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'enlarge',
  description: 'Enlarges and provides an emoji image.',
  options: [
    {
      name: 'emoji-name',
      description: 'Emoji to enlarge',
      type: 3,
      required: true,
    },
  ],
  run: async (client, interaction) => {
    const emojiName = interaction.options.getString('emoji-name');
    if (!emojiName) {
      return interaction.reply('Please provide an emoji.');
    }

    const guildEmojis = interaction.guild.emojis.cache;
    const emoji = guildEmojis.find((emoji) =>
      emoji.name.toLowerCase().includes(emojiName.toLowerCase())
    );

    if (!emoji) {
      return interaction.reply('Emoji not found in the guild.');
    }

    // Generate the enlarged emoji image URL
    const enlargedEmojiUrl = emoji.url;

    const embed = new EmbedBuilder()
      .setTitle('Enlarged Emoji')
      .setColor(client.config.embed.color)
      .setImage(enlargedEmojiUrl);
      
    interaction.reply({ embeds: [embed] });
  },
};
