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
import { player } from "../../import/player.js";
import { ApplicationCommand } from "../../Modules/Interaction.js";
export default new ApplicationCommand({
  name: "connect",
  description: "Joins your voice channel",
  coolDown: "3000",
  category: "Music",
  voiceChannelOnly: true,
  run: async ({ client, interaction, args }) => {
    if (
      interaction.guild.members.me.voice.channelId ===
      interaction.member.voice.channelId
    )
      return interaction.reply({
        content: `> The bot is already connected to your voice channel.`,
      });
    await player.voices.join(interaction.member.voice.channel);
    return interaction.reply({
      content: `> ${config.successEmoji} Connected to your voice channel.`,
      ephemeral: true,
    });
  },
});
