/*
# Description:
#   General fun and random utilities for hubots
#
# Commands:
#   hubot is it tuesday? - Confirms if it is tuesday according to server time.
#   hubot is it the weekend? - Confirms if it is the weekend according to server time.
*/

module.exports = function(robot) {
  robot.hear( /is it tuesday\s?\s?/i, function ( response ){
    var today = new Date();
    response.reply( today.getDay() === 2 ? "IT IS TUESDAY!!!!!!!" : "Nope. Not Tuesday Yet." );
  } );
  robot.hear( /is it the weekend\s?\s?/i, function ( response ){
    var today = new Date();
    response.reply( today.getDay() === 0 || today.getDay() === 6 ? "It is the freaken weekend." : "Nope. Get back to work." );
  } );
}