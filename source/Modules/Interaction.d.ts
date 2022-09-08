import {
  ChatInputApplicationCommandData,
  Client,
  ChatInputCommandInteraction,
  GuildMember,
  PermissionResolvable,
} from "discord.js";
export interface RunOptions {
  client?: Client;
  interaction?: ChatInputCommandInteraction & {
    member: GuildMember;
  };
  args?: Array<string>;
}
export declare type RunFunction = (options: RunOptions) => any;
export declare type CommandOptions = {
  userPermissions?: PermissionResolvable[];
  clientPermissions?: PermissionResolvable[];
  voteOnly?: boolean;
  coolDown?: String;
  run: RunFunction;
  category?: "Music" | "Information";
  voiceChannelOnly?: boolean;
} & ChatInputApplicationCommandData;
export declare class ApplicationCommand {
  constructor(commandOptions: CommandOptions);
}
