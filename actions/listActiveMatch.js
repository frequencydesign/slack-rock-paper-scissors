var dbActions = require('./../persist.js');


function listActiveMatch(data) {
    var theMatchData = JSON.parse(data);
    var newMatchID = theMatchData.matchName;
    console.log("listActiveMatch theMatchData.active " + theMatchData.active);
    if (theMatchData.active != 1) {
        console.log("No active match. Setting up new match.")
    } else {
        var slackRes = "Closing last match. \n";
        dbActions.getMatch(newMatchID, closeMatch);
    }
}

function closeMatch(data) {
    var theMatchData = JSON.parse(data);
    var newMatchID = theMatchData.matchName;
    console.log(theMatchData.active);
    theMatchData.active = 0;
    console.log(theMatchData.active);
    dbActions.disableMatch(newMatchID, JSON.stringify(theMatchData), confirmCloseMatch)
}

function confirmCloseMatch(reply) {
    console.log(reply);
}

module.exports = listActiveMatch;