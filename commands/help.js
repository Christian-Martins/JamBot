const data = [], 
    { jambot } = require('../config/config.json'),
    logger = require('chalk');
module.exports = {
	name: 'help',
	description: 'Help!',
	execute(message, args, client) {
        const { commands } = message.client;
		data.push('Here\'s a list of all my commands:');
        data.push(commands.map(command => command.name).join(', '));
        data.push(`\nYou can send \`${jambot.prefix}help [command name]\` to get info on a specific command!`);

        return message.author.send(data, { split: true })
            .then(() => {
                if (message.channel.type === 'dm') return;
                message.reply('I\'ve sent you a DM with all my commands!');
            })
            .catch(error => {
                console.error(logger.red(`[❌] Could not send the result of ${jambot.prefix}help to ${message.author.tag} in DM. \n`, error));
                //message.reply(client.warningemoji);
            });
	},
};

