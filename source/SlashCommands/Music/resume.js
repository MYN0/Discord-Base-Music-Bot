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
  name: "resume",
  description: "Resumes the current paused song.",
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
    if (!queue?.paused)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(`> The song is not paused.`)
            .setColor(config.errorColor),
        ],
        ephemeral: true,
      });
    await player.resume(interaction.guildId);
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(config.successEmbedColor)
          .setDescription(`> ${config.successEmoji} Resumed the song.`),
      ],
      ephemeral: true,
    });
  },
});
