import { Message } from "discord.js";
import { DiscordClient } from "..";
import { NotDeveloper } from "../errors";

export class Event {
	client: DiscordClient;
	type = "messageCreate";

	constructor(client: DiscordClient) {
		this.client = client;
	}

	async run(message: Message) {
		if (message.author.bot || !this.client.config.prefix.test(message.content)) {
			return;
		}

		const args = message.content.replace(this.client.config.prefix, "").split(/\s/g),
			commandString = args.shift()!,
			command = this.client.commands.find(c => [c.name, ...c.aliases].includes(commandString));

		if (!command) {
			return;
		}

		if (command.developer && !this.client.config.developers.includes(message.author.id)) {
			console.log(this.client.config.developers, message.author.id);
			return await message.reply({
				embeds: [NotDeveloper],
				target: message,
			});
		}

		return await command.message(message, args);
	}
}