var command = ".replace";
var c = require('irc-colors');

// Create new array and fill with placeholder.

var lookback = new Array(200);

for (i=0; i<lookback.length - 1; i++) {
        lookback[i]= {
            name: "=placeholder=",
            message: "=placeholder=",
            room: "placeholder"
                      }
}


function query(arguments, room) {
    console.log("ARGUMENTS: " + arguments);
    console.log("ROOM:" + room);
    
    if(arguments == "=placeholder=" && room == "placeholder") {
        return null;
    }
    
    for(i=0; i<lookback.length - 1; i++) {
        if(lookback[i].message.indexOf(arguments) >= 0 && lookback[i].room == room) {
            console.log("Got it.");
            var sendback = [lookback[i].name, lookback[i].message, lookback[i].room];
            return sendback;
        }
    }
    return null;
}

function main2(client, from, to, arguments) {
    
    arguments = arguments.split('|');
    var search = arguments[0];
    var replace = arguments[1];
    
    var meta = query(search, to);
    
    if (meta == null || typeof replace == "undefined") {
        console.log("What?");
    } else {
        console.log(meta);
    
        var newString = meta[1].replace(search, replace);
    
        client.say(to, meta[0] + " " + c.bold("meant") + " to say: " + newString);   
    }
    
    
}

module.exports = function(client) {
	client.addListener("message", function(from, to, message) {
        
		if(message.indexOf(command) == 0) {
			if(message === command || message === command + ' ') {
				var arguments = ''
				client.say(to, "Usage: .replace alreadySaidText|newText")
			} else {
				var arguments = '';
				arguments = message.replace(/.replace /g, "");
				main2(client, from, to, arguments);	
			}
		}
        lookback.pop();
        lookback.unshift({
            name: from,
            message: message,
            room: to
        });
	});
};
