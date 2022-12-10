require("dotenv").config();
const { token } = process.env;
const { Client, Collection} = require("discord.js");
const fs = require("fs");

const client = new Client({ intents: 32767 });


client.commands = new Collection();
client.buttons = new Collection();
client.times = new Collection();
client.commandArray = [];
const functionFolders = fs.readdirSync("./src/functions");
for (const folder of functionFolders) {
  const functionFiles = fs
    .readdirSync(`./src/functions/${folder}`)
    .filter((file) => file.endsWith(".js"));
  for (const file of functionFiles)
    require(`./functions/${folder}/${file}`)(client);
}
const timersFolders = fs.readdirSync("./src/timers");
for (const folder of timersFolders) {
  const functionFiles = fs
    .readdirSync(`./src/timers/${folder}`)
    .filter((file) => file.endsWith(".js"));
  for (const file of functionFiles)
    require(`./timers/${folder}/${file}`)(client);
}



client.handleEvents();
client.handleCommands();
client.handleComponents();
client.login(token);
