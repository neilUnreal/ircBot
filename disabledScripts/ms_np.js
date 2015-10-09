var request = require('request');
var c = require('irc-colors');


var command = "!nowplaying";

module.exports = function(client) {
	client.addListener("message", function(from, to, message) {
		if(message.indexOf(command) == 0) {
			console.log('lol');
			main(client, from, to, arguments);
		}
	});
};

function main(client, from, to, arguments) {
	var socket = require('socket.io-client').connect('http://socket.midnightsociety.co:1337');

	socket.on('connect', function () {
		console.log('connected!');
		socket.emit('initChannelCallbacks');
		console.log('emitted 1');
		socket.emit('joinchannel', {
			name: 'midnightsociety'
		});
		console.log('emitted 2');

		socket.on('event', function(data) {
			console.log(data);
		});

		socket.on('changeMedia', function (pl) {
			console.log('woooooooo!');
			data = JSON.stringify(data);
			console.log(data);
			var current = data.title;
			console.log(current);
		});
	})

	console.log('disconnected');
}