import { EmbedBuilder, Message } from "discord.js";
import { DiscordClient } from "../..";
import { FailedToReload, UnknownCategory } from "../../errors";

export class Command {
	client: DiscordClient;

	name = "info";
	textArgs = "";
	aliases = [];
	
	developer = false;
	
	constructor(client: DiscordClient) {
		this.client = client;
	}

	async message(message: Message, args: string[]) {
		return await message.reply({
			embeds: [
				new EmbedBuilder()
					.setColor(this.client.config.embedColour)
					.setTitle("Fact bot")
					.setDescription(
						`This bot is home to ${this.client.allFacts.length} Facts.
						Bot originally made by ${(await this.client.users.fetch("512027467972739082")).username} and ${(await this.client.users.fetch("596803514336804874")).username}, then rewritten by MeltyMooncakes.`)
			],
			target: message,
		});
	}
}