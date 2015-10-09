var request = require('request');
var apiKey = '72b6df4250ed10c04034fcffcac87a1174c183aa';

var command = "!xinfo";

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

function generateGamercardURL(gamertag) {
	JSON.stringify(gamertag);
	var url = "https://xboxapi.com/v2/" + gamertag + "/gamercard";
	console.log(url);
	return url;
}

function main(client, from, to, arguments) {
	var gamertag = arguments;

	var url = '';

	fullUrl = generateGamercardURL(gamertag);

	console.log('created url: url: ' + fullUrl);

	var requestObject = {
		uri: fullUrl,
		strictSSL: false,
		timeout: 30000,
		encoding: null,
		headers: {
			'User-Agent': 'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.43 Safari/537.31 Nodebot',
			'X-AUTH': apiKey
		}
	};

	request(requestObject, function (error, response, body) {
		if(error) {
			client.say(to, "[XBL] Unable to access API. Sorry about that.");
		} else {
			console.log("retrieved URL. parsing and logging result.");
			var result = JSON.parse(body);
			console.log(result);

			if (typeof result.gamertag == "undefined" || result.gamertag.length === 0) {
				client.say(to, "[XBL] Error: Unable to load data. Does this Gamertag exist?");
			} else if (result.gamertag.length > 0) {
				client.say(to, "[XBL] Gamertag: " + result.gamertag + " | Name: " + result.name + " | Location: " + result.location + " | Gamerscore: " + result.gamerscore + " | Silver/Gold?: " + result.tier + " | Motto: " + result.motto + " | Bio: " + result.bio);
			} else {
				client.say(to, "[XBL] An error occured. Try again.");
			}
		}
	});
}