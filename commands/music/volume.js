const { SlashCommandBuilder, userMention } = require("discord.js");

const { useQueue } = require("discord-player");
const { messageBuilder } = require("../../embed");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("volume")
    .setDescription("Set Volume of mymy")
    .addIntegerOption((option) =>
      option.setName("volume").setDescription("1~100사이의 값을 입력하세요.").setRequired(true)
    ),
  async execute({ musicPlayer, client, interaction }) {
    const volume = interaction.options.getInteger("volume");
    const queue = useQueue(interaction.guild.id);

    try {
      queue.node.setVolume(volume);
      let current = queue.currentTrack;
      if (current) {
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
        musicPlayer.get(0).edit({ embeds: [editReplyMessage] });
      }
      await interaction.reply(`마이마이의 볼륨을 ${volume}으로 설정했어!`);
    } catch (error) {
      console.log(error);
    }
  },
};
