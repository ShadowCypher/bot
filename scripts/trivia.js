// Description:
//  Trivia Game
module.exports = function(robot) {

  var current = false;

  var game = ( function ( room ) {
    var obj = {
      'room'  : room,
      'users' : [],
      'teams' : [],
      'questions'       : [],
      'current_answers' : [],
    };

    obj.next_question = function( response ) {
      var id = Math.floor( Math.random() * obj.questions.length );
      var data = obj.questions.splice( id, 1 )[0].toLowerCase().split(",");
      var question = data.splice(0,1);
      obj.current_answers = data;
      response.reply( question );
    }

    obj.is_answer = function( string ) {
      string = string.toLowerCase();
      if ( obj.current_answers.indexOf( string ) !== -1 ) {
        return true;
      } else {
        return false;
      }
    }

    obj.is_user_playing = function( user ) {
       return user.room === obj.room && find_team( user.id ) !== -1;
    }

    obj.add_user = function( user, team ) {
      if ( obj.is_user_playing( user ) ) {
        return false;
      }

      if ( obj.teams[ team ] === undefined ) {
        obj.teams[ team ] = [ user.id ];
      } else {
        obj.teams[ team ].push( user.id );
      }

      return true;
    }

    obj.remove_user = function( user ) {
      if ( ! obj.is_user_playing( user ) ) {
        return false;
      }

      team = find_team( user.id );
      if ( team !== -1 ) {
        obj.teams[team].splice( obj.teams[team].indexOf( user.id ), 1 );
      }
      obj.users.splice( obj.users.indexOf( user.id ), 1 );
      return true;
    }

    function find_team( user_id ) {
      result = -1;
      obj.teams.forEach( function( e, i, a ){
        if ( e.indexOf( user_id )  !== -1 ) {
          result = i;
        }
      } );
      return result;
    }

    var fs = require("fs");
    var contents = fs.readFileSync("quiz.csv") + " ";
    obj.questions = contents.split("\n");

    return obj;
  });

  robot.respond( /(start game|start the game)/, function ( response ){
    current = game( response.message.user.room );
    response.reply( "Starting the quiz in " + current.room );
  } );

  robot.respond( /(end game|end the game|stop game|stop the game)/, function ( response ){
    if ( current === false ) { return false; }
    current = false;
    response.reply( "Stopped the game." );
  } );

  robot.respond ( /(start questions|first question|give me a question|skip|skip question|next|next question)/, function( response ) {
    if ( current === false ) { return false; }
    current.next_question( response );
  } );

  robot.listen( function( message ){
      return current !== false && current.is_user_playing( message.user );
    }, function( response ){
    if ( current.is_answer( response.message.text ) ) {
      response.reply( "CORRECT!" );
      current.next_question( response );
    }
  });

  robot.respond( /join team (\d*)/i, function( response ) {

      if ( ! current ) {
        response.reply( "There is no game going on." );
        return;
      } else if ( current.is_user_playing( response.message.user ) ) {
        response.reply( "You are already playing." );
        return;
      } else if ( response.message.user.room != current.room ) {
        response.reply( "You are not in the correct room. Join #" + current.room + "." );
        return;
      }

      status = current.add_user( response.message.user, response.match[1] );
      if ( status ) {
        response.reply( "I added you to team #" + response.match[1] );
      } else {
        response.reply( "I am sorry. Something has gone wrong." );
      }
  } );

  robot.respond( /(leave game|leave team|quit team|quit game)/i, function( response ) {
    if ( ! current ) {
      response.reply( "There is no game going on." );
      return;
    } else if ( ! current.is_user_playing( response.message.user ) ) {
      response.reply( "You are not currently playing." );
      return;
    } else if ( response.message.user.room != current.room ) {
      response.reply( "You are not in the correct room. Join #" + current.room + "." );
      return;
    }

    status = current.remove_user( response.message.user );
    if ( status ) {
      response.reply( "I have removed you from the game." );
    } else {
      response.reply( "I am sorry. Something has gone wrong." );
    }
  } );

  robot.respond( /am i playing/, function( response ) {
    if ( current === false ) { return false; }

    if ( current.is_user_playing( response.message.user ) ) {
      response.reply( "Yes, you are playing." );
    } else {
      response.reply( "No, you're not playing." );
    }
  } );

}
