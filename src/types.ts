interface ClientConfig {
	embedColour: `#${string}`;
	showCategory: boolean;
	prefix: RegExp;
	developers: string[];
}

interface ClientSecrets {
	botToken: string;
}

interface Facts {
	[key: string]: FactList;
}

interface FactList {
	categoryName: string;
	categorySearch: RegExp;
	facts: string[];
}

interface FactObject {
	fact: string;
	category: string;
}

interface FactHistory {
	[key: string]: string[];
}