import { EmbedBuilder, Message } from "discord.js";
import { DiscordClient } from "../..";
import { FailedToReload, UnknownCategory } from "../../errors";

export class Command {
	client: DiscordClient;

	name = "factcounts";
	textArgs = "";
	aliases = ["factstats"];

	developer = false;

	constructor(client: DiscordClient) {
		this.client = client;
	}

	async message(message: Message, args: string[]) {
		return await message.reply({
			embeds: [
				new EmbedBuilder()
					.setColor(this.client.config.embedColour)
					.setTitle("Fact bot | Fact counters")
					.addFields(
						Object.entries(this.client.facts)
							.filter(e => e[0] !== "threat")
							.map(entry => ({ name: entry[1].categoryName, value: `${entry[1].facts.length}`, inline: true }))
					)
			],
			target: message,
		});
	}
}