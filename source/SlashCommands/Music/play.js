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
  name: "play",
  description: "Plays a song.",
  voiceChannelOnly: true,
  coolDown: "4300",
  category: "Music",
  options: [
    {
      name: "song",
      description: "Specify a song by it's name or by it's url.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  run: async ({ client, interaction, args }) => {
    const songName = await interaction.options.getString("song");
    await interaction.deferReply();
    await player.voices.join(interaction.member.voice.channel);
    await player.play(interaction.member.voice.channel, songName, {
      member: interaction.member,
      textChannel: interaction.channel,
      interaction,
      metadata: { interaction: interaction },
    });
  },
});
