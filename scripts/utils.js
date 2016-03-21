// Description:
//  General fun and random utilities for hubots
//
// Commands:
//  is it tuesday? - Confirms if it is tuesday according to server time.
//  is it the weekend? - Confirms if it is the weekend according to server time.
//  hubot give me a carrot fact - Responds with a random carrot fact
//  hubot give me a quote - Responds with a random quote
//  ... how many/much ... - Outputs random integer(from 1-20) to answer a quantitative question.
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
}
