module.exports = {
    name: 'play',
    description: "playing music for you",
    voiceCommand: true,
    options: [
        {
            name: "search",
            description: "search song for playing",
            type: 3,
            required: true,
        }
    ],
run: async(client, interaction) => {
        const search = interaction.options.getString('search');
        let res;

        try {
            // Search for tracks using a query or URL
            res = await client.manager.search(search, interaction.user);
            // Check the load type as this command is not that advanced for basics
            if (res.loadType === 'LOAD_FAILED') throw res.exception;
            else if (res.loadType === 'PLAYLIST_LOADED') throw { message: 'Playlists are not supported with this command.' };
        } catch (err) {
            return interaction.reply(`There was an error while searching: ${err.message}`);
        }

        // Create the player
        const player = client.manager.create({
            guild: interaction.guild.id,
            voiceChannel: interaction.member.voice.channel.id,
            textChannel: interaction.channel.id,
        });

        // Connect to the voice channel and add the track to the queue
        player.connect();
        player.queue.add(res.tracks[0]);

        // Checks if the client should play the track if it's the first one added
        if (!player.playing && !player.paused && !player.queue.size) player.play();

        return interaction.reply(`Enqueuing ${res.tracks[0].title}.`);
    },
};
