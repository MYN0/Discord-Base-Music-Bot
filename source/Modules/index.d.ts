import {
  ChatInputApplicationCommandData,
  Client,
  ChatInputCommandInteraction,
  GuildMember,
  PermissionResolvable,
  MessageSelectOption,
  Message,
} from "discord.js";
export interface RunOptions {
  client?: Client;
  message?: Message & {
    member: GuildMember;
  };
  args?: Array<string>;
}
export declare type RunFunction = (options: RunOptions) => any;
export declare type CommandOptions = {
  userPermissions?: PermissionResolvable[];
  clientPermissions?: PermissionResolvable[];
  name?: string;
  description?: string;
  aliases?: [];
  voiceChannelOnly?: boolean;
  category?: string;
  voteOnly?: boolean;
  run?: RunFunction;
};
export declare class Command {
  constructor(commandOptions: CommandOptions);
}
