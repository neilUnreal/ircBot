var request = require('request');
var c = require('irc-colors');

function generateRURL(arguments) {
  var urlPrefix = "https://www.reddit.com/r/";
  var subreddit = arguments;
  var urlSuffix = "/top.json?sort=top";

  var fullUrl = urlPrefix + subreddit + urlSuffix;
  return fullUrl;
  console.log(fullUrl);
}

function r(client, from, to, arguments) {
  console.log(arguments);
  var fullUrl = "https://www.reddit.com/r/all/top.json";
  var subreddit = ''
  subreddit = arguments;
  JSON.stringify(subreddit);
  console.log(subreddit + " " + subreddit.length);

  if(subreddit == "!r" || subreddit == " ") {
    subreddit = "all";
  }

  fullUrl = generateRURL(subreddit);

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

  request(requestObject, function(error, response, body) {
    console.log("requested.");

    if(error) {
      client.say(to, "[reddit] It appears that the server is down. Try again in a little bit!");
    } else {
      console.log("pulled.");
      console.log(JSON.parse(body));
      var result = JSON.parse(body);
      console.log(result.data.children[0].data.title);
      console.log(result.data.children[0].data.url);
      console.log(result.data.children[0].data.subreddit);
      console.log(result.data.children[0].data.score);
      var result = JSON.parse(body);
      var pTitle = result.data.children[0].data.title;
      var pURL = result.data.children[0].data.url;
      var pSubreddit = "\/r\/" + result.data.children[0].data.subreddit;
      var pScore = result.data.children[0].data.score;

      client.say(to, "[reddit - Top of /r/" + subreddit + " currently] " + pTitle + " - " + pSubreddit + ": " + pURL + " " + "(" + pScore + " points)");
    }
  });
}

module.exports = function(client) {
	client.addListener("message", function (from, to, message) {
		if(message.indexOf("!r") == 0) {
			var arguments = '';
			arguments = message.replace(/![a-z]\W+()/, "");
      console.log("ayy");
			r(client, from, to, arguments);
		}
  });
}
