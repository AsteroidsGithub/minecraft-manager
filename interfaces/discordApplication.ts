import {
    Client,
    ClientOptions,
    Collection,
    Interaction,
    SlashCommandBuilder,
    REST as RestClient,
    Routes,
} from "discord.js";
import fs from "fs";
import { log } from "../helpers/logger";

interface EventConstructor {
    name: string;
    once: boolean;
    run: (client: Client, ...args: any[]) => void;
}

interface SlashCommandConstructor {
    data: SlashCommandBuilder;
    run: (client: Client, interaction: any) => void;
}

interface DiscordApplicationOptions {
    clientId: string;
    clientToken: string;
    clientOptions: ClientOptions;
}

class DiscordApplication {
    private token: string;
    private clientId: string;
    private clientOptions: ClientOptions;

    private discordClient: Client;
    private restClient: RestClient;

    // Link a prisma Database here
    public EventsCollection: Collection<string, EventConstructor>;
    public CommandCollection: Collection<string, SlashCommandConstructor>;

    constructor(options: DiscordApplicationOptions) {
        this.clientId = options.clientId;
        this.token = options.clientToken;
        this.clientOptions = options.clientOptions;

        this.EventsCollection = new Collection();
        this.CommandCollection = new Collection();

        this.discordClient = new Client(this.clientOptions);
        this.restClient = new RestClient();
    }

    public async start() {
        // Set Tokens for bot and command registration
        this.discordClient.login(this.token);
        this.restClient.setToken(this.token);

        // Load all events and commands
        await this.loadEvents();
        await this.loadCommands();

        // Register all commands
        await this.registerCommandsGlobal();

        log("Bot is ready!");
    }

    public async addEvent(filename: string, event: EventConstructor) {
        // Import the file and add it to the collection
        event = await import(filename).then((module) => module.default);
        this.EventsCollection.set(event.name, event);

        // Add the event to the client
        switch (event.once) {
            case true:
                this.discordClient.once(event.name, (...args) =>
                    event.run(this.discordClient, ...args)
                );
                break;
            case false:
                this.discordClient.on(event.name, (...args) =>
                    event.run(this.discordClient, ...args)
                );
                break;
        }

        log(`Event ${event.name} has been added!`);
    }

    public async loadEvents() {
        // Take all files in the events folder and add them to the collection
        const eventFiles = await fs.promises.readdir("./events");

        log(`Loading ${eventFiles.length} events...`);

        for (const file of eventFiles) {
            const event = await import(`../events/${file}`);
            this.addEvent(`../events/${file}`, event.default);
        }

        log("All events have been loaded!");
    }

    public async addCommand(
        filename: string,
        command: SlashCommandConstructor
    ) {
        // Import the file and add it to the collection
        command = await import(filename).then((module) => module.default);
        this.CommandCollection.set(command.data.name, command);

        log(`Command ${command.data.name} has been added!`);
    }

    public async loadCommands() {
        // Take all files in the commands folder and add them to the collection
        const commandFiles = await fs.promises.readdir("./commands");

        log(`Loading ${commandFiles.length} commands...`);

        for (const file of commandFiles) {
            const command = await import(`../commands/${file}`);

            this.addCommand(`../commands/${file}`, command.default);
        }

        log("All commands have been loaded!");
    }

    public async registerCommandsGlobal() {
        // Register all commands in the collection
        this.restClient
            .put(Routes.applicationCommands(this.clientId), {
                body: this.CommandCollection.map((command) =>
                    command.data.toJSON()
                ),
            })
            .then(() => {
                log("All commands have been registered globally!");
            })
            .catch((error) => {
                log(`Error registering commands: ${error}`);
            });
    }
}

export { EventConstructor, SlashCommandConstructor, DiscordApplication };
