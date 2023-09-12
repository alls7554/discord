const { SlashCommandBuilder, userMention } = require("discord.js");

const { usePlayer } = require("discord-player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("volume")
    .setDescription("Set Volume of mymy")
    .addIntegerOption((option) =>
      option.setName("volume").setDescription("1~100사이의 값을 입력하세요.").setRequired(true)
    ),
  async execute({ client, interaction }) {
    const player = usePlayer(interaction.guild.id);
    const volume = interaction.options.getInteger("volume");

    try {
      player.setVolume(volume);
      interaction.reply(`마이마이의 볼륨을 ${volume}으로 설정했어!`);
    } catch (error) {
      console.log(error);
    }
  },
};
