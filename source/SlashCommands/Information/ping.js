import config from "../../Config/config.js";
import {
  EmbedBuilder,
  ButtonBuilder,
  SelectMenuBuilder,
  ActionRowBuilder,
  ComponentType,
  ApplicationCommandType,
  ButtonStyle,
  ApplicationCommandOptionType,
} from "discord.js";
import { player } from "../../import/player.js";
import { SlashCommands, syncedCategories } from "../../Utility/collection.js";
import { ApplicationCommand } from "../../Modules/Interaction.js";
import ms from "ms";

export default new ApplicationCommand({
  name: "ping",
  description: "Pong.",
  coolDown: "5400",
  category: "Information",
  run: async ({ client, interaction, args }) => {
    return interaction.reply({
      content: `🏓 | Pong - **${client.ws.ping}**`,
    });
  },
});
