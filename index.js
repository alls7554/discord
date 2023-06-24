const { Client, GatewayIntentBits } = require("discord.js");
const Config = require("./config.json");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.login(Config.token);
