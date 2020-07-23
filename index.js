//Includes all dependency and config file
const fs = require('fs'),
	Discord = require('discord.js'), // Discord V12
	config = require('./config/config.json'), // Include Config File
	logger = require('chalk'), // For stylish command prompter
 	client = new Discord.Client(), // Define client of Discord
	ascii = require("ascii-table"), // Make stylish table in the console
	{ clear } = require('console'), // For make "clear();"
	commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js')), // For the command handler
	low = require('lowdb'),
	FileSync = require('lowdb/adapters/FileSync'),
	adapter = new FileSync('config/emojis.json'),
	db = low(adapter);

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

// Setup the db
db.defaults({ servers: [] })
			.write()

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
	
	const server =  message.guild.id;
	// Emoji of Atlanta! https://github.com/androz2091/atlantabot
	const get_server_emoji = db.get("servers").find(server).value();
	if(!get_server_emoji){
		/*db.get('servers')
			.push(server, [])
			.write()*/
	}
	console.log(get_server_emoji);
	if(!message.guild.emojis.cache.find(emoji => emoji.name == 'dnd')){
		message.guild.emojis.create('https://cdn.discordapp.com/emojis/616613445252546570.png', 'dnd')
			.then(emoji => console.log(logger.blueBright(`Created new emoji with name ${emoji.name}`)))
			.catch(console.error);
	}

	if(!message.guild.emojis.cache.find(emoji => emoji.name == 'idle')){
		message.guild.emojis.create('https://cdn.discordapp.com/emojis/616613445290164224.png', 'idle')
			.then(emoji => console.log(logger.blueBright(`Created new emoji with name ${emoji.name}`)))
			.catch(console.error);
	} 

	if(!message.guild.emojis.cache.find(emoji => emoji.name == 'online')){
		message.guild.emojis.create('https://cdn.discordapp.com/emojis/616613445424513028.png', 'online')
			.then(emoji => console.log(logger.blueBright(`Created new emoji with name ${emoji.name}`)))
			.catch(console.error);
	} 

	if(!message.guild.emojis.cache.find(emoji => emoji.name == 'invisible')){
		message.guild.emojis.create('https://cdn.discordapp.com/emojis/616613445487558696.png', 'invisible')
			.then(emoji => console.log(logger.blueBright(`Created new emoji with name ${emoji.name}`)))
			.catch(console.error);
	} 

	if(!message.guild.emojis.cache.find(emoji => emoji.name == 'folder')){
		message.guild.emojis.create('https://cdn.discordapp.com/emojis/601019084468912129.png?v=1', 'folder')
			.then(emoji => console.log(logger.blueBright(`Created new emoji with name ${emoji.name}`)))
			.catch(console.error);
	} 

	if(!message.guild.emojis.cache.find(emoji => emoji.name == 'warning')){
		message.guild.emojis.create('https://cdn.discordapp.com/emojis/598179558927106058.png', 'warning')
			.then(emoji => console.log(logger.blueBright(`Created new emoji with name ${emoji.name}`)))
			.catch(console.error);
	}

	
});

	

	

// Goodbye Function for proper shutdown
process.on('SIGINT', function() {
	console.log(logger.green("GoodBye! We are shutting down JamBot."))
	setTimeout(() => { clear(); process.exit(1); }, 1000);
	
});

// Connecting to the discord's API
client.login(config.jambot.token);