import config from "../../Config/config.js";
import {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ComponentType,
  ApplicationCommandType,
  ButtonStyle,
  ApplicationCommandOptionType,
  SelectMenuBuilder,
} from "discord.js";
import extractor from "youtube-ext";
import ytsr from "@distube/ytsr";
import { player } from "../../import/player.js";
import { ApplicationCommand } from "../../Modules/Interaction.js";
import ms from "ms";
export default new ApplicationCommand({
  name: "search",
  description: "Searches a song.",
  coolDown: "",
  options: [
    {
      name: "query",
      description: "Specify a query to look on.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  run: async ({ client, interaction, args }) => {
    await interaction.deferReply();
    const message = await interaction.followUp({
      content: `🔎 Searching...`,
    });
    const query = await interaction.options.getString("query");
    const request = await ytsr(query, {
      limit: 25,
    });

    const formattedResponse = request.items.map((song) => {
      return {
        label: song.author.name,
        description: song.name.slice(0, 50),
        value: song.url,
      };
    });
    const row = new ActionRowBuilder().addComponents(
      new SelectMenuBuilder({
        placeholder: "Select a value",
        options: formattedResponse,
        custom_id: "response",
      })
    );
    const cleanEmbed = new EmbedBuilder()
      .setTitle("Total Results - **(25)**")
      .setDescription(
        `Here are the **25** results that found for query **${query}** `
      );
    interaction.followUp({ embeds: [cleanEmbed], components: [row] });
    const collector = await interaction.channel.createMessageComponentCollector(
      {
        componentType: ComponentType.SelectMenu,
        time: ms("1 minutes"),
      }
    );
    collector.on("collect", async (menu) => {
      await menu.deferUpdate();
      if (menu.member.id !== interaction.member.id) return;
      if (menu.customId === "response") {
        const req = await await extractor.videoInfo(menu.values[0]);
        const playRow = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setStyle(ButtonStyle.Primary)
            .setLabel("Play?")
            .setCustomId("play")
        );
        const formattedCleanOneCutResponse = new EmbedBuilder()
          .setColor(config.mainColor)
          .setThumbnail(req.thumbnails[0].url)
          .setTitle(req.title)
          .setURL(req.url)
          .setDescription(
            `**Duration:** ${req.duration.lengthSec}\n**Uploaded:** ${req.uploaded.text}\n**Catgeory:** ${req.category}`
          );
        menu.followUp({
          ephemeral: true,
          embeds: [formattedCleanOneCutResponse],
          components: [playRow],
        });
        collector.stop("fullFill");
        const playCollector =
          await interaction.channel.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: ms("30s"),
          });
        playCollector.on("collect", async (button) => {
          await button.deferUpdate();
          if (button.member.id !== interaction.member.id) return;
          if (!button.member.voice.channel)
            return button.followUp({
              ephemeral: true,
              content: `> You need to join a voice channel.`,
            });
          if (
            interaction.guild.members.me.voice.channel &&
            interaction.member.voice.channelId !==
              interaction.guild.members.me.voice.channelId
          )
            return interaction.followUp({
              ephemeral: true,
              content: `> You need to be in a same voice channel as me.`,
            });
          if (button.customId === "play") {
            await player.voices.join(interaction.member.voice.channel);
            await player.play(button.member.voice.channel, menu.values[0], {
              member: interaction.member,
              textChannel: interaction.channel,
              interaction,
              metadata: { interaction: interaction },
            });
            playCollector.stop("end");
          }
        });
      }
    });
    collector.on("end", async () => {
      const formattedResponse = request.items.map((song) => {
        return {
          label: song.author.name,
          description: song.name.slice(0, 50),
          value: song.url,
        };
      });
      const disabledRow = new ActionRowBuilder().addComponents(
        new SelectMenuBuilder({
          placeholder: "Select a value",
          options: formattedResponse,
          disabled: true,
          custom_id: "disabled_response",
        })
      );

      return interaction.editReply({
        components: [disabledRow],
      });
    });
  },
});
