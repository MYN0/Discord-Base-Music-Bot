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
  name: "jump",
  description: "Jump on a song.",
  voiceChannelOnly: true,
  coolDown: "4300",
  category: "Music",
  options: [
    {
      name: "value",
      description: `Specify a song to jump on.`,
      type: ApplicationCommandOptionType.Integer,
      required: true,
    },
  ],
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
    const number = await interaction.options.getInteger("value");
    if (number > queue.songs.length - 1)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `> The queue only have **${
                queue.songs.length - 1
              }** stored songs.`
            )
            .setColor(config.errorColor),
        ],
      });
    const jump = await player.jump(interaction.guildId, number);
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription(
            `> ${config.successEmoji} Jumped on the track: **${jump.name}**`
          )
          .setColor(config.successEmbedColor),
      ],
    });
  },
});
