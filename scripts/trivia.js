// Description:
//  Trivia Game
module.exports = function(robot) {

  var game_info = {
    'enabled' : false,
    'room'    : false,
    'users'   : [],
    'teams'   : [],
  };

  robot.respond( /start the game/, function ( response ){
    if ( should_respond( response ) ) {
      response.reply( "Game has already been started in #" + game_info.room );
      return;
    }
    game_info.room    = response.message.user.room;
    game_info.enabled = true;
    response.reply( "Starting the quiz in " + game_info.room );
  } );

  robot.respond( /end the game/, function ( response ){
    response.reply( "Ending the game in " + game_info.room );
    game_info.room    = false;
    game_info.enabled = false;
    game_info.users   = [];
  } );

  robot.respond( /join team (\d*)/i, function( response ) {
    if ( should_respond( response ) ) {
      response.reply( "You're already playing." );
    } else if ( game_info.enabled === false ) {
      response.reply( "There is no game going on." );
    } else if ( game_info.room !== response.message.user.room ) {
      response.reply( "You're not in the right room. Go to #" + game_info.room );
    } else {
      game_info.users.push( response.message.user.id );

      var team = response.match[1];
      if ( game_info.teams[ team ] === undefined ) {
        game_info.teams[ team ] = [ response.message.user.id ];
        response.reply( "Started a new team #" + team );
      } else {
        game_info.teams[ team ].push( response.message.user.id );
        response.reply( "Joined team #" + team );
      }
    }
  } );

  robot.respond( /leave team/i, function( response ) {
    if ( ! should_respond( response ) ) { return; }
    var team = find_team( response.message.user.id );
    response.reply( "You're on team " + team );
  } );

  robot.respond( /am i playing/, function( response ) {
    if ( should_respond( response ) ) {
      response.reply( "Yes, you are playing." );
    } else {
      response.reply( "No, you're not playing." );
    }
  } );

  function find_team( user_id ) {
    result = -1;
    game_info.teams.forEach( function( e, i, a ){
      if ( e.indexOf( user_id )  !== -1 ) {
        result = i;
      }
    } );
    return result;
  }

  function should_respond( response ) {

    if ( game_info.enabled === false
      || response.message.user.room !== game_info.room
      || game_info.users.indexOf( response.message.user.id ) === -1 ){
      return false;
    }

    return true;
  }
}
