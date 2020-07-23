const fs = require('fs');
const Discord = require('discord.js');
const config = require('./config.json');
const logger = require('chalk');

const client = new Discord.Client();

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
console.log(logger.red.bold('Loading Commands'));
console.log(logger.green.bold('_______________'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
    console.log(logger.green.bold(`| [✅] ${command.name}   |`))
}


client.on('message', message => {
    let prefix = config.jambot.prefix;
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	if (!client.commands.has(command)) return;

	try {
		client.commands.get(command).execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});


// Connecting to the discord's API
client.login(config.jambot.token);