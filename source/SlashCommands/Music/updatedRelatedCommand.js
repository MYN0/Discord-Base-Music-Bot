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
  name: "addrelated",
  description: "Adds a related track to the current one that's playing.",
  voiceChannelOnly: true,
  category: "Music",
  coolDown: "8222",
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

    const relatedTrack = await player.addRelatedSong(interaction.guildId);
    return interaction.reply({
      content: `> ${config.successEmoji} Added **${relatedTrack.name}** to the queue.`,
    });
  },
});
