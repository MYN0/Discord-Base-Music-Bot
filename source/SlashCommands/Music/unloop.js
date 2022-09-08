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
  name: "unloop",
  description: "Removes the song from loop.",
  voiceChannelOnly: true,
  coolDown: "4300",
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

    if (queue.repeatMode !== 1)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(`> The song is not on a loop.`)
            .setColor(config.errorColor),
        ],
        ephemeral: true,
      });
    await player.setRepeatMode(interaction.guildId, 0);
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription(
            `> ${config.successEmoji} The song is now removed from loop.`
          )
          .setColor(config.successEmbedColor),
      ],
    });
  },
});
