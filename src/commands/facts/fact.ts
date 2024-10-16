import { EmbedBuilder, Message } from "discord.js";
import { DiscordClient } from "../..";
import { UnknownCategory } from "../../errors";

export class Command {
	client: DiscordClient;

	name = "fact";
	textArgs = "category";
	aliases = ["facts"];

	developer = false;

	constructor(client: DiscordClient) {
		this.client = client;
	}

	async message(message: Message, args: string[]) {
		return await message.reply({
			embeds: [this.generateFact(message, args.join(" "))],
			target: message,
		});
	}

	lastFact: FactHistory = {};

	factEmbed(facts: FactObject[], channelId: string) {
		if (!Object.hasOwn(this.lastFact, channelId)) {
			this.lastFact[channelId] = [];
		}
		
		facts = facts.filter(f => !this.lastFact[channelId].includes(f.fact));
		const fact = facts[Math.floor(Math.random() * facts.length)];
		this.lastFact[channelId].push(fact.fact);
		
		if (this.lastFact[channelId].length > 2) {
			this.lastFact[channelId].shift();
		}

		return new EmbedBuilder()
			.setColor(this.client.config.embedColour)
			.setTitle("Fun Fact!")
			.setDescription(fact.fact)
			.setFooter(this.client.config.showCategory ? { text: `Category: ${fact.category}` } : null);
	}

	generateFact(message: Message, category: string = "all") {
		if (["all", ""].includes(category)) {
			return this.factEmbed(this.client.allFacts, message.channelId);
		}

		const matchingCategory = Object.values(this.client.facts).find(c => RegExp(c.categorySearch, "i").test(category));
		if (!matchingCategory) {
			return UnknownCategory;
		}

		return this.factEmbed(matchingCategory.facts.map(fact => ({ fact, category: matchingCategory.categoryName })), message.channelId);
	}
}