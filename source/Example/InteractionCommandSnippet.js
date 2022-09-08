import config from "../../Config/config.js";
import {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ComponentType,
  ApplicationCommandType,
  ButtonStyle,
  ApplicationCommandOptionType,
} from "discord.js";
import { player } from "../../import/player.js";
import { ApplicationCommand } from "../../Modules/Interaction.js";
export default new ApplicationCommand({
  name: "",
  description: "",
  coolDown: "",
  options: [
    {
      name: "",
      description: "",
      type: ApplicationCommandOptionType,
      required: false,
    },
  ],
  run: async ({ client, interaction, args }) => {},
});
