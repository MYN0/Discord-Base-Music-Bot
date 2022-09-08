import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
} from "discord.js";
/**
 * @param {*} client
 * @param {ChatInputCommandInteraction} interaction
 * @param {*} pages
 * @param {*} timeout
 * @param {*} queueLength
 * @returns
 */

export default async (client, interaction, pages, timeout, queueLength) => {
  if (!interaction && !interaction.channel)
    throw new Error("Channel is inaccessible.");
  if (!pages) throw new Error("Pages are not given.");
  const row1 = new ButtonBuilder()
    .setCustomId("backbutton")
    // .setLabel('⬅')
    .setEmoji(`◀️`)
    .setStyle(ButtonStyle.Primary);
  const row2 = new ButtonBuilder()
    .setCustomId("nextButton")
    // .setLabel('➡')
    .setEmoji(`▶️`)
    .setStyle(ButtonStyle.Primary);
  const row = new ActionRowBuilder().addComponents(row1, row2);

  let page = 0;
  const curPage = await interaction.followUp({
    embeds: [
      pages[page].setFooter({
        text: `Page No: ${page + 1}/${pages.length} | ${queueLength} • Songs`,
      }),
    ],
    components: [row],
    allowedMentions: { repliedUser: false },
  });
  if (pages.length == 0) return;

  const collector = await curPage.createMessageComponentCollector({
    time: timeout,
  });

  collector.on("collect", async (i) => {
    await i.deferUpdate().catch((error) => {});

    if (interaction.member.id !== i.user.id) return;

    if (i.customId === "backbutton") {
      page = page > 0 ? --page : pages.length - 1;
    } else if (i.customId === "nextButton") {
      page = page + 1 < pages.length ? ++page : 0;
    }
    curPage.edit({
      embeds: [
        pages[page].setFooter({
          text: `Page No: ${page + 1}/${pages.length} | ${queueLength} • Songs`,
        }),
      ],
      components: [row],
    });
  });

  collector.on("end", async () => {
    const disAbled = new ActionRowBuilder().addComponents(
      row1.setDisabled(true),
      row2.setDisabled(true)
    );
    curPage.edit({
      embeds: [
        pages[page].setFooter({
          text: `Page No: ${page + 1}/${pages.length} | ${queueLength} • Songs`,
        }),
      ],
      components: [disAbled],
    });
  });

  return curPage;
};
