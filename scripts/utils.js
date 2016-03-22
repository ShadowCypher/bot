// Description:
//  General fun and random utilities for hubots
//
// Commands:
//  is it tuesday? - Confirms if it is tuesday according to server time.
//  is it the weekend? - Confirms if it is the weekend according to server time.
//  hubot give me a carrot fact - Responds with a random carrot fact
//  hubot give me a quote - Responds with a random quote
//  ... how many/much ... - Outputs random integer(from 1-20) to answer a quantitative question.
//  what is ...? - Responds with an 'answer' to a math question or a random response

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

module.exports = function(robot) {

  /**
   * Listen for people asking if it is tuesday and response appropriately.
   * @author chacha
   */
  robot.hear( /is it tuesday/i, function ( response ){
    var today = new Date();
    response.reply( today.getDay() === 2 ? "IT IS TUESDAY!!!!!!!" : "Nope. Not Tuesday Yet." );
  } );

  /**
   * Listen for people asking if it is the weekend and response appropriately.
   * @author chacha
   */
  robot.hear( /is it the weekend/i, function ( response ){
    var today = new Date();
    response.reply( today.getDay() === 0 || today.getDay() === 6 ? "It is the freaken weekend." : "Nope. Get back to work." );
  } );

  /**
   * Listen for people asking for a quantity and respond randomly
   * @author bobron
   */
  robot.hear( /how (much|many)/i, function( response ) {
    response.reply( Math.floor(Math.random() * (20)) + 1);
  } );

  /**
   * Respond to requests for random carrot facts
   * @author chacha
   */
  robot.respond( /give me (.*)carrot fact(s)?/i, function( response ) {
     var fs = require("fs");
     var contents = fs.readFileSync("carrot-facts.csv") + " ";
     content = contents.split("\n");
     response.send( "> " + response.random( content ) );
  } );

  /**
   * Respond to requests for random quotes
   * @author chacha
   */
  robot.respond( /give me (.*)quote(s)?/i, function( message ){
    var fs = require("fs");
    var contents = fs.readFileSync("random-quotes.csv") + " ";
    content = contents.split("\n");
    message.send( "> " + message.random( content ) );
  } );
  robot.respond( /what is (.*)/i, function( message ){
    var input = message.match[1];
    if (input.indexOf( "+" ) != -1) {
      var numOne = Number(input.substring(0, input.indexOf( "+" )));
      var numTwo = Number(input.substring(input.indexOf( "+" )+1, input.length));
      var answer = numOne + numTwo;
    }
    else if (input.indexOf( "-" ) != -1) {
      var numOne = Number(input.substring(0, input.indexOf( "-" )));
      var numTwo = Number(input.substring(input.indexOf( "-" )+1, input.length));
      var answer = numOne - numTwo;
    }
    else if (input.indexOf( "*" ) != -1) {
      var numOne = Number(input.substring(0, input.indexOf( "*" )));
      var numTwo = Number(input.substring(input.indexOf( "*" )+1, input.length));
      var answer = numOne * numTwo;
    }
    else if (input.indexOf( "/" ) != -1) {
      var numOne = Number(input.substring(0, input.indexOf( "/" )));
      var numTwo = Number(input.substring(input.indexOf( "/" )+1, input.length));
      var answer = numOne / numTwo;
    }
    else {
      answer = message.random(["idk bro", "Cheese", "Pokémon", "OVER 9000", "42"]);
    }
    if (isNumber(answer)) {
      message.reply("idk im still in int math A. (If you want to do teh mathstuffs, use 'narwhal calculate')");
    }
    else {
      message.reply(answer);
    }
  } );
}
