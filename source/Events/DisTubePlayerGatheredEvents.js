import config from "../Config/config.js";
import {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ComponentType,
  ApplicationCommandType,
  ButtonStyle,
  ApplicationCommandOptionType,
  Collection,
} from "discord.js";
import ms from "ms";
import { player } from "../Import/player.js";
import ytsr from "youtube-ext";
import shortNumber from "short-number";
const storedSongsIdArray = new Collection();
player.on("playSong", async (queue, song) => {
  var { name, uploader, views, formattedDuration } = song;
  const Formattedviews = shortNumber(views);
  const buttonsRow = new ActionRowBuilder()?.addComponents(
    new ButtonBuilder()
      .setCustomId("previous")
      .setLabel("Previous")
      .setStyle(ButtonStyle.Success),

    new ButtonBuilder()
      .setCustomId("pause_resume")
      .setLabel("Pause & Resume")
      .setStyle(ButtonStyle.Secondary),

    new ButtonBuilder()
      .setCustomId("stop")
      .setLabel("Stop")
      .setStyle(ButtonStyle.Danger),

    new ButtonBuilder()
      .setCustomId("next")
      .setLabel("Next")
      .setStyle(ButtonStyle.Primary)
  );
  const embed = new EmbedBuilder()
    .setAuthor({
      name: "Now Playing",
      iconURL:
        "https://cdn.discordapp.com/attachments/1011587737373122563/1017001796826300426/848586846748672031.gif",
    })
    .setTitle(`${name}`)
    .setURL(song.url)
    .setImage(song.thumbnail)
    .addFields([
      {
        name: `**Uploader:**`,
        value: `> [${song.uploader.name}](${song.uploader.url})`,
        inline: true,
      },
      {
        name: "**Duration**",
        value: `> ${song.formattedDuration}`,
        inline: true,
      },
      {
        name: "**Views**",
        value: `> ${Formattedviews}`,
        inline: true,
      },
    ])
    .setFooter({
      text: `Added by: ${song.user.username}`,
      iconURL: song?.user.displayAvatarURL(),
    })
    .setColor(config.mainColor);

  var msg = await song.metadata.interaction.followUp({
    embeds: [embed],
    components: [buttonsRow],
  });
  storedSongsIdArray.set(queue.textChannel.guildId, msg.id);
  const collector = await queue.textChannel.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: ms("3 minutes"),
  });
  collector.on("collect", async (button) => {
    await button.deferUpdate().catch((error_) => {
      return;
    });
    if (
      queue.textChannel.guild.members.me.voice.channelId &&
      button.member.voice.channelId !==
        queue.textChannel.guild.members.me.voice.channelId
    )
      return;
    if (!button.member.voice.channel) return;
    const getQueue = await player.getQueue(queue.textChannel.guildId);
    if (!getQueue) return;
    if (button.customId === "previous") {
      if (getQueue.previousSongs.length === 0)
        return button.followUp({
          embeds: [
            new EmbedBuilder()
              .setColor(config.errorColor)
              .setDescription(
                `> ${config.errorEmoji} | There is no stored previous songs.`
              ),
          ],
          ephemeral: true,
        });
      const previousSong = await player.previous(queue.textChannel.guildId);
      return button.followUp({
        content: `> ${config.successEmoji} | Now playing the previous song: **${previousSong.name}**`,
        ephemeral: true,
      });
    } else if (button.customId === "pause_resume") {
      if (getQueue.paused) {
        player.resume(queue.textChannel.guildId);
        return button.followUp({
          content: `> ${config.successEmoji} | The song is now resumed.`,
          ephemeral: true,
        });
      } else {
        player.pause(queue.textChannel.guildId);
        return button.followUp({
          content: `> ${config.successEmoji} | The song is now paused.`,
          ephemeral: true,
        });
      }
    } else if (button.customId === "stop") {
      await player.stop(queue.textChannel.guildId);
      collector.stop();
      if (player.options.leaveOnStop === true) {
        await player.voices.leave(queue.textChannel.guildId);
        return button.followUp({
          content: `> ${config.successEmoji} | Stopped playing the song & Left the voice channel.`,
          ephemeral: true,
        });
      } else {
        return button.followUp({
          content: `> ${config.successEmoji} | Stopped playing the song.`,
          ephemeral: true,
        });
      }
    } else if (button.customId === "next") {
      if (queue.songs.length === 1)
        return button.followUp({
          content: `> ${config.errorEmoji} | The queue doesn't have any songs queued.`,
          ephemeral: true,
        });
      const track_ = await player.skip(queue.textChannel.guildId);
      return button.followUp({
        content: `> ${config.successEmoji} | The song has been skipped to **${track_.name}**`,
        ephemeral: true,
      });
    }
  });
  collector.on("end", async () => {
    const disabledRow = new ActionRowBuilder()?.addComponents(
      new ButtonBuilder()
        .setCustomId("previous")
        .setDisabled(true)
        .setLabel("Previous")
        .setStyle(ButtonStyle.Success),

      new ButtonBuilder()
        .setCustomId("pause_resume")
        .setDisabled(true)
        .setLabel("Pause & Resume")
        .setStyle(ButtonStyle.Secondary),

      new ButtonBuilder()
        .setCustomId("stop")
        .setDisabled(true)
        .setLabel("Stop")
        .setStyle(ButtonStyle.Danger),

      new ButtonBuilder()
        .setDisabled(true)
        .setCustomId("next")
        .setLabel("Next")
        .setStyle(ButtonStyle.Primary)
    );
    var id_ = storedSongsIdArray.get(queue.textChannel.guildId);
    (await queue.textChannel.messages.fetch(id_)).edit({
      components: [disabledRow],
    });
  });
});
player.on("finishSong", async (currentQueue, nextSong) => {
  const disabledRow = new ActionRowBuilder()?.addComponents(
    new ButtonBuilder()
      .setCustomId("previous")
      .setDisabled(true)
      .setLabel("Previous")
      .setStyle(ButtonStyle.Success),

    new ButtonBuilder()
      .setCustomId("pause_resume")
      .setDisabled(true)
      .setLabel("Pause & Resume")
      .setStyle(ButtonStyle.Secondary),

    new ButtonBuilder()
      .setCustomId("stop")
      .setDisabled(true)
      .setLabel("Stop")
      .setStyle(ButtonStyle.Danger),

    new ButtonBuilder()
      .setDisabled(true)
      .setCustomId("next")
      .setLabel("Next")
      .setStyle(ButtonStyle.Primary)
  );
  const id_ = storedSongsIdArray.get(currentQueue.textChannel.guildId);
  await (
    await currentQueue.textChannel.messages.fetch(id_)
  ).edit({
    components: [disabledRow],
  });
});
player.on("addSong", async (queue, song) => {
  const FormattedViews = shortNumber(song.views);
  const embed = new EmbedBuilder()
    .setColor(config.mainColor)
    .setAuthor({
      name: "Queued",
      iconURL:
        "https://cdn.discordapp.com/attachments/1011587737373122563/1017045309395841084/output-onlinegiftools_3.gif",
    })
    .setThumbnail(song.thumbnail)
    .setTitle(song.name)
    .setURL(song.url)
    .setDescription(
      `**Views:** ${FormattedViews}\n**Duration:** ${song.formattedDuration}\n**Uploader:** [${song.uploader.name}](${song.uploader.url})`
    )
    .setFooter({
      text: `Requested by: ${song.user.username}`,
      iconURL: song.user.displayAvatarURL(),
    });
  if (!song.metadata.interaction) {
    return queue.textChannel.send({ embeds: [embed] });
  } else {
    return song.metadata.interaction.followUp({ embeds: [embed] });
  }
});

player.on("addList", async (queue, playlist) => {
  const embed = new EmbedBuilder()
    .setAuthor({
      name: "List Added",
      iconURL:
        "https://cdn.discordapp.com/attachments/1011587737373122563/1017047007971516476/938063486339141662.gif",
    })
    .setTitle(playlist.name)
    .setURL(playlist.url)
    .setImage(playlist.thumbnail)
    .addFields([
      {
        name: "**Duration:**",
        value: `> ${playlist.formattedDuration}`,
        inline: true,
      },
      {
        name: "**Songs:**",
        inline: true,
        value: `> ${playlist.songs.length}`,
      },
      {
        name: "**Source:**",
        inline: true,
        value: `> ${
          playlist.source.charAt(0).toUpperCase() +
          playlist.source.slice(1).toLowerCase()
        }`,
      },
    ])
    .setColor("#2C2F33")
    .setFooter({
      text: `Requested by: ${playlist.user.username}`,
      iconURL: playlist.user.displayAvatarURL(),
    });
  if (!playlist.metadata.interaction)
    return queue.textChannel.send({ embeds: [embed] });
  else return playlist.metadata.interaction.followUp({ embeds: [embed] });
});

player.on("error", async (textChannel, error) => {
  console.log(error);
});
