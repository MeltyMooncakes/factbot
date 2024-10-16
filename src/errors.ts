import { EmbedBuilder } from "discord.js";

export const UnknownCategory = new EmbedBuilder()
	.setTitle("Error: Unknown category.")
	.setColor("Red")

export const FailedToReload = new EmbedBuilder()
	.setTitle("Error: Failed to reload facts.")
	.setColor("Red")

export const NotDeveloper = new EmbedBuilder()
	.setTitle("Error: This command is only for developers.")
	.setColor("Red")