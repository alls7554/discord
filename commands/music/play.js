const ytdldc = require("ytdl-core-discord");
const ytdl = require("ytdl-core");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, userMention } = require("discord.js");
const { joinVoiceChannel, createAudioResource, getVoiceConnection, AudioPlayerStatus } = require("@discordjs/voice");

const { messageBuilder } = require("../../embed");
const { useQueue, QueryType, useMainPlayer, Player } = require("discord-player");
const { YouTubeExtractor } = require("@discord-player/extractor");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Insert Only Youtube URL")
    .addStringOption((option) => option.setName("search").setDescription("The input to echo back").setRequired(true)),
  async execute({ client, interaction }) {
    // if (interaction.user.bot) {
    //   interaction.reply("Bots cannot use this bot.");
    // }
    // if (interaction.member.voice.channel.joinable) {
    //   client.player.on("error", (error) => {
    //     console.error("Player ERROR!!" + error);
    //   });
    //   client.player.on(AudioPlayerStatus.Idle, async () => {
    //     console.log("Idle");
    //     if (client.playList.length > 0) {
    //       let resource = createAudioResource(await ytdldc(client.playList.unshift()), {
    //         type: "opus",
    //       });
    //       client.player.play(resource);
    //     }
    //   });
    //   client.player.on(AudioPlayerStatus.Buffering, () => {
    //     console.log("Buffering");
    //     // playList.push(interaction.options.getString("search"));
    //   });
    //   client.player.on(AudioPlayerStatus.Playing, () => {
    //     console.log("Playing");
    //     client.playList.push(interaction.options.getString("search"));
    //     console.log(client.playList);
    //   });
    //   client.player.on(AudioPlayerStatus.Paused, () => {
    //     console.log("Paused");
    //   });
    //   client.player.on(AudioPlayerStatus.AutoPaused, () => {
    //     console.log("AutoPaused");
    //   });
    //
    //   let { videoDetails } = await ytdl.getInfo(interaction.options.getString("search"));
    //   let resource = createAudioResource(await ytdldc(interaction.options.getString("search")), {
    //     type: "opus",
    //   });
    //   client.player.play(resource);
    //   // client.playList.push(interaction.options.getString("search"));
    //   const connection = joinVoiceChannel({
    //     channelId: interaction.channelId,
    //     guildId: interaction.guildId,
    //     adapterCreator: interaction.guild.voiceAdapterCreator,
    //   });
    //   connection.subscribe(client.player);
    // let videoLength =
    //   Math.floor(videoDetails.lengthSeconds / 3600) +
    //   ":" +
    //   Math.floor(((videoDetails.lengthSeconds / 3600) % 1) * 60) +
    //   ":" +
    //   Math.floor(((((videoDetails.lengthSeconds / 3600) % 1) * 60) % 1) * 60);
    // let exampleEmbed = messageBuilder(
    //   "#ffffff",
    //   videoDetails.title,
    //   videoDetails.video_url,
    //   "Now Playing...🎶",
    //   videoDetails.thumbnails[0].url,
    //   [
    //     { name: "노래 길이", value: videoLength, inline: true },
    //     { name: "요청자", value: userMention(interaction.user.id), inline: true },
    //     { name: "대기 곡", value: client.playList.length + "곡", inline: true },
    //   ]
    // );
    // await interaction.reply({ embeds: [exampleEmbed] });

    const player = useMainPlayer();
    const queue = player.nodes.create(interaction.guildId);
    queue.connect(interaction.member.voice.channel);

    let test = await player.search(interaction.options.getString("search"), {
      requestedBy: interaction.user,
      searchEngine: QueryType.YOUTUBE_SEARCH,
    });
    let song = test.tracks[0];
    await queue.addTrack(song);
    await queue.play();
  },
};
