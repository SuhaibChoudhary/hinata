module.exports = {
    name: "pause",
    description : "Pause Current Song Or Music.",
    voiceCommand: true,
    run: async (client, interaction) => {

       const player = client.manager.players.get(interaction.guild.id)

       if(player){
        player.pause()
        return interaction.reply("Succesgully stopped the player.")
       } else {
       return interaction.reply("There are not any player.")
       }
    }
}