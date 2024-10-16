import { EmbedBuilder, Message } from "discord.js";
import { DiscordClient } from "../..";
import { FailedToReload, UnknownCategory } from "../../errors";

export class Command {
	client: DiscordClient;

	name = "reloadfacts";
	textArgs = "category";
	aliases = ["reloadfact"];
	
	developer = true;
	
	constructor(client: DiscordClient) {
		this.client = client;
	}

	async message(message: Message, args: string[]) {
		try {
			this.client.getFacts(args[0]);
		} catch (e) { 
			return await message.reply({
				embeds: [e === "UnknownCategory" ? UnknownCategory : FailedToReload],
				target: message,
			});
		}

		return await message.reply({
			embeds: [
				new EmbedBuilder()
					.setColor(this.client.config.embedColour)
					.setTitle("Reloaded the facts.")
			],
			target: message,
		});
	}
}