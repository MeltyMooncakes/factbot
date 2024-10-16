import { DiscordClient } from "..";

export class Event {
	client: DiscordClient;
	type = "ready";
	
	constructor(client: DiscordClient) {
		this.client = client;
	}

	async run() {
		console.log("bwaa");
	}
}