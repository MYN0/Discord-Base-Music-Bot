import config from "../../Config/config.js";
import {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ComponentType,
  ButtonStyle,
} from "discord.js";
import { player } from "../../import/player.js";
import { Command } from "../../Modules/index.js";

export default new Command({
  name: "",
  description: "",
  aliases: [],
  category: "",
  run: async ({ client, message, args }) => {
    // Main execution.
  },
});
