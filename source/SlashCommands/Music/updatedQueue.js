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
import pagination from "../../Queue/index.js";
import { ApplicationCommand } from "../../Modules/Interaction.js";
export default new ApplicationCommand({
  name: "queue",
  description: "List all of the queued songs.",
  category: "Music",
  voiceChannelOnly: true,
  coolDown: "4300",
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
    const pagesNum = Math.ceil(queue.songs.length / 10);
    if (pagesNum === 0) pagesNum = 1;
    const qduration = queue.formattedDuration;
    const songStrings = [];
    for (let i = 1; i < queue.songs.length; i++) {
      const song = queue.songs[i];
      songStrings.push(`**${i})** [${song.name}](${song.url})`);
    }
    const pages = [];
    for (let i = 0; i < pagesNum; i++) {
      const str = songStrings.slice(i * 10, i * 10 + 10).join("\n");
      const embed = new EmbedBuilder()
        .setAuthor({
          name: client.user.username,
          iconURL: client.user.displayAvatarURL(),
        })
        .setThumbnail(queue.songs[0].thumbnail)
        .setColor(config.mainColor)
        .setDescription(
          `**Currently Playing:**\n${
            queue.songs[0]?.name
          }\n**Rest of the queue:**\n${
            str === "" ? "No songs in the queue." : str
          }`
        )
        .setThumbnail(queue.songs[0].thumbnail)
        .setFooter({
          text: `Page • ${i + 1}/${pagesNum} | ${
            queue.songs.length - 1
          } • Songs`,
          iconURL: interaction.member.displayAvatarURL(),
        });
      pages.push(embed);
    }
    if (pages.length == pagesNum && queue.songs.length > 10)
      return pagination(
        client,
        interaction,
        pages,
        60000,
        queue.songs.length - 1
      );
    else return interaction.followUp({ embeds: [pages[0]] });
  },
});
