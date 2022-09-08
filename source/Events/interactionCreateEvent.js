import {
  ApplicationCommandOptionType,
  CachedManager,
  InteractionType,
  EmbedBuilder,
  messageLink,
} from "discord.js";
import client from "../index.js";
import config from "../Config/config.js";
import { SlashCommands } from "../Utility/collection.js";

client.on("interactionCreate", async (interaction) => {
  if (interaction.type === InteractionType.ApplicationCommand) {
    const command = SlashCommands.get(interaction.commandName);
    if (!command)
      return interaction.reply({
        content: `An error has been occurred, try using this command a bit later.`,
        ephemeral: true,
      });
    const args = [];
    interaction.member = interaction.guild.members.cache.get(
      interaction.user.id
    );
    if (command?.voiceChannelOnly) {
      const voiceChannel = interaction.member.voice.channel;
      if (!voiceChannel)
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `> ${config.errorEmoji} | You are not connected to a voice channel.`
              )
              .setColor(config.errorColor),
          ],
          ephemeral: true ? false : true,
        });
      if (
        interaction.guild.members.me.voice.channel &&
        interaction.member.voice.channelId !==
          interaction.guild.members.me.voice.channelId
      )
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `> ${config.errorEmoji} | You need to be in the same voice channel as me. You are connected to a different voice channel: ${interaction.member.voice.channel}`
              )
              .setColor(config.errorColor),
          ],
          ephemeral: true ? false : true,
        });
    }
    for (let option of interaction.options.data) {
      if (option.type === ApplicationCommandOptionType.Subcommand) {
        if (option.name) args.push(option.name);
        option.options?.forEach((x) => {
          if (x.value) args.push(x.value);
        });
      } else if (option.value) args.push(option.value);
    }
    await command.run({ client, interaction, args });
  }
});
