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
  name: "filter",
  description: "A testing Command for filters.",
  voiceChannelOnly: true,
  coolDown: "5100",
  category: "Music",
  options: [
    {
      name: "input",
      description: "Select a filter to apply.",
      required: true,
      type: ApplicationCommandOptionType.String,
      choices: [
        {
          name: "8D",
          value: "apulsator=hz=0.09",
        },
        {
          name: "bassboost",
          value: "bass=g=20:f=110:w=0.3",
        },
        {
          name: "fadein",
          value: "afade=t=in:ss=0:d=10",
        },
        {
          name: "karaoke",
          value: "stereotools=mlev=0.03",
        },

        {
          name: "nightcore",
          value: "aresample=48000,asetrate=48000*1.25",
        },
        {
          name: "Slowed Reverb",
          value: "aresample=48000,asetrate=48000*0.8",
        },
        {
          name: "mcompand",
          value: "mcompand",
        },
        {
          name: "reverse",
          value: "areverse",
        },
        {
          name: "Remove filter",
          value: "0",
        },
      ],
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

    const filteredArray = [
      {
        name: "8D",
        value: "apulsator=hz=0.09",
      },
      {
        name: "bassboost",
        value: "bass=g=20:f=110:w=0.3",
      },
      {
        name: "fadein",
        value: "afade=t=in:ss=0:d=10",
      },
      {
        name: "karaoke",
        value: "stereotools=mlev=0.03",
      },

      {
        name: "nightcore",
        value: "aresample=48000,asetrate=48000*1.25",
      },
      {
        name: "Slowed Reverb",
        value: "aresample=48000,asetrate=48000*0.8",
      },
      {
        name: "mcompand",
        value: "mcompand",
      },
      {
        name: "reverse",
        value: "areverse",
      },
      {
        name: "remove filter",
        value: "0",
      },
    ];
    const filter = await interaction.options.getString("input");

    if (filter === "0") {
      await queue.filters.clear();
      return interaction.reply({
        content: `> ${config.successEmoji} Cleared all the filters.`,
      });
    }
    if (queue.filters.size === 1)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `> You already have a applied filter. You cannot apply 2 filters at once.`
            )
            .setColor(config?.errorColor),
        ],
        ephemeral: true,
      });
    const essentialArray = filteredArray?.filter((input_) => {
      return input_.value === filter;
    });
    var declaredFilter = await queue.filters.add({
      name: essentialArray[0]?.name,
      value: essentialArray[0].value,
    });
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(config.successEmbedColor)
          .setDescription(
            `> ${config.successEmoji} Applied the filter: **${essentialArray[0].name}**`
          ),
      ],
    });
  },
});
