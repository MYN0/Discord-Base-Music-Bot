import client from "../index.js";
import config from "../Config/config.js";
import { ActivityType } from "discord.js";
import { commands, events, SlashCommands } from "../Utility/collection.js";
client.on("ready", async () => {
  client.user.setStatus("online");
  client.user.setActivity({
    name: `Type ${config.prefix}help or /help to get the help menu`,
    type: ActivityType.Playing,
  });
  console.log(
    `BOT: ${client.user.username} is now up\nSlashCommands: ${SlashCommands.size}\nMessageCommands: ${commands.size}`
  );
});
