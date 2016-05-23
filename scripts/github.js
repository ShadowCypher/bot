// Description:
//  Allow hubot to interact with the team's GitHub repository
//
// Commands:
// what issues are open? - Listes all open issues in the info repository
// show me issues with the <name> label - Lists all open issues that have the <name> label
// describe the <name> issue? - Returns the body of the issue with the title <name>
// show me the description of the <name> issue? - Returns the body of the issue with the title <name>
// what is the description of the <name> issue? - Returns the body of the issue with the title <name>
// what is the <name> issue? - Returns the body of the issue with the title <name>
//

module.exports = function(robot) {
  var github = require('githubot');

  robot.hear( /what issues are open\s?/i, function (response) {
    github.get( "https://api.github.com/repos/Team3128/info/issues", function (issues) {
      var list = "\n";
      for (i = 0; i < issues.length; i++) {
        list += "> " + issues[i].title + "\n";
      }
      response.reply(list);
    });
  });

  robot.hear( /show me issues with the (.*) label/i, function (message) {
    var input = message.match[1];
    github.get( "https://api.github.com/repos/Team3128/info/issues", function (issues) {
      var list = "\n";
      for (i = 0; i < issues.length; i++) {
        var issue = issues[i];
        if (issue.labels != "") {
          for (j = 0; j < issue.labels.length; j++) {
            if (issue.labels[j].name.includes(input)) {
              list += "> *" + issue.title + "*: " + issue.labels[0].name + "\n";
            }
          }
        }
      }
      message.reply(list);
    });
  });

  robot.hear( /(describe|show me the description of) the (.*) issue\s?/i, function (message) {
    var input = message.match[2];

    github.get( "https://api.github.com/repos/Team3128/info/issues", function (issues) {
      for (i = 0; i < issues.length; i++) {
        var issue = issues[i];
        if (issue.title.toUpperCase().includes(input.toUpperCase())) {
            message.reply("\n > *" + issue.title + "*: \n > s" + issue.body );
        }
      };
    });
  });

  };
