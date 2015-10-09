module.exports = function(client) {
	client.addListener("message", function(from, to, message) {
		if(message.indexOf('!test') == 0) {
			var _ = require('lodash');
			console.log("test pass, sending message");
			console.log(_.random(1,10));
			client.say(to, "test");
		}
	});

};