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
  name: "disconnect",
  description: "Leaves your voice channel",
  coolDown: "3000",
  category: "Music",
  voiceChannelOnly: true,
  run: async ({ client, interaction, args }) => {
    const gettingVoiceConnection = await player.voices.get(interaction.guildId);
    if (!gettingVoiceConnection)
      return interaction.reply({
        content: `> The bot is not connected to your voice channel.`,
      });
    await player.voices.leave(interaction.member.voice.channel);
    return interaction.reply({
      content: `> ${config.successEmoji} Disconnected from your voice channel`,
    });
  },
});
