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
import shortNumber from "short-number";
import { player } from "../../Import/player.js";
import { ApplicationCommand } from "../../Modules/Interaction.js";
export default new ApplicationCommand({
  name: "nowplaying",
  description: "Shows information about the current playing song.",
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
    await interaction.deferReply();
    const song = queue.songs[0];
    const views = shortNumber(song.views);
    const likes = shortNumber(song.likes);
    const embed = new EmbedBuilder()
      .setAuthor({
        name: `${queue.playing ? "Now Playing" : "Paused Song"}`,
        iconURL: `https://cdn.discordapp.com/emojis/741605543046807626.gif`,
      })
      .setTitle(song.name)
      .setURL(song.url)
      .setThumbnail(song.thumbnail)
      .addFields([
        {
          name: "**Uploader:**",
          value: `${song.uploader.name}`,
          inline: true,
        },
        {
          name: "**Volume:**",
          inline: true,
          value: `${queue.volume}%`,
        },
        {
          name: "**Views:**",
          inline: true,
          value: `${views}`,
        },
        {
          name: "**Likes:**",
          inline: true,
          value: `${likes}`,
        },
        {
          name: "**Requestor:**",
          value: `${song.user.username}`,
          inline: true,
        },
        {
          name: "**Duration:**",
          inline: true,
          value: `${queue.currentTime}/${song.formattedDuration}`,
        },
      ]);
    return interaction.followUp({
      embeds: [embed],
    });
  },
});
