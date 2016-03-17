module.exports = function(robot) {
  var TBA = require( './tba-api.js');
  robot.hear( /what is the blue alliance\s?/, function ( message ){
    message.send( "The Blue Alliance is a site where anyone can view basic information and statistics on FIRST FRC Teams. http://thebluealliance.com." );
    message.send( TBA.version() );
  });

  robot.respond( /who is team (\d*)\s?/i, function ( message ){
    var team = message.match[1].replace("?","");
    TBA.team.get( "frc"+team, function( info ){

      if ( info.nickname === undefined ) {
        message.reply(
          "There is no team with that number."
        );
      } else {
        message.reply(
          "Team " + team + " (" + info.nickname + ")"
          + " from " + info.location
          + " started in " + info.rookie_year + "."
          + " Their website is " + info.website
        );
      }
    } );
  });

  robot.respond( /when is (.*)\s?/i, function ( message ){
    var event = message.match[1].replace("?","");
    TBA.event.get( event, function( info ){
      if ( info.name === undefined ) {
        message.reply(
          "There is no event with that name."
        );
      } else {
        message.reply(
          "The " + info.name + " is from " + info.start_date + " until " + info.end_date + "."
        );
      }
    } );
  });

  robot.respond( /where is (.*)\s?/i, function ( message ){
    var event = message.match[1].replace("?","");
    TBA.event.get( event, function( info ){
      if ( info.name === undefined ) {
        message.reply(
          "There is no event with that name."
        );
      } else {
        message.reply(
          "The " + info.name + " is located at: " + info.venue_address + "."
        );
      }
    } );
  });
};
