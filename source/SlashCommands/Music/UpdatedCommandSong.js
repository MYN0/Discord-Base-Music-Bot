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
  name: "save",
  description: "Saves the current playing song.",
  voiceChannelOnly: true,
  coolDown: "7000",
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
    await interaction.deferReply();
    const embed = new EmbedBuilder()
      .setThumbnail(queue.songs[0].thumbnail)
      .setColor(config.mainColor)
      .setDescription(
        `**__Information:__**\n**Name:** ${queue.songs[0].name}\n**Duration:** ${queue.songs[0].formattedDuration}\n**Uploader:** [${queue.songs[0].uploader.name}](${queue.songs[0].uploader.url})`
      );
    interaction.followUp({
      content: `> Check your DMS`,
    });
    const dmMessage = await interaction.member
      .send({
        content: "Song Saved!",
        embeds: [embed],
      })
      .catch((error) => {
        return interaction.channel.send({
          content: `> There was en error occurred while sending the message to your DMS ${interaction.member}`,
        });
      });
  },
});
