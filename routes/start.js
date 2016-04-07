var match = ''
    , dbActions = require('./../persist.js')
    , slackRes = ''
    , newMatchID = '';

exports.post = function(req, res, next) {

    var requestBodyText = req.body["text"];
    var requestBodyUserName = req.body["user_name"];
    var requestBodyUserId = "@" + req.body["user_id"];
    var requestChannelId = req.body["channel_id"];
    var mentions = requestBodyText.match(/\B@[a-z0-9_-]+/gi);
    var invitedPlayer = mentions[0];

    var rock = requestBodyText.search(":the_horns:");
    var paper = requestBodyText.search(":memo:");
    var scissors = requestBodyText.search(":scissors:");

    if ( ((rock > 2) && ((paper > 2) || (scissors > 2))) || ((paper > 2) && (scissors > 2)) ) {
        var troubleMakerThrowWrong = "You threw too many signs yo!";
    } else if (rock > 2) {
        var troubleMakerThrow = ":the_horns:";
    } else if (paper > 2) {
        var troubleMakerThrow = ":memo:";
    } else if (scissors > 2) {
        var troubleMakerThrow = ":scissors:";
    } else {
        var troubleMakerThrowWrong = "You didn't start with a throw!";
    }

    newMatchID = "activeMatch_" + requestChannelId;
    match = {
        "matchName": newMatchID,
        "firstPlayerId": requestBodyUserId,
        "firstPlayerThrow": troubleMakerThrow,
        "invitedPlayer": invitedPlayer,
        "active": 1
    };

    dbActions.getMatch(newMatchID, listActiveMatch);
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


    /*
    * Start New Match.
    * Print Starting Throw
    *
    */

    dbActions.setMatch(newMatchID, JSON.stringify(match), printNewMatch);

    function printNewMatch() {
        dbActions.getMatch(newMatchID, confirmNewMatch);
    }

    function confirmNewMatch(data) {
        var theMatchData = JSON.parse(data);
        console.log(theMatchData);
        if (theMatchData.invitedPlayer.length > 2) {
            if(troubleMakerThrowWrong) {
                res.json({
                    "username": "outgoing-rps",
                    "text": slackRes + troubleMakerThrowWrong
                });
            } else {
                res.json({
                    "username": "outgoing-rps",
                    "text": slackRes + "Ready to battle <" + theMatchData.invitedPlayer + ">?\nthrow a :the_horns: :memo: or :scissors: to battle. @" + requestBodyUserName + " threw-down " + theMatchData.firstPlayerThrow
                });
            }
        } else {
            res.json({
                "username": "outgoing-rps",
                "text": slackRes + "You idiot! You didn't choose anyone to battle with!"
            });
        }
    }

    //next();
};