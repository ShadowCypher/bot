// Description:
//  General fun and random utilities for hubots
//
// Commands:
//  (show me|what is on) the todo list - Shows the todo list
//  add <something> to the todo list - Adds <something> to the todo list
//  remove item <number> from the todo list - Removes the item at index <number> from the list

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

module.exports = function(robot) {

  robot.respond( /show me the (todo|to do) list/i, function( message ){
    var fs = require("fs");
    var contents = fs.readFileSync("todo.txt") + " ";
    content = contents.split("\n");

    var i = 0;
    var finalstring = "";
    for (i = 0; i < content.length; i++) {
      finalstring += "> " + content[i] + "\n";
    }

    message.send(finalstring);

  } );

  robot.respond( /add (.*) to the (todo|to do) list/i, function( message ){
    var fs = require("fs");

    fs.appendFile("todo.txt", message.match[1] + "\n", function( err ) {
      if (err) {
        message.send("It failed...");
        throw err;
      }
      message.send("Done");
    } );

  } );

  robot.respond( /remove item (.*) from the (todo|to do) list/i, function( message ){
    var fs = require("fs");
    var contents = fs.readFileSync("todo.txt") + " ";
    content = contents.split("\n");

    var id = message.match[1];
    content.splice(id-1, 1);

    var i = 0;
    var finalstring = "";
    for (i = 0; i < content.length - 1; i++) {
      finalstring += content[i] + "\n";
    }

    fs.writeFile("todo.txt", finalstring, function( err ) {
      if (err) {
        message.send("It failed...");
        throw err;
      }
      message.send("Done");
    } );

  } );

}
