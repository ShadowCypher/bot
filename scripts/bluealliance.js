// Description:
//  Allow hubot to interact with The Blue Alliance
//
// Commands:
//  hubot who is team <team number>: Display team information
//  hubot when|where is <event>: Display event information
//  hubot is <team> at <event>: Responds if a team is at an event
//  hubot was <team> at <event> playoffs: Reponds if a team was in the playoffs
//
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

  robot.respond( /(will|was|is) (\d*) (at|be at|attend) (.*)\s?/i, function ( message ){
    var team = message.match[2];
    var team_key = "frc" + team;
    var event = message.match[4].replace("?","");
    TBA.team.event.list( team_key, 2016, function( info ){
      var output = "No. I did not find " + team + " registered for " + event +".";
      var events = [];
      info.forEach( function( e, i, a ) {
        if ( e.key === event ) {
          output = "Yes, I found " + team + " listed for the " + e.name;
        }
        events.push( e.key );
      } );
      message.reply( output );
      message.reply( "They are registered for " + events.join( ", " ) );
    } );
  });

  robot.respond( /was (\d*) in (.*) playoffs\s?/i, function ( message ){
    var team = message.match[1];
    var team_key = "frc" + team;
    var event = message.match[2].replace("?","");
    TBA.event.get( event, function( info ){
      if ( info.name === undefined ) {
        message.reply(
          "There is no event with that name."
        );
      } else {
        if ( info.alliances.length === 0 ) {
          message.reply( "That event has not happened yet." );
          return;
        }

        output = "No. We could not find " + team + " in the playoffs for " + event;
        var playoff_teams = [];
        info.alliances.forEach( function( e, i, a ) {
          if ( team_key == e.picks[0] ) {
            output = "Yes. " + team + " was on Alliance #" + (i + 1) + " as Alliance Captian";
          } else if ( team_key == e.picks[1] ) {
            output = "Yes. " + team + " was on Alliance #" + (i + 1) + " as Pick #1";
          } else if ( team_key == e.picks[2] ) {
            output = "Yes. " + team + " was on Alliance #" + (i + 1) + " as Pick #2";
          }
        } );

        message.reply( output );
      }
    } );

  });

  robot.respond( /give me cache stats/, function ( message ){
    var stats = TBA.cache.stats;
    message.reply( "Currently the cache has " + stats.writes + " writes, " + stats.hits + " hits, and " + stats.misses + " misses." );
  } );

  robot.respond( /clear the cache/, function ( message ){
    TBA.cache.clear();

    var fs = require("fs");
    var contents = fs.readFileSync("random-quotes.csv") + " ";
    content = contents.split("\n");
    message.send( message.random( content ) + " (Done!)" );
  } );

};
