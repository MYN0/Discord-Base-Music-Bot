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
import { player } from "../../Import/player.js";
import { ApplicationCommand } from "../../Modules/Interaction.js";
export default new ApplicationCommand({
  name: "autoplay",
  description: "Toggles the autoplay mode.",
  voiceChannelOnly: true,
  coolDown: "1000",
  options: [
    {
      name: "mode",
      description: "Specify the autoplay mode.",
      type: ApplicationCommandOptionType.String,
      choices: [
        {
          name: "enable",
          value: "yes",
        },
        {
          name: "disable",
          value: "no",
        },
      ],
      required: true,
    },
  ],
  category: "Music",
  run: async ({ client, interaction, args }) => {
    const queue = await player.getQueue(interaction.guildId);
    if (!queue)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(config.errorColor)
            .setDescription(`> There's nothing playing in the queue.`),
        ],
        ephemeral: true,
      });

    const autoplayMode = await interaction.options.getString("mode");
    if (autoplayMode === "yes") {
      if (queue.autoplay)
        return interaction.reply({
          content: `> The autoplay mode is already enabled.`,
          ephemeral: true,
        });
      else await player.toggleAutoplay(interaction.guildId);
      return interaction.reply({
        content: `> ${config.successEmoji} The autoplay mode is now enabled.`,
      });
    } else {
      if (!queue.autoplay)
        return interaction.reply({
          content: `> The autoplay mode is not enabled.`,
          ephemeral: true,
        });
      else await player.toggleAutoplay(interaction.guildId);
      return interaction.reply({
        content: `> ${config.successEmoji} The autoplay mode is now disabled.`,
      });
    }
  },
});
