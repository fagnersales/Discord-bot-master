import type { PermissionResolvable, ApplicationCommandData, AutocompleteInteraction } from "discord.js";
import { ExtendedClient } from "./client.js";

interface CustomOptions {
    userPermissions?: PermissionResolvable;
    botPermissions?: PermissionResolvable;
    category?: string;
    cooldown?: number;
    ownerOnly?: boolean;
    guildOnly?: boolean;
};

interface CommandOptions {
    data: ApplicationCommandData;
    opt: CustomOptions;
    auto?: (int: AutocompleteInteraction) => Promise<any>;
    execute: (client: ExtendedClient, int: any) => Promise<any>;
};

export class SlashClass {
    data: CommandOptions['data'];
    opt: CommandOptions['opt'];
    auto?: CommandOptions['auto'];
    execute: CommandOptions['execute'];

    constructor(options: CommandOptions) {
        this.data = options.data;
        this.opt = options.opt;
        this.auto = options.auto;
        this.execute = options.execute;
    };
};