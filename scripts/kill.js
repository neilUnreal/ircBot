var command = "!kill";

module.exports = function(client) {
	client.addListener("message", function(from, to, message) {
		if(message.indexOf(command) == 0) {
			if(message === command || message === command + ' ') {
				var arguments = ''
				main(client, from, to, arguments);	
			} else {
				var arguments = '';
				arguments = message.replace(/![a-z]\w+( )/g, "");
				main(client, from, to, arguments);	
			}
		}
	});
};

function main(client, from, to, arguments) {
	if (from == 'UnrealChief') {
		client.say(to, "Goodbye!");
		process.exit(1);
	} else {
		client.say(to, "You don't run this bot, you fools!!");
	}
}