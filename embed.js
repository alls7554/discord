// at the top of your file
const { EmbedBuilder } = require("discord.js");

function messageBuilder(color, title, url, desc, thumbnail, fields = null) {
  return new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setURL(url)
    .setDescription(desc)
    .setThumbnail(thumbnail)
    .addFields(fields)
    .setTimestamp();
}

module.exports = { messageBuilder };
