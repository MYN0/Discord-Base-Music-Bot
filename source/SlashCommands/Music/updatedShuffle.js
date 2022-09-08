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
  name: "shuffle",
  description: "Shuffles the queue.",
  voiceChannelOnly: true,
  coolDown: "5000",
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

    if (queue.songs.length === 1)
      return interaction.reply({
        content: `> The queue doesn't have that much songs to be shuffled.`,
        ephemeral: true,
      });
    await player.shuffle(interaction.guildId);
    return interaction.reply({
      content: `> ${config.successEmoji} The queue is now shuffled.`,
    });
  },
});
