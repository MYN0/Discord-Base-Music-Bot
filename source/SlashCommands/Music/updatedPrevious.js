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
  name: "previous",
  description: "Adds the previous song to the queue.",
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
    if (queue.previousSongs.length === 0)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(config.errorColor)
            .setDescription(`> There are no previously played songs.`),
        ],
        ephemeral: true,
      });
    const song = await player.previous(interaction.guildId);
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(config.successEmbedColor)
          .setDescription(
            `> ${config.successEmoji} Now playing the previous song: **${song.name}**`
          ),
      ],
    });
  },
});
