import config from "../../Config/config.js";
import {
  EmbedBuilder,
  ButtonBuilder,
  SelectMenuBuilder,
  ActionRowBuilder,
  ComponentType,
  ApplicationCommandType,
  ButtonStyle,
  ApplicationCommandOptionType,
} from "discord.js";
import { player } from "../../import/player.js";
import { SlashCommands, syncedCategories } from "../../Utility/collection.js";
import { ApplicationCommand } from "../../Modules/Interaction.js";
import ms from "ms";

export default new ApplicationCommand({
  name: "help",
  description: "Displays the help menu.",
  coolDown: "5400",
  category: "Information",
  run: async ({ client, interaction, args }) => {
    await interaction.deferReply();
    const formattedOptions = syncedCategories.map((category) => {
      return {
        label: `${category}`,
        value: `${category}`,
        description: `Displays all of the commands of: ${category}`,
      };
    });
    const row = new ActionRowBuilder().addComponents(
      new SelectMenuBuilder({
        options: formattedOptions,
        placeholder: "Select a category",
        custom_id: "help",
      })
    );
    const cleanEmbed = new EmbedBuilder().setDescription(
      `Select a catgeory to get help on.`
    );

    const msg = await interaction.followUp({
      embeds: [cleanEmbed],
      components: [row],
    });
    const collector = await interaction.channel.createMessageComponentCollector(
      {
        componentType: ComponentType.SelectMenu,
        time: ms("2m"),
      }
    );
    collector.on("collect", async (menu) => {
      await menu.deferUpdate();
      if (menu.member.id !== interaction.member.id) return;
      let [directories] = menu.values;
      const allCommands = SlashCommands.filter(
        (y) => y.category === directories
      )
        .map((x) => {
          return `*\`${x.name}\`*`;
        })
        .join(", ");
      const menuEmbed = new EmbedBuilder()
        .setAuthor({
          name: client.user.username,
          iconURL: client.user.displayAvatarURL(),
        })
        .setColor(config.mainColor)
        .setTitle(
          `${directories} - ${
            SlashCommands.filter((x) => x.category === directories).size
          }`
        )
        .setDescription(`> ${allCommands}`);

      return interaction.editReply({ embeds: [menuEmbed] });
    });

    collector.on("end'", async (collected, reason) => {
      const formattedOptions = syncedCategories.map((category) => {
        return {
          label: `${category}`,
          value: `${category}`,
          description: `Displays all of the commands of: ${category}`,
        };
      });
      const disabledRow = new ActionRowBuilder().addComponents(
        new SelectMenuBuilder({
          options: formattedOptions,
          placeholder: "Select a category",
          custom_id: "disabled_help",
        })
      );
      return interaction
        .editReply({
          components: [disabledRow],
        })
        .catch((error) => {});
    });
  },
});
