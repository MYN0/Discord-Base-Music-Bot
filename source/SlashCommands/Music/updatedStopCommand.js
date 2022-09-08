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
  name: "stop",
  description: "Stopped the current playing song.",
  voiceChannelOnly: true,
  coolDown: "1110",
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

    if (player.options.leaveOnStop === true) {
      await player.stop(interaction.guildId);
      await player.voices.leave(queue.textChannel.guildId);
      return interaction.reply({
        content: `> ${config.successEmoji} | Stopped playing the song & Left the voice channel.`,
        ephemeral: true,
      });
    } else {
      await player.stop(interaction.guildId);
      return interaction.reply({
        content: `> ${config.successEmoji} | Stopped playing the song.`,
        ephemeral: true,
      });
    }
  },
});
