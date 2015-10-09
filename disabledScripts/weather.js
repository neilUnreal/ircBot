var request = require('request');

function generateURL(location) {
	var urlPrefix = "http://api.wunderground.com/api/9e4f66079bdf2f7b/conditions/forecast/astronomy/q/";
	JSON.stringify(location);
	var searchParam = '';
	var format = '.json';


	searchParam = location.replace(/ /g, "_");

	var fullUrl = urlPrefix + searchParam + format;
	console.log(fullUrl);
	return fullUrl;
}

function forecast(client, from, to, arguments) {
	var location = '';
	location = arguments;
	JSON.stringify(location);


	fullUrl = generateURL(location);



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


	fullUrl = generateURL(location);

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

  fullUrl = generateURL(location);

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

module.exports = function(client) {
	client.addListener("message", function (from, to, message) {
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
	});
};
