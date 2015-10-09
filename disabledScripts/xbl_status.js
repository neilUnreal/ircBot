var request = require('request');
var apiKey = '72b6df4250ed10c04034fcffcac87a1174c183aa';

var command = "!xstatus";

module.exports = function(client) {
	client.addListener("message", function(from, to, message) {
		if(message.indexOf(command) == 0) {
			if(message === command || message == command + ' ') {
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

function generatePresenceURL(gamertag) {
	JSON.stringify(gamertag);
	var url = "https://xboxapi.com/v2/" + gamertag + "/presence";
	console.log(url);
	return url;

}
function main(client, from, to, arguments) {
	var gamertag = '';
	gamertag = arguments;
	JSON.stringify(arguments);
	var url = '';

	fullUrl = generatePresenceURL(gamertag);

	var requestObject = {
		uri: fullUrl,
		strictSSL: false,
		timeout: 10000,
		encoding: null,
		headers: {
			'User-Agent': 'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.43 Safari/537.31 Nodebot',
			'X-AUTH': apiKey
		}
	};

	console.log(requestObject);

	request(requestObject, function (error, response, body){
		if(error) {
			client.say(to, "[XBL] API might be down right now. Sorry about that. Run !xrefresh to try to refresh the session.");
		} else {
			console.log("Retrieved result.");
			var result = JSON.parse(body);
			console.log(result);

			if (typeof result.state == "undefined" || result.state.length === 0) {
				client.say(to, "[XBL] Error: Unable to load data. Does this Gamertag exist?");
			} else if (result.state == "Offline" && (typeof result.lastSeen == "undefined" || result.lastSeen.length === 0)) {
				client.say(to, "[XBL] " + gamertag + " is Offline. There is no saved previous activity (The user may have set their account private).");
			} else if (result.state == "Offline") {
				var lastTitle = result.lastSeen.titleName;

				if (result.lastSeen.deviceType == "XboxOne") {
					var device = "Xbox One";
				} else if (result.lastSeen.deviceType == "Xbox360") {
					var device = "Xbox 360";
				}

				if (lastTitle == "Home" && device == "Xbox One") {
					client.say(to, "[XBL] " + gamertag + " is Offline. Last seen on the Xbox One's Home screen.");
				} else {
					client.say(to, "[XBL] " + gamertag + " is Offline. Last seen on " + device + " playing " + lastTitle + ".");
				}
			} else if ((result.state == "Online" || result.state == "Away" || result.state == "Busy") && result.devices[0].type == "XboxOne") {
				if (typeof result.devices[0].titles[0].activity == "undefined" & (result.devices[0].titles[0].name.length > 0 & result.devices[0].titles[0].name !== "Home")) {
					client.say(to, "[XBL] " + gamertag + " is " + result.state + ". Currently on Xbox One playing " + result.devices[0].titles[0].name + ".");
				} else if (result.devices[0].titles[0].name == "Home" && typeof result.devices[0].titles[1] == "undefined") {
					client.say(to, "[XBL] " + gamertag + " is " + result.state + ". Currently on Xbox One at the Home screen.");
				} else if (result.devices[0].titles[1].name == "Home" && result.devices[0].titles[2].name.length > 0) {
					client.say(to, "[XBL] " + gamertag + " is " + result.state + ". Currently on Xbox One playing " + result.devices[0].titles[0].name + " (" + result.devices[0].titles[0].activity.richPresence + ") " + "with the " + result.devices[0].titles[2].name + " app snapped in the background.");
				} else if (result.devices[0].titles[0].placement == "Background" && result.devices[0].titles[1].name.length > 0 && typeof result.devices[0].titles[2] !== "undefined") {
					if (typeof result.devices[0].titles[2].activity !== "undefined") {
						client.say(to, "[XBL] " + gamertag + " is " + result.state + ". Currently on Xbox One playing " + result.devices[0].titles[1].name + " (" + result.devices[0].titles[1].activity.richPresence + ") " + "with the " + result.devices[0].titles[2].name + " (" + result.devices[0].titles[2].activity.richPresence + ") app snapped in the background.");
					} else {
						client.say(to, "[XBL] " + gamertag + " is " + result.state + ". Currently on Xbox One playing " + result.devices[0].titles[1].name + " (" + result.devices[0].titles[1].activity.richPresence + ") " + "with the " + result.devices[0].titles[2].name + " app snapped in the background.");
					}
				} else {
					if (typeof result.devices[0].titles[1].activity == 'undefined' || result.devices[0].titles[1].activity === 0) {
						client.say(to, "[XBL] " + gamertag + " is " + result.state + ". Currently on Xbox One playing " + result.devices[0].titles[1].name + " .");
					} else {
						client.say(to, "[XBL] " + gamertag + " is " + result.state + ". Currently on Xbox One playing " + result.devices[0].titles[1].name + " (" + result.devices[0].titles[1].activity.richPresence + ").");
					}
				}
			} else if ((result.state == "Online" || result.state == "Away" || result.state == "Busy") && result.devices[0].type == "Xbox360") {
				client.say(to, "[XBL] " + gamertag + " is " + result.state + ". Currently on Xbox 360 playing " + result.devices[0].titles[0].name + ".");
			} else {
				client.say(to, "[XBL] An error occured. Go ahead and try again!");
			}
		}
	});
}