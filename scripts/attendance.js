// Description:
//  Allows hubot to respond with attendance information
//
// Commands:
//  hubot who has the most hours: Gives the top 3 hour earners
//  hubot when were hours last updated: Gives how long ago attendance was updated
//
module.exports = function(robot) {

  robot.respond( /who has the most hours\s?/i, function ( message ){

    var options = {
      host: 'raw.githubusercontent.com',
      path: '/Team3128/attendance-data/master/summary.csv'
    };

    simple_https( options, function( data ) {
        lines = data.split( "\n" );
        length = lines.length;

        output = 'These three people have the most hours: '
        var strings = [];
        lines.slice( length - 5, length - 2).forEach( function( e, i, a ){
          var parts = e.split( "," );
          strings.push( parts[0] + "(" + parts[1] + ")" );
        } );
        strings.reverse();
        output += strings.join( ", " );

        message.reply( output );
      });
    });

    robot.respond( /when were hours last updated\s?/i, function ( message ){
      var options = {
        host: 'api.github.com',
        path: '/repos/Team3128/attendance-data/commits',
        headers: { 'user-agent' : 'Team3128'},
      };
      simple_https( options, function( data ) {
          data = JSON.parse( data );
          last_commit = data[0];
          author = last_commit.commit.author;
          date = timeDifference( new Date().getTime(), Date.parse( author.date ) );
          output = "Attendance was last updated " + date + " by " + author.name;
          message.reply( output );
      });
    });

    function simple_https( options, callback ) {
      var https = require('https');
      c = function( response ) {
        var data = '';
        response.on( 'data', function (chunk) {
          data += chunk;
        });
        response.on( 'end', function () {
          callback( data );
        });
      }
      https.request(options, c).end();
    }

    function timeDifference(current, previous) {

      var msPerMinute = 60 * 1000;
      var msPerHour = msPerMinute * 60;
      var msPerDay = msPerHour * 24;
      var msPerMonth = msPerDay * 30;
      var msPerYear = msPerDay * 365;

      var elapsed = current - previous;

      if (elapsed < msPerMinute) {
        return 'a couple seconds ago'
      }

      else if (elapsed < msPerHour) {
        var count = Math.round(elapsed/msPerMinute);
        if ( count === 1 ) {
          return 'about a minute ago';
        } else {
          return 'about ' + count + ' minutes ago';
        }
      }

      else if (elapsed < msPerDay ) {
        var count = Math.round(elapsed/msPerHour);
        if ( count === 1 ) {
          return 'about an hour ago';
        } else {
          return 'about ' + count + ' hours ago';
        }
      }

      else if (elapsed < msPerMonth) {
          var count = Math.round(elapsed/msPerDay);
          if ( count === 1 ) {
            return 'about a day ago';
          } else {
            return 'about ' + count + ' days ago';
          }
      }

      else if (elapsed < msPerYear) {
        var count = Math.round(elapsed/msPerMonth);
        if ( count === 1 ) {
          return 'about a month ago';
        } else {
          return 'about ' + count + ' months ago';
        }
      }

      else {
        var count = Math.round(elapsed/msPerYear);
        if ( count === 1 ) {
          return 'about a year ago';
        } else {
          return 'about ' + count + ' years ago';
        }
      }
    }
}
