
var match = ''
    , dbActions = require('./../persist.js')
    , slackRes = ''
    , newMatchID = '';

/*
* import redis
* GET match object
* I need to figure out which match I am throwing against
* I need to add my throw into the DB
* I need to compare the throws
* I need to print a winner
* */

exports.post = function(req, res, next) {
    var requestBodyText = req.body["text"];
    var requestBodyUserName = req.body["user_name"];
    var requestChannelId = req.body["channel_id"];

    var rock = requestBodyText.search(":the_horns:");
    var paper = requestBodyText.search(":memo:");
    var scissors = requestBodyText.search(":scissors:");

    newMatchID = "activeMatch_" + requestChannelId;
    /*
    match = {
        "matchName": newMatchID,
        "firstPlayerThrow": troubleMakerThrow,
        "invitedPlayer": invitedPlayer,
        "active": 1,
        "answers": []
    }
    */


dbActions.getMatch(newMatchID, messAroundWithCurrentMatch);

    function messAroundWithCurrentMatch(data) {
        console.log(data)
    }

    res.json({
        "username": "outgoing-rps-finish",
        "text": "Somebody won! Or maybe it was a tie? You decide because I'm not smart enough yet!"
    });

    // next();
};