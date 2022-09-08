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
  name: "volume",
  description: "Displays & Changes the player volume.",
  voiceChannelOnly: true,
  category: "Music",
  coolDown: "4300",
  options: [
    {
      name: "value",
      description: "Specify the volume %",
      type: ApplicationCommandOptionType.Integer,
      required: false,
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
    const volume = await interaction.options.getInteger("value");
    if (!volume)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(config.mainColor)
            .setDescription(
              `> The current volume of the player is **${queue.volume}%%**`
            ),
        ],
      });
    if (volume < 10)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(`> The volume cannot be lower than **10%**`)
            .setColor(config.errorColor),
        ],
        ephemeral: true,
      });
    await player.setVolume(interaction.guildId, volume);
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription(
            `> ${config.successEmoji} The volume is now **${volume}%**`
          )
          .setColor(config.mainColor),
      ],
    });
  },
});
