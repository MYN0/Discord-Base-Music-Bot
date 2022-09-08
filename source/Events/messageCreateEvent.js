import client from "../index.js";
import config from "../Config/config.js";
import { commands, aliases } from "../Utility/collection.js";
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;
  if (!message.content.startsWith(config.prefix)) return;
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();
  if (cmd.length == 0) return;
  let command =
    (await commands.get(cmd.toLowerCase())) ||
    commands.find((c) => c.aliases.includes(cmd.toLowerCase()));
  if (!command) return;
  await command.run({ client, message, args });
});
