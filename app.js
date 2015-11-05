/* Neil Ganotisi
 * unrealNodebot (aka 'Wheatley 2.0')
 * ----- Feb 20 2015 -----
 * - Let this nightmare begin.
 * -- 'irc' module added and created. Now what?
 * -- Created script loading function
 * -- Started to attempt listener within app.js
 * ----- Feb 21 2015 -----
 * - Added 2 scripts, creating 4 functions. (xstatus, xinfo, weather, forecast)
 * ----- Mar 05 2015 -----
 * - More script creation! (dice, urban)
 * -- Also created a !kill switch that can only be toggled by admin.
 * - Wants? Needs? Etc?
 * -- !tell
 * ----- Mar 29 2015 -----
 * - A bit of script refactor.
 * - An attempt to fix the inevitable maxListener issue.
*/

// Pre-Load NodeJS Prefs

process.setMaxListeners(0);

// Load modules

var irc = require('irc'),
	fs	= require('fs'),
	winston = require('winston');

var _ = require('lodash');

var scriptCount = 1;

// Create Client

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var server = 'grizzly.bearcopter.net'

var nickname = 'wheatley2'

var clientOptions = {
	"channels"	: ["#halo"],
	"debug"		: true,
	"userName"	: "wheatley_2",
    "secure"	: false,
	"port"		: 6667,
	"selfSigned"	: true,
	"certExpired"	: true
}

var client = new irc.Client(server, nickname, clientOptions);

var logger = new winston.Logger({
	transports: [
		new winston.transports.File({
			level: 'info',
			filename: './logs/messages.log',
			handleExceptions: true,
			json: true,
			maxsize: 5242880,
			maxfiles: 1,
			colorize: false,
			timestamp: false
		})
	],
	exitOnError: false
});

// Create all-message logger

client.addListener('message', function (from, to, message) {
    console.log(from + ' => ' + to + ': ' + message);
    logger.log('info', {user: from, channel: to, message: message});
});

// Load Scripts from ./scripts/

fs.readdirSync("./scripts").forEach(function(file) {
	require("./scripts/" + file)(client);
	console.log("Loaded script: " + file);
	scriptCount++;
});

console.log(scriptCount);
