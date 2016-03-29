//var bodyParser = require("body-parser")
var match = ''
    , dbActions = require('./../persist.js')
    , activeMatch = ''
    , redis = require('redis')
    , matchnameText = ''
    , triggerWord = ''
    , channelId = ''
    , matchnameText = ''
    , slackRes = ''
    , rtg = ''
    , newMatchID = ''
    , ts = Math.floor(Date.now() / 1000);

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

    match = {
        "matchName": matchnameText,
        "active": 1,
        "answers": []
    }

    newMatchID = "activeMatch_" + ts;


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
        if (invitedPlayer.length > 0) {
            if(troubleMakerThrowWrong) {
                res.json({
                    "username": "outgoing-rps",
                    "text": troubleMakerThrowWrong + JSON.parse(data)
                });
            } else {
                res.json({
                    "username": "outgoing-rps",
                    "text": "Ready to battle <" + invitedPlayer + ">?\nthrow a :the_horns: :memo: or :scissors: to battle. @" + requestBodyUserName + " threw-down " + troubleMakerThrow  + JSON.parse(data)
                });
            }
        } else {
            res.json({
                "username": "outgoing-rps",
                "text": "You idiot! You didn't choose anyone to battle with!"  + JSON.parse(data)
            });
        }
    }

    next();
};