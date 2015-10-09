var request = require('request');
var c = require('irc-colors');

var command = "!playlist"

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
	var requestObject = {
	uri: "https://dl.dropboxusercontent.com/s/u93d7j5507li154/playlist.lst",
	strictSSL: true,
	timeout: 10000,
	encoding: null,
	headers: {
		'User-Agent': 'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.43 Safari/537.31 Nodebot'
		}
	};

	request (requestObject, function (error, response, body) {
		if (error) {
			client.say(to, "[reboot] Cannot fetch playlist. Please try again later.");
		} else {
			var result = [];
			var shows = body.toString('utf-8');
			result = shows.split("\n");

			if (result[0] == "<!DOCTYPE html>") {
				var string = "[reboot] Playlist appears to be down at the moment. Please try again later.";
			} else {
				var string = "[Nreboot]" + c.bold(" NOW: ") + result[0] + c.bold(" LATER: ") + result[1] + c.bold(" (3) ") + result[2] + c.bold(" (4) ") + result[3] + c.bold(" (5) ") + result[4];
			}

			client.say(to, string);
		}
	});

	

	var requestObject2 = {
	uri: "https://dl.dropboxusercontent.com/s/8brw0zw55dta6o9/cnplaylist.lst",
	strictSSL: true,
	timeout: 10000,
	encoding: null,
	headers: {
		'User-Agent': 'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.43 Safari/537.31 Nodebot'
		}
	};

	request (requestObject2, function (error, response, body) {
		if (error) {
			client.say(to, "[reboot] Cannot fetch playlist. Please try again later.");
		} else {
			var result = [];
			var shows = body.toString('utf-8');
			result = shows.split("\n");

			if (result[0] == "<!DOCTYPE html>") {
				var string = "[reboot] Playlist appears to be down at the moment. Please try again later.";
			} else {
				var string = "[CNreboot]" + c.bold(" NOW: ") + result[0] + c.bold(" LATER: ") + result[1] + c.bold(" (3) ") + result[2] + c.bold(" (4) ") + result[3] + c.bold(" (5) ") + result[4];
			}

			client.say(to, string);
		}
	});
}
