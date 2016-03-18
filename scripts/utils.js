// Description:
//  General fun and random utilities for hubots
//
// Commands:
//  is it tuesday? - Confirms if it is tuesday according to server time.
//  is it the weekend? - Confirms if it is the weekend according to server time.
//  hubot give me a carrot fact - Responds with a random carrot fact
//  hubot give me a quote - Responds with a random quote
module.exports = function(robot) {
  robot.hear( /is it tuesday\s?\s?/i, function ( response ){
    var today = new Date();
    response.reply( today.getDay() === 2 ? "IT IS TUESDAY!!!!!!!" : "Nope. Not Tuesday Yet." );
  } );
  robot.hear( /is it the weekend\s?\s?/i, function ( response ){
    var today = new Date();
    response.reply( today.getDay() === 0 || today.getDay() === 6 ? "It is the freaken weekend." : "Nope. Get back to work." );
  } );
  robot.respond( /give me a carrot fact/, function( response ) {
     var fs = require("fs");
     var contents = fs.readFileSync("carrot-facts.csv") + " ";
     content = contents.split("\n");
     response.send( response.random( content ) );
  } );
  robot.respond( /give me a quote/, function( message ){
    var fs = require("fs");
    var contents = fs.readFileSync("random-quotes.csv") + " ";
    content = contents.split("\n");
    message.send( message.random( content ) );
  } );
}
