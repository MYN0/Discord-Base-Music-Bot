import { events, commands, SlashCommands } from "../Utility/collection.js";
import { readdirSync } from "fs";
import client from "../index.js";
import { SlashCommandAssertions } from "discord.js";
import mongoose from "mongoose";
import config from "../config/config.js";

class Handler {
  deploy() {
    // Registering slashCommands
    let arrayOfApplicationCommands = [];
    readdirSync("source/SlashCommands").forEach(async (directory) => {
      const slashCommands = readdirSync(
        `source/SlashCommands/${directory}`
      ).filter((file) => file?.endsWith(".js"));
      for (let cmd of slashCommands) {
        const temporaryCommand = await import(
          `../SlashCommands/${directory}/${cmd}`
        );
        const deployingCommand = temporaryCommand.default;
        if (deployingCommand.name) {
          SlashCommands?.set(deployingCommand.name, deployingCommand);
          arrayOfApplicationCommands.push(deployingCommand);
        } else {
          console.log("The command isn't ready.");
        }
      }
    });
    client.on("ready", async () => {
      // I want to register the commands for a single guild so i'm using this
      await client.guilds.cache
        .get("REPLACE WITH YOUR GUILD ID")
        .commands.set(arrayOfApplicationCommands);

      // const connection = await mongoose.connect(config.mongooseConnectionURI);
      // if (!connection) return;
      // console.log("Connected to the Database: MongoDB");
    });

    //   Events
    readdirSync("source/Events/").forEach(async (file) => {
      const eventFiles = readdirSync("source/Events/").filter((f) =>
        f?.endsWith(".js")
      );
      for (let files of eventFiles) {
        let request = await import(`../Events/${files}`);
        events.set(request.name, request);
      }
    });
    //   messageCommands
    readdirSync("source/Commands/").forEach(async (folder) => {
      const tempCommandsMessages = readdirSync(`source/Commands/${folder}/`);
      for (const keys of tempCommandsMessages) {
        const mainCommand = await import(`../Commands/${folder}/${keys}`);
        const functionalCommand = mainCommand.default;
        if (functionalCommand.name) {
          commands.set(functionalCommand.name, functionalCommand);
        } else {
          console.log("The command is not ready!");
        }
      }
    });
  }
}

export default Handler;
