const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, userMention } = require("discord.js");

const { messageBuilder } = require("../../embed");
const { QueryType, useMainPlayer } = require("discord-player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("노래")
    .setDescription("Insert Only Youtube URL")
    .addStringOption((option) =>
      option.setName("search").setDescription("유튜브 주소를 넣어주세요.").setRequired(true)
    ),
  async execute({ client, interaction }) {
    const player = useMainPlayer();
    const queue = player.nodes.create(interaction.guildId);

    if (!queue.connection) queue.connect(interaction.member.voice.channel);

    let result = await player.search(interaction.options.getString("search"), {
      requestedBy: interaction.user,
      searchEngine: QueryType.YOUTUBE_SEARCH,
    });

    let song = result.tracks[0];

    const mymy = new Map();

    //PLAY COMMAND
    // if (options === 'play') {
    //  (...)
    //  interaction.editReply({embeds: [PlayEmbed]})
    //  mymy.set(interaction.member.id, [interaction.channel.id, interaction.fetchReply().id])
    // }

    // //STOP COMMAND
    // if (options === 'stop') {
    //  (...)
    //  let channel = client.channels.cache.get(mymy[interaction.member.id].0);
    //  // Fetch the messages before we can access any of them
    //  channel.messages.fetch();
    //  channel.messages.cache.get(mymy[interaction.member.id].1).edit({embeds: [EndEmbed]})
    // }

    try {
      if (!queue.isPlaying()) {
        const entry = queue.tasksQueue.acquire();
        await entry.getTask();
        queue.addTrack(song);
        let replyMessage = messageBuilder("#ffffff", song.title, song.url, "Now Playing...🎶", song.thumbnail, [
          { name: "노래 길이", value: song.duration, inline: true },
          { name: "볼륨", value: queue.node.volume.toString(), inline: true },
          { name: "요청자", value: userMention(interaction.user.id), inline: true },
          { name: "대기 곡", value: queue.tracks.toArray().length - 1 + "곡", inline: true },
        ]);

        queue.node.setVolume(100);
        await queue.node.play();
        await interaction.editReply({ embeds: [replyMessage] });
      } else {
        let current = queue.currentTrack;
        let replyMessage = messageBuilder(
          "#ffffff",
          current.title,
          current.url,
          "Now Playing...🎶",
          current.thumbnail.url,
          [
            { name: "노래 길이", value: current.duration, inline: true },
            { name: "볼륨", value: queue.node.volume.toString(), inline: true },
            { name: "요청자", value: userMention(current.requestedBy.id), inline: true },
            { name: "대기 곡", value: queue.tracks.toArray().length - 1 + "곡", inline: true },
          ]
        );

        queue.insertTrack(song);
        await interaction.edit({ embeds: [replyMessage] });
      }
    } catch (error) {
      console.log(error);
      queue.tasksQueue.release();
    }
  },
};
