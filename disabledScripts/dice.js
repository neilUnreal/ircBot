var command = "!dice";

module.exports = function(client) {
	client.addListener("message", function(from, to, message) {
		if(message.indexOf(command) == 0) {
			if(message === command) {
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

function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
}

function roll(client, to, dice, faces) {
    var i, results = [];
    var total = 0;

    dice = clamp(dice, 1, 50);
    faces = clamp(faces, 1, 100);

    for(i = 0; i < dice; i++) {
		var currentDie;
		currentDie = (Math.floor(Math.random() * faces) + 1);
        results.push( currentDie.toString(10) );
		total = total + currentDie;
		console.log(total);
    }

    client.say(to, results.join(", ") + " | Total: " + total);
}

function main(client, from, to, arguments) {
	if (arguments == '') {
		roll(client, to, 1, 6);
	} else {
		var params = arguments.split('d');
		if (params.length !== 2) {
			client.say(to, "Unable to process. Are you insane?");
	} else {
		var num1 = parseInt(params[0].trim()),
			num2 = parseInt(params[1].trim());
		if (isNaN(num1) || isNaN(num2)) {
			client.say(to, "Unable to process. Are you insane?");
		} else {
			roll(client, to, num1, num2);
		}
	}
}
}