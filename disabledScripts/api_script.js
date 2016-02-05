var request = require('request');
var c = require('irc-colors');
var sugar = require('sugar');

var youtubeAPIkey			 = "removedForGitHub";
var wundergroundAPIkey			 = "removedForGitHub";
var mashapeAPIkey			 = "removedForGitHub";
var xboxAPIkey				 = "removedForGitHub";

/* Urban Dictionary
 * Will search the Urban Dictionary database (API by mashape) for known definitions of
 * the search term. If there's a match, it will provide a random definition. No
 * rate limit.
 * Last Updated: 09/28/15
*/
function generateUrbanURL(term) {
	JSON.stringify(term);
	var url = "https://mashape-community-urban-dictionary.p.mashape.com/define?term=" + term;
	console.log(url);
	return url;
}

function urban(client, from, to, arguments) {
	var term = arguments;
	var url = '';

	fullUrl = generateUrbanURL(term);

	var requestObject = {
		uri: fullUrl,
		strictSSL: false,
		timeout: 30000,
		encoding: null,
		headers: {
			'User-Agent': 'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.43 Safari/537.31 Nodebot',
			'X-Mashape-Key': mashapeAPIkey
		}
	};

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

/* Weather
 * Searches contextually for best known location and will pull current conditions,
 * forecast, and tomorrow's forecast using 3 different commands (weather, forecast,
 * tomorrow). Uses Wunderground API Rate limited to 100/hour.
 * Last Updated: 9/28/2015
*/

function generateWURL(location) {
	var urlPrefix = "http://api.wunderground.com/api/";
	var urlSuffix = "/conditions/forecast/astronomy/q/";
	JSON.stringify(location);
	var searchParam = '';
	var format = '.json';


	searchParam = location.replace(/ /g, "_");

	var fullUrl = urlPrefix + wundergroundAPIkey + urlSuffix + searchParam + format;
	console.log(fullUrl);
	return fullUrl;
}

function forecast(client, from, to, arguments) {
	var location = '';
	location = arguments;
	JSON.stringify(location);


	fullUrl = generateWURL(location);



	var requestObject = {
		uri: fullUrl,
		strictSSL: false,
		timeout: 10000,
		encoding: null,
		headers: {
			'User-Agent': 'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.43 Safari/537.31 Nodebot'
		}
	};

	request(requestObject, function (error, response, body) {
		if(error) {
			irc.privmsg(to, "[Forecast] Wunderground appears to be down. Sorry about that!");
		} else {
			console.log("retrieval success!");
			var result = JSON.parse(body);

			if (typeof result.current_observation == "undefined" || result.current_observation.length == 0) {
				client.say(to, "[Forecast] Error: Unable to load data. Either this location does not exist or you need to be more specific in your search.");
			} else {
				client.say(to, "[Forecast] " + result.current_observation.observation_location.full + " : " + result.forecast.txt_forecast.forecastday[0].title + " - " + result.forecast.txt_forecast.forecastday[0].fcttext + " Sunrise at " + result.sun_phase.sunrise.hour + ":" + result.sun_phase.sunrise.minute + ". Sunset at " + result.sun_phase.sunset.hour + ":" + result.sun_phase.sunset.minute + ". " + result.current_observation.observation_time);
			}

		}
	});
}

function weather(client, from, to, arguments) {
	console.log("weather() called");
	var location = '';
	location = arguments;
	JSON.stringify(location);


	fullUrl = generateWURL(location);

	console.log(fullUrl);

	var requestObject = {
		uri: fullUrl,
		strictSSL: false,
		timeout: 10000,
		encoding: null,
		headers: {
			'User-Agent': 'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.43 Safari/537.31 Nodebot'
		}
	};

	request(requestObject, function (error, response, body) {
		if(error) {
			client.say(to, "[Weather] Wunderground appears to be down. Sorry about that!");
		} else {
			console.log("retrieval success!");
			var result = JSON.parse(body);

			if (typeof result.current_observation == "undefined" || result.current_observation.length == 0) {
				client.say(to, "[Weather] Error: Unable to load data. Either this location does not exist or you need to be more specific in your search.");
			} else {
				client.say(to, "[Weather] " + result.current_observation.observation_location.full + ": " + result.current_observation.temperature_string + ", " + result.current_observation.weather + ", " + result.current_observation.relative_humidity + " Humidity. Wind: " + result.current_observation.wind_string + ". " + result.current_observation.observation_time + ".");
			}

		}
	});
}

function tomorrow(client, from, to, arguments) {
  var location = '';
  location = arguments;
  JSON.stringify(location);

  fullUrl = generateWURL(location);

  var requestObject = {
    uri: fullUrl,
    strictSSL: false,
    timeout: 10000,
    encoding: null,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.43 Safari/537.31 Nodebot'
    }
  };

  request(requestObject, function (error, response, body) {
    if(error) {
      irc.privmsg(to, "[Forecast] Wunderground appears to be down. Sorry about that!");
    } else {
      console.log("retrieval success!");
      var result = JSON.parse(body);

      if (typeof result.current_observation == "undefined" || result.current_observation.length == 0) {
        client.say(to, "[Forecast] Error: Unable to load data. Either this location does not exist or you need to be more specific in your search.");
      } else {
        if (result.forecast.txt_forecast.forecastday[0].title.indexOf("Night") > 0) {
          console.log("Night detected, fast forwarding to tomorrow.");
          client.say(to, "[Tomorrow's Forecast] " + result.current_observation.observation_location.full + " : " + result.forecast.txt_forecast.forecastday[1].title + " - " + result.forecast.txt_forecast.forecastday[1].fcttext + ".");
        } else if (result.forecast.txt_forecast.forecastday[0].title.indexOf("Night") == -1) {
          console.log("Current day detected, fast forwarding to tomorrow.");
          client.say(to, "[Tomorrow's Forecast] " + result.current_observation.observation_location.full + " : " + result.forecast.txt_forecast.forecastday[2].title + " - " + result.forecast.txt_forecast.forecastday[2].fcttext + ".");
        }
      }

    }
  });
}


