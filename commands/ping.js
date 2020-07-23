module.exports = {
	name: 'ping',
	description: 'Ping!',
	execute(msg, args) {
		msg.channel.send('Pong.');
	},
};