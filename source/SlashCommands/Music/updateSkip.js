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
  name: "skip",
  category: "Music",
  description: "Skips the current playing song.",
  voiceChannelOnly: true,
  coolDown: "4300",
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
    if (queue.songs.length === 0)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(config.errorColor)
            .setDescription(`> There are no previously played songs.`),
        ],
        ephemeral: true,
      });
    const song = await player.skip(interaction.guildId);
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(config.successEmbedColor)
          .setDescription(
            `> ${config.successEmoji} Skipped the track to: **${song.name}**`
          ),
      ],
    });
  },
});
