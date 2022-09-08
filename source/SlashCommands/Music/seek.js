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
  name: "forward",
  description: "A simple formatted command.",
  voiceChannelOnly: true,
  coolDown: "3000",
  category: "Music",
  options: [
    {
      name: "duration",
      description: "Specify the duration in seconds.",
      required: true,
      type: ApplicationCommandOptionType.Integer,
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
    const time = await interaction.options.getInteger("duration");
    const seekTime_ = queue.currentTime + time;
    const duration = queue.songs[0].duration;
    if (seekTime_ >= queue.songs[0].duration)
      return interaction.reply({
        content: `> The current playing song duration is **${queue.songs[0].formattedDuration}**`,
        ephemera: true,
      });
    await player.seek(interaction.guildId, seekTime_);
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(config.successEmbedColor)
          .setDescription(
            `> ${config.successEmoji} Seeked the track to **${time}** seconds`
          ),
      ],
    });
  },
});
