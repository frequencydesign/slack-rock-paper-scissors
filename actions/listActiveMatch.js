function listActiveMatch(data) {
    var theMatchData = JSON.parse(data);
    console.log("listActiveMatch theMatchData.active " + theMatchData.active);
    if (theMatchData.active != 1) {
        console.log("No active match. Setting up new match.")
    } else {
        dbActions.getMatch(newMatchID, closeMatch);
    }
}

function closeMatch(data) {
    var theMatchData = JSON.parse(data);
    console.log(theMatchData.active);
    theMatchData.active = 0;
    console.log(theMatchData.active);
    dbActions.disableMatch(newMatchID, JSON.stringify(theMatchData), confirmCloseMatch)
}

function confirmCloseMatch() {
    slackRes = "Closing last match. \n";
}

module.exports = listActiveMatch;