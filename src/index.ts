import { Client, ClientOptions, CommandInteraction, EmbedBuilder, GatewayIntentBits, Message, Partials } from "discord.js";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "fs";
import { parse } from "yaml";
import { UnknownCategory } from "./errors";
import { glob } from "glob";
import { resolve } from "path";
import { CommandManager } from "./managers/commands";
import { exit } from "process";


export class DiscordClient extends Client {
	facts: Facts = {};
	secrets: ClientSecrets;
	config: ClientConfig;
	commands: CommandManager;

	constructor(options: ClientOptions) {
		super(options);

		if (!existsSync("./configs/secrets.yaml")) {
			console.log("./configs/secrets.yaml was not found, creating base file.\nPlease set up this file before starting the bot.");
			writeFileSync("./configs/secrets.yaml", "botToken: INSERT-TOKEN-HERE", "utf-8");
			exit(1);	
		}

		this.secrets = parse(readFileSync("./configs/secrets.yaml", "utf-8"));
		this.config = parse(readFileSync("./configs/config.yaml", "utf-8"));
		this.config.prefix = new RegExp(this.config.prefix, "i");
		this.commands = new CommandManager(this);

		this.getFacts();
	}

	async start() {
		for await (const eventFile of await glob(`${resolve(__dirname, "./")}/events/*`, {})) {
			const { Event } = await import(eventFile),
				event = new Event(this);

			this.on(event.type, (...args) => event.run(this, ...args));
		}

		this.login(this.secrets.botToken);
	}

	getFacts(category?: string) {
		if (category !== void 0 && !existsSync(`./facts/${category}.yaml`)) {
			return "UnknownCategory";
		}

		if (category !== void 0) {
			this.facts[category] = parse(readFileSync(`./facts/${category}.yaml`, "utf-8"));
			return;
		}

		this.facts = {};
		for (const file of readdirSync("./facts")) {
			this.facts[file.replace(/\..+/g, "")] = parse(readFileSync(`./facts/${file}`, "utf-8"));
		}
	}

	get allFacts() {
		return Object.entries(this.facts)
			.map(list => list[1].facts.map(fact => ({ fact, category: list[1].categoryName }))).flat();
	}
}

const client = new DiscordClient({
	intents: [
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.Guilds,
		GatewayIntentBits.MessageContent,
	],
	partials: [Partials.Message]
});

client.start();