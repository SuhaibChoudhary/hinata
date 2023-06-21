const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js');

module.exports = {
  name: 'list-booster',
  description: 'Displays the list of the server boosters.',
  run: async (client, interaction) => {
    const guild = interaction.guild;

    // Fetch all server members
    await guild.members.fetch();

    // Filter members who have boosted the server
    const boosters = guild.members.cache.filter((member) => member.premiumSinceTimestamp);

    if (boosters.size === 0) {
      await interaction.reply('There are no server boosters.');
      return;
    }

    const PAGE_SIZE = 10; // Number of boosters to display per page
    const totalPages = Math.ceil(boosters.size / PAGE_SIZE);

    let page = interaction.options.getInteger('page') || 1; // Get the page number from the command options

    // Ensure the provided page number is within valid range
    if (page < 1 || page > totalPages) {
      page = 1; // Default to the first page if the provided page number is invalid
    }

    const start = (page - 1) * PAGE_SIZE;
    const end = page * PAGE_SIZE;
    const boostersToShow = boosters.toArray().slice(start, end);

    const boosterList = boostersToShow
      .map((booster, index) => `${start + index + 1}. ${booster.user.tag}`)
      .join('\n');

    const boosterEmbed = new EmbedBuilder()
      .setTitle(`${guild.name}'s Boosters (Page ${page}/${totalPages})`)
      .setDescription(boosterList)
      .setColor(client.config.embed.color);

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

    await interaction.reply({ embeds: [boosterEmbed], components: [buttonRow], fetchReply: true });

    const filter = (interaction) => interaction.user.id === interaction.user.id;
    const collector = interaction.fetchReply().then((message) => {
      return message.createMessageComponentCollector({ filter, time: 60000 });
    });

    collector.on('collect', async (interaction) => {
      if (interaction.customId === 'previous' && page > 1) {
        page--;
      } else if (interaction.customId === 'next' && page < totalPages) {
        page++;
      }

      const updatedStart = (page - 1) * PAGE_SIZE;
      const updatedEnd = page * PAGE_SIZE;
      const updatedBoostersToShow = boosters.array().slice(updatedStart, updatedEnd);

      const updatedBoosterList = updatedBoostersToShow
        .map((booster, index) => `${updatedStart + index + 1}. ${booster.user.tag}`)
        .join('\n');

      const updatedBoosterEmbed = new EmbedBuilder()
        .setTitle(`${guild.name}'s Boosters (Page ${page}/${totalPages})`)
        .setDescription(updatedBoosterList)
        .setColor(client.config.embed.color);

      const updatedButtonRow = new ActionRowBuilder().addComponents(previousButton, nextButton);

      await interaction.update({ embeds: [updatedBoosterEmbed], components: [updatedButtonRow] });
    });

    collector.on('end', () => {
      const endedButtonRow = new ActionRowBuilder().addComponents(previousButton.setDisabled(true), nextButton.setDisabled(true));
      interaction.editReply({ components: [endedButtonRow] });
    });
  },
};
