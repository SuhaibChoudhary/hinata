const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js');

module.exports = {
  name: 'list-bot',
  description: 'Get a list of all bots in the server.',
  run: async (client, interaction) => {
    const guild = interaction.guild;

    try {
    await guild.members.fetch();
    // Filter out bots from the member list
    const bots = guild.members.cache.filter(member => member.user.bot);

    if (bots.size === 0) {
      await interaction.reply('There are no bots in this server.');
      return;
    }

    const botList = Array.from(bots.values());
    const itemsPerPage = 10; // Adjust the number of bots to display per page
    const totalPages = Math.ceil(botList.length / itemsPerPage);
    let currentPage = 1;

    // Function to generate the bot list for the current page
    const generateBotList = (page) => {
      const start = (page - 1) * itemsPerPage;
      const end = page * itemsPerPage;
      const currentBots = botList.slice(start, end);

      let o = 1;
      const botListEmbed = new EmbedBuilder()
        .setTitle(`${guild.name}'s Bots (Page ${page}/${totalPages})`)
        .setDescription(currentBots.map(bot => `[${o++}] | ${bot.user.tag} | [${bot.user}]`).join('\n'))
        .setColor(client.config.embed.color);

      return botListEmbed;
    };

    // Function to update the bot list with pagination buttons
    const updateBotList = async (page, message) => {
      const botListEmbed = generateBotList(page);

      const previousButton = new ButtonBuilder()
        .setCustomId('previous')
        .setLabel('Previous')
        .setStyle(1)
        .setDisabled(page === 1);

      const nextButton = new ButtonBuilder()
        .setCustomId('next')
        .setLabel('Next')
        .setStyle(1)
        .setDisabled(page === totalPages);

      const buttonRow = new ActionRowBuilder().addComponents(previousButton, nextButton);

      await message.edit({ embeds: [botListEmbed], components: [buttonRow] });
    };

    // Send the initial bot list with pagination buttons
    const botListEmbed = generateBotList(currentPage);
    const initialButtonRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('previous')
        .setLabel('Previous')
        .setStyle(1)
        .setDisabled(true),
      new ButtonBuilder()
        .setCustomId('next')
        .setLabel('Next')
        .setStyle(1)
        .setDisabled(totalPages === 1) // Disable next button if there's only one page
    );

    const initialMessage = await interaction.reply({ embeds: [botListEmbed], components: [initialButtonRow], fetchReply: true });

    const filter = (interaction) => interaction.user.id === interaction.user.id;
    const collector = initialMessage.createMessageComponentCollector({ filter, time: 60000 });

    collector.on('collect', async (interaction) => {
      if (interaction.customId === 'previous' && currentPage > 1) {
        currentPage--;
      } else if (interaction.customId === 'next' && currentPage < totalPages) {
        currentPage++;
      }

      await interaction.deferUpdate();
      await updateBotList(currentPage, initialMessage);
    });

    collector.on('end', () => {
      initialMessage.edit({ components: [] });
    });
    
  } catch(error) {
    interaction.reply('error')
  }
  },
};
