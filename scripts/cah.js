var _ = require('lodash');

var command = "!cah";

module.exports = function(client) {
    client.addListener("message", function(from, to, message) {
        if(message.indexOf(command) == 0) {
            if(message === command) {
                var arguments = ''
                main(client, from, to, arguments);  
            } else {
                var arguments = '';
                arguments = message.replace(/![a-z]\w+( )/g, "");
                console.log(arguments);
                main(client, from, to, arguments);  
            }
        }
    });
};

// Deck of black cards obtained through https://docs.google.com/spreadsheet/ccc?key=0AvTBixYzbvvCdFdHVnZ0V2FYWVl6ZkU4V1N3blFhNFE
var blacks = [
    "I got 99 problems but _ ain\'t one.",
    "Maybe she\'s born with it. Maybe it\'s _.",
    "During Picasso\'s often-overlooked Brown Period, he produced hundreds of paintings of _.",
    "TSA guidelines now prohibit _ on airplanes.",
    "What is Batman\'s guilty pleasure? _.",
    "Whats a girl\'s best friend? _.",
    "BILLY MAYS HERE FOR _.",
    "Daddy, why is Mommy crying? _.",
    "During sex, I like to think about _.",
    "I drink to forget _.",
    "Next from J.K. Rowling: Harry Potter and the Chamber of _.",
    "The new Chevy Tahoe. With the power and space to take _ everywhere you go.",
    "What did Vin Diesel eat for dinner? _.",
    "What does Dick Cheney prefer? _.",
    "What is Batman\'s guilty pleasure? _.",
    "What helps Obama unwind? _.",
    "What\'s the most emo? _.",
    "What\'s the next Happy Meal toy? _.",
    "When I am a billionare, I shall erect a 50-foot statue to commemorate _.",
    "While the United States raced the Soviet Union to the moon, the Mexican government funneled millions of pesos into research on _.",
    "Who stole cookies from the cookie jar? _.",
    "Why am I sticky? _.",
    "Why can\'t I sleep at night? _.",
    "Why do I hurt all over? _.",
    "Science will never explain _.",
    "Science will never explain the origin of _.",
    "What brought the orgy to a grinding halt? _.",
    "When all else fails, I can always masturbate to _.",
    "The healing process began when I joined a support group for victims of _.",
    "The votes are in, and the new high school mascot is _.",
    "As part of his contract, Prince won\'t perform without _ in the dressing room.",
    "Hey baby, come back to my place and I\'ll show you _.",
    "In the seventh circle of Hell, sinners must endure _ for all eternity.",
    "Loving you is easy because you\'re _.",
    "Turns out that _-Man was neither the hero we needed nor wanted.",
    "How am I compensating for my tiny penis? _.",
    "I\'m pretty sure I\'m high right now, because I\'m absolutely mesmerized by _.",
    "Help me doctor, I\'ve got _ in my butt!",
    "Hi MTV! My name is Kendra, I live in Malibu, I\'m into _, and I love to have a good time.",
    "In his farewell address George Washington famously warned Americans about the dangers of _.",
    "Now in bookstores: \'The Audacity of _.\'' by Barack Obama.",
    "Who killed my boner? _.",
    "Tonight on SNICK: \"Are You Afraid of _.\"",
    "Up next on Nickelodeon: \"Clarissa Explains _.\"",
    "Believe it or not Jim Carrey can do a dead-on impression of _.",
    "Dear Abby: I'm having some trouble with _ and would like your advice.",
    "*Heavy Breathing* Luke, I am _.",
    "This Holiday season, Tim Allen must overcome his fear of _ to save Christmas.",
    "Because they are forbidden from masturbating, Mormons channel their repressed sexual energy into _.",
    "I really hope my grandma doesn't have to explain _ again.",
    "_. Not even once.",
    "I'm so hungry I could eat _.",
    "_ is dead to me.",
    "_: The Other White Meat",
    "Danger! _ ahead!",
    "For just pennies a day you can give the needy Third World children _.",
    "I love the smell of _ in the morning.",
    "I'm sorry but we don't allow _ in the Country Club.",
    "Nothing beats cuddling with _ in bed.",
    "When I get old, I plan on talking to children about _ just to make them uncomfortable.",
    "If Westeros had porn, the most popular would feature _.",
    "When King Joffrey wants to have fun, he asks for _.",
    "If I had a direwolf, I would name it _.",
    "I wish I could cast Avada Kedavra on _!",
    "Who should be the next Defense Against The Dark Arts teacher? _.",
    "I still would be a virgin if it weren't for _.",
    "Rule 34 is always true, no exceptions, not even for _.",
    "_ is a man\'s best friend.",
    "50 shades of _.",
    "How did I lose my virginity? _.",
    "In an attempt to reach a wider audience, the Smithsonian Museum of Natural History has opened an interactive exhibit on _.",
    "In Michael Jackson\'s final moments, he thought about _.",
    "The class field trip was completely ruined by _.",
    "What is George W. Bush thinking about right now? _.",
    "What are school administrators using to curb rampant teenage pregnancy? _.",
    "I want to be _, just for a second. Just to see how it feels.",
    "Who should I be for Halloween? _.",
    "Yes, it is I, the world\'s most dangerous supervillian: Baron Von _.",
    "Ask your doctor if _ is right for you.",
    "Hannukkah was ruined last year due to _.",
    "I love the smell of _ in the morning.",
    "Jesus is _.",
    "James is a lonely boy. But when he discovers a secret door in his attic, he meets a magical new friend. _.",
    "Don\'t worry kid. It gets better. I\'ve been living with _ for 20 years,",
    "Behind every powerful man is _.",
    "You are not alone. Millions of Americans struggle with _ every day.",
    "Come to Dubai, where you can relax in our world famous spas, experience the nightlife, or simply enjoy _ by the poolside.",
    "I went to the desert and ate off the peyote cactus. Turns out my spirit animal is _.",
    "The six things I could never do without: oxygen, facebook, chocolate, netflix, friends, and _. LOL!",
    "Why won\'t you make love to me anymore? Is it _?",
    "Puberty is a time of change. You might notice hair growing in new places. You might develop an interest in _. This is normal.",
    "I\'m sorry Mrs. Chen, but there was nothing we could do. At 4:15 this morning, your son succumbed to _.",
    "I\'m Miss Tennessee, and if I could make the world better by changing one thing, I would get rid of _.",
    "Everybody join hands and close your eyes. Do you sense that? That\'s the presence of _ in this room."
];


function randomThing() {
    var int = _.random(10, 25);
    var int2 = _.random(1, 50);

    // Shuffle the deck 'int' times.
    for (x = 0; x < int; x++) {
        for (i = blacks.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = blacks[i];
            blacks[i] = blacks[j];
            blacks[j] = temp; 
        }
    }

    // Pick a random card 'int2' times.
    for (i = 0; i < int2; i++) {
        blackString = _.sample(blacks);
    }

    console.log("The card: " + blackString + ", was chosen by shuffling the deck " + int + " times, and then picking a random card " + int2 + " times.");

    return blackString;
}

function trim1 (str) {
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

function main(client, from, to, arguments) {
    var target = ''
    target = trim1(arguments);
    var chosen = randomThing();
    var finalString = '';

    console.log(target);

    JSON.stringify(chosen);

    if (!target.length || target.length === 0 || target === "" || target.length > 200 || target.indexOf(".") > -1 || target.indexOf("=") > -1 ) {
        finalString = chosen.replace("_", from);
    } else {
        finalString = chosen.replace("_", target);
    }

    client.say(to, finalString);
}