/* YouTube Search
 * Will pull first video result. Uses Google Developer API. No known rate limit.
 * Last updated: 9/28/2015
*/
function generateYTURL(query) {
	var urlPrefix = "https://www.googleapis.com/youtube/v3/search?part=snippet&q=";
	var urlSuffix = "&key=";
	var searchParam = '';

	searchParam = query.replace(/ /g, "+");

	var fullUrl = urlPrefix + searchParam + urlSuffix + youtubeAPIkey;
	console.log(fullUrl);
	return fullUrl;

}

function checkYTResults(result) {
	var int = 0;
	while (true) {
		if(result.items[int].id.kind !== "youtube#video") {
			int++;
		} else {
			break;
		}
	}
	console.log(int);
	return int;
}

function YT(client, from, to, arguments) {
	var query = '';
	query = arguments;
	JSON.stringify(query);

	fullUrl = generateYTURL(query);

	var requestObject = {
		uri: fullUrl,
		strictSSL: false,
		timeout: 10000,
		encoding: null,
		headers: {
			'User-Agent': 'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.43 Safari/537.31 Nodebot'
		}
	};

	request(requestObject, function (error, response, body) {
		if(error) {
			console.log("net error");
			client.say(to, "[YouTube] For whatever reason, the server can't access YouTube. Try again.");
		} else {
			console.log("retrieval success!");
			var result = JSON.parse(body);


			if(result.pageInfo.totalResults == "0"){
				console.log("No results found?!");
				client.say(to, "[YouTube] No results found. Try again.");
			} else {
				var integer = checkYTResults(result);
				console.log(result.items[integer].id.videoId);
				console.log(result.items[integer].snippet.title);
				client.say(to, "[YouTube] " + c.bold(result.items[integer].snippet.title) + " " + "https://youtu.be/" + result.items[integer].id.videoId);
			}
		}
	});
}

/* Xbox API
 * Pulls from http://xboxapi.com, which pulls from an OAuth Token of an XBL account.
 * Rate limit at 120/hour.
 * Last Updated: 09/28/2015
*/

function generateGamercardURL(gamertag) {
	JSON.stringify(gamertag);
	var url = "https://xboxapi.com/v2/" + gamertag + "/gamercard";
	console.log(url);
	return url;
}

function generatePresenceURL(gamertag) {
	JSON.stringify(gamertag);
	var url = "https://xboxapi.com/v2/" + gamertag + "/presence";
	console.log(url);
	return url;
}

function xinfo(client, from, to, arguments) {
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
			'X-AUTH': xboxAPIkey
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

function xstatus(client, from, to, arguments) {
	console.log('ayy');
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

module.exports = function(client) {
	client.addListener("message", function (from, to, message) {
		if(message.indexOf("!yt") == 0) {
			var arguments = '';
			arguments = message.replace(/![a-z]\w+( )/g, "");
			YT(client, from, to, arguments);
		}

		if(message.indexOf("!forecast") == 0) {
			var arguments = '';
			arguments = message.replace(/![a-z]\w+( )/g, "");
			forecast(client, from, to, arguments);
		}

		if(message.indexOf("!weather") == 0) {
			var arguments = '';
			arguments = message.replace(/![a-z]\w+( )/g, "");
			weather(client, from, to, arguments);
		}

		if(message.indexOf("!tomorrow") == 0) {
			var arguments = '';
			arguments = message.replace(/![a-z]\w+( )/g, "");
			tomorrow(client, from, to, arguments);
		}

		if(message.indexOf("!urban") == 0) {
			if(message === "!urban" || message === "!urban" + ' ') {
				client.say(to, "Can you at least put in a term?");
			} else {
				var arguments = '';
				arguments = message.replace(/![a-z]\w+( )/g, "");
				urban(client, from, to, arguments);
			}
		}

		if(message.indexOf(!xinfo) == 0) {
			if(message === "!xinfo" || message === "!xinfo" + ' ') {
				console.log("test");
				client.say(to, "Gamertag required");
			} else {
				console.log("test");
				var arguments = '';
				arguments = message.replace(/![a-z]\w+( )/g, "");
				xinfo(client, from, to, arguments);
			}
		}

		if(message.indexOf(!xstatus) == 0) {
			if(message === "!xstatus" || message === "!xstatus" + ' ') {
				client.say(to, "Gamertag required");
				console.log("test");
			} else {
				console.log("test");
				var arguments = '';
				arguments = message.replace(/![a-z]\w+( )/g, "");
				xstatus(client, from, to, arguments);
			}
		}

		if(message.indexOf(!test) == 0) {
			client.say(to, "TEST! :D")
		}
	});
};
