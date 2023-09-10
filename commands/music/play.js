
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, userMention } = require("discord.js");

const { messageBuilder } = require("../../embed");
const {  QueryType, useMainPlayer } = require("discord-player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Insert Only Youtube URL")
    .addStringOption((option) => option.setName("search").setDescription("The input to echo back").setRequired(true)),
  async execute({ client, interaction }) {
    
    const player = useMainPlayer();
    const queue = player.nodes.create(interaction.guildId);
    queue.connect(interaction.member.voice.channel);

    let result = await player.search(interaction.options.getString("search"), {
      requestedBy: interaction.user,
      searchEngine: QueryType.YOUTUBE_SEARCH,
    });

    const entry = queue.tasksQueue.acquire();
    await entry.getTask();

    let song = result.tracks[0];
    queue.addTrack(song);

    try {
        if(!queue.isPlaying()) {
     
          let exampleEmbed = messageBuilder(
            "#ffffff",
            song.title,
            song.url,
            "Now Playing...🎶",
            song.thumbnail,
            [
              { name: "노래 길이", value: song.duration, inline: true },
              { name: "요청자", value: userMention(interaction.user.id), inline: true },
              // { name: "대기 곡", value: client.playList.length + "곡", inline: true },
            ]
          );
          await interaction.reply({ embeds: [exampleEmbed] });
          queue.node.setVolume(100)
          await queue.node.play();
        }

    } catch (error) {
      console.log(error);
      queue.tasksQueue.release()
    }
    
  },
};
