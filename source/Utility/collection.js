import { Collection } from "discord.js";
import { readdirSync } from "fs";
const SlashCommands = new Collection();
const syncedCategories = readdirSync("source/SlashCommands/");
const commands = new Collection();
const events = new Collection();
const aliases = new Collection();
export { events, SlashCommands, commands, aliases, syncedCategories };
