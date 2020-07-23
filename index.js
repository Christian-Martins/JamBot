//Includes all dependency and config file
const fs = require('fs'),
	Discord = require('discord.js'), // Discord V12
	config = require('./config/config.json'), // Include Config File
	logger = require('chalk'), // For stylish command prompter
 	client = new Discord.Client(), // Define client of Discord
	ascii = require("ascii-table"), // Make stylish table in the console
	{ clear } = require('console'), // For make "clear();"
	commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js')); // For the command handler

client.color = config.embed.color;
client.footer = config.embed.footer;
client.commands = new Discord.Collection();
clear(); // Clear the console

console.log(logger.redBright.bgBlue.underline("JamBot"+"\n")+logger.blueBright.bold('-------------------------'));

let table = new ascii("JamBot")
	.setHeading("","Command", "Status");
i = 0; // Define i for making the number in the table
for (const file of commandFiles) {
	const command = require(`./commands/${file}`); // Require files of the commands folder
	i++;
	if(command.name){
		client.commands.set(command.name, command);
		table.addRow(i, command.name, '✅');

	}else{
		table.addRow(i, file, `❌ Error provided. The command doesn't have name`);
		continue;
	}
}
//Align the elements in the table
table.setAlign(0 ,ascii.RIGHT)
	.setAlign(1 ,ascii.CENTER)
	.setAlign(2 ,ascii.CENTER);

// Log the table in the console
console.log(logger.bold(table.toString()));


console.log(logger.blueBright.bold('-------------------------'));
let statsTable = new ascii("JamBot- Stats")
	.setHeading("Servers", "Users")
	.addRow(client.guilds.cache.size, client.users.cache.size);

console.log(logger.yellow(statsTable) + "\n" + logger.blueBright.bold('-------------------------')+logger.green.underline("\nLogs")+logger.blueBright.bold('\n-------------------------'));
client.on('message', message => {
    let prefix = config.jambot.prefix;
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	if (!client.commands.has(command)) return;

	try {
		client.commands.get(command).execute(message, args);
		if(config.logs["console-log-type"] == 1 ){
		let tableLogs = new ascii("Logs")
			.setHeading("Infos")
			.addRow("Author", message.author.tag)
			.addRow("Message", message)
			.addRow("Msg Id", message.id)
			.addRow("Created at", message.createdAt)
			.addRow("Timestamp", message.createdTimestamp);
		console.log(tableLogs.toString());
		}else if(config.logs["console-log-type"] == 0){
			console.log(logger.greenBright(`${message.author.tag} █ ${message} █ ${message.id} █ ${message.createdAt}`));
		}else{
			console.error(logger.blue.bgRed("❌ ERROR: No Console Logs Type Mode in config/config.json! (0 = minimalist log, 1 = complete log)"));
		}
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

// Goodbye Function for proper shutdown
process.on('SIGINT', function() {
	console.log(logger.green("GoodBye! We are shutting down JamBot."))
	setTimeout(() => { clear(); process.exit(1); }, 1000);
	
});

// Connecting to the discord's API
client.login(config.jambot.token);