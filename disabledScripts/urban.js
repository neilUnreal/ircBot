// Urban Dictionary API Script
var request = require('request');
var c = require('irc-colors');
var sugar = require('sugar');
var command = "!urban";

var apiKey = "DJMwLAaUk9mshvtZpfPNT15CNF3Gp1AIEd1jsnznEX52fuWu2L"

module.exports = function(client) {
	client.addListener("message", function(from, to, message) {
		if(message.indexOf(command) == 0) {
			if(message === command || message === command + ' ') {
				client.say(to, "Can you at least put in a term?");
			} else {
				var arguments = '';
				arguments = message.replace(/![a-z]\w+( )/g, "");
				main(client, from, to, arguments);	
			}
		}
	});
};

function generateUrbanURL(term) {
	JSON.stringify(term);
	var url = "https://mashape-community-urban-dictionary.p.mashape.com/define?term=" + term
	console.log(url);
	return url;
}

function main(client, from, to, arguments) {
	var term = arguments
	var url = ''

	fullUrl = generateUrbanURL(term);

	var requestObject = {
		uri: fullUrl,
		strictSSL: false,
		timeout: 30000,
		encoding: null,
		headers: {
			'User-Agent': 'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.43 Safari/537.31 Nodebot',
			'X-Mashape-Key': apiKey
		}
	}

	request(requestObject, function (error, response, body) {
		if(error) {
			client.say("[Urban Dictionary] API appears to have issues. What a fuck up.");
		} else {
			var result = JSON.parse(body);
			console.log(result);


			if (result.result_type == "no_results") {
				client.say(to, "[Urban Dictionary] Man. You fucked up, " + from + ". This term doesn't exist!");
			} else if (result.result_type == "exact") {
				console.log(result.list[0].definition);

				var maxDefs = result.list.length;

				var randomInt = Number.random(0, maxDefs - 1);
				var randomIntPlusOne = randomInt + 1;

				var definition = result.list[randomInt].definition.replace(/(\r\n|\n|\r)/gm," ");
				var example = result.list[randomInt].example.replace(/(\r\n|\n|\r)/gm," ");
				var permalink = result.list[randomInt].permalink;
				if (definition === example || example == '') {
					definition = definition.truncate(300);
					client.say(to, "[Urban Dictionary] " + c.bold(result.list[0].word + " [" + randomIntPlusOne + "/" + maxDefs + "]") + ": " + definition + c.bold(" No example available."));
					client.say(to, "[Urban Dictionary] " + c.bold(permalink));
				} else {
					definition = definition.truncate(185);
					example = example.truncate(185);
					client.say(to, "[Urban Dictionary] " + c.bold(result.list[0].word + " [" + randomIntPlusOne + "/" + maxDefs + "]") +  ": " + definition + c.bold(" Example: ") + example);
					client.say(to, "[Urban Dictionary] " + c.bold(permalink));
				}
			} else {
				client.say(to, "[Urban Dictionary] I don't know what you did to fuck this up. Maybe this term doesn't exist?");
			}
		}
	});
}