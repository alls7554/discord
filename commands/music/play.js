const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
  userMention,
  EmbedBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} = require("discord.js");
const fs = require('node:fs')
const { messageBuilder } = require("../../embed");
const { QueryType, useMainPlayer } = require("discord-player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("유튜브 주소를 넣어주세요.")
    .addStringOption((option) =>
      option.setName("search").setDescription("유튜브 주소를 넣어주세요.").setRequired(true)
    ),
  async execute({ musicPlayer, client, interaction }) {
    const player = useMainPlayer();
    const queue = player.nodes.create(interaction.guildId);

    if (!queue.connection) queue.connect(interaction.member.voice.channel);

    let result = await player.search(interaction.options.getString("search"), {
      requestedBy: interaction.user,
      searchEngine: QueryType.YOUTUBE_SEARCH,
    });

    let song = result.tracks[0];

    try {
      if (!queue.isPlaying()) {
        const entry = queue.tasksQueue.acquire();
        await entry.getTask();

        queue.addTrack(song);

        await queue.node.play();

        const json = await fs.promises.readFile('setting.json', 'utf-8');
        queue.node.setVolume(Math.min(JSON.parse(json).volume, 100));

        const select = new StringSelectMenuBuilder()
          .setCustomId("queue")
          .setPlaceholder("다음곡 : 다음 곡이 존재하지 않습니다.")
          .addOptions(
            new StringSelectMenuOptionBuilder().setLabel("등록된 다음곡이 존재하지 않습니다.").setValue("noting")
          );
        const selectRow = new ActionRowBuilder().addComponents(select);

        let replyMessage = messageBuilder("#ffffff", song.title, song.url, "Now Playing...🎶", song.thumbnail, [
          { name: "노래 길이", value: song.duration, inline: true },
          { name: "볼륨", value: queue.node.volume.toString(), inline: true },
          { name: "요청자", value: userMention(interaction.user.id), inline: true },
          { name: "대기 곡", value: queue.tracks.toArray().length + "곡", inline: true },
        ]);

        // , components: [selectRow]
        const mesg = await interaction.reply({ embeds: [replyMessage] });
        musicPlayer.set(0, mesg);
      } else {
        queue.insertTrack(song);

        let current = queue.currentTrack;

        let editReplyMessage = messageBuilder(
          "#ffffff",
          current.title,
          current.url,
          "Now Playing...🎶",
          current.thumbnail.url,
          [
            { name: "노래 길이", value: current.duration, inline: true },
            { name: "볼륨", value: queue.node.volume.toString(), inline: true },
            { name: "요청자", value: userMention(current.requestedBy.id), inline: true },
            { name: "대기 곡", value: queue.tracks.toArray().length + "곡", inline: true },
          ]
        );

        // let select = new StringSelectMenuBuilder()
        //   .setCustomId("queue")
        //   .setPlaceholder("다음곡 : " + queue.tracks.toArray()[0].title)
        //   .addOptions(
        //     queue.tracks.toArray().map((track) => {
        //       new StringSelectMenuOptionBuilder()
        //         .setLabel(track.title)
        //         .setDescription(track.duration + " | " + track.author)
        //         .setValue("noting");
        //     })
        //   );
        // const selectRow = new ActionRowBuilder().addComponents(select);

        // , components: [selectRow]

        musicPlayer.get(0).edit({ embeds: [editReplyMessage] });

        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("#ffffff")
              .setDescription(song.title + "를 대기열에 추가했어요.")
              .setTimestamp(),
          ],
        });
      }
    } catch (error) {
      console.log(error);
      queue.tasksQueue.release();
    }
  },
};
