//var bodyParser = require("body-parser")
var match = ''
    , dbActions = require('./../persist.js')
    , slackRes = ''
    , newMatchID = '';

exports.post = function(req, res, next) {
    //console.log('Start route.');
    //res.send("Res.Send Start.");
    /*
     UPON POSTING
     Send a request for an opponent
     Consider a timer for accepting of a match
     when a match is accepted, create a match in the DB so that there is something to hold the answers and compare winners

     "username": "outgoing-rps",
     //"icon_emoji": ":ghost:",
     "text": "Ready to battle <" + invitedPlayer + ">? /throw a :punch: :memo: or :scissors: to battle. @" + requestBodyUserName + " said " + requestBodyText + " oh and " + mentions

     */

    //var requestBody = req.body.urlencoded;
    var requestBodyText = req.body["text"];
    var requestBodyUserName = req.body["user_name"];
    var requestChannelId = req.body["channel_id"];
    //var pattern = /\B@[a-z0-9_-]+/gi;
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
        "firstPlayerThrow": troubleMakerThrow,
        "invitedPlayer": invitedPlayer,
        "active": 1
    }


    dbActions.getMatch(newMatchID, listActiveMatch);
    function listActiveMatch(data) {
        console.log("Current match: " + data);
        console.log("data.active " + data.active);
        if (data.active != 1) {
            console.log("No active match. Setting up new match.")
        } else {
            //dbActions.setMatch(newMatchID, JSON.stringify(match), printNewMatch);
            dbActions.getMatch(newMatchID, closeMatch);
        }
    }

    function closeMatch(data) {
        var theMatchData = JSON.stringify(data);
        theMatchData.active = 0;
        dbActions.disableMatch(newMatchID, JSON.stringify(theMatchData), confirmCloseMatch)
    }

    function confirmCloseMatch(data) {
        var theMatchData = JSON.stringify(data);
        console.log(theMatchData.active);
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
        //console.log("confirmNewMatch");
        console.log(data);
        var theMatchData = JSON.parse(data);
        console.log(theMatchData.invitedPlayer);
        //console.log(res);
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