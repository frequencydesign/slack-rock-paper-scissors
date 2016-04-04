
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
    console.log(req.body);
    var requestBodyText = req.body["text"];
    var requestBodyUserName = req.body["user_name"];
    var requestBodyUserId = req.body["user_id"];
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


dbActions.getMatch(newMatchID, secondPlayerThrow);

    function secondPlayerThrow(data) {
        console.log(data)
        var theMatchData = JSON.parse(data)
        console.log(theMatchData.invitedPlayer);
        console.log(requestBodyUserId);
        console.log(requestBodyUserName);
        if (theMatchData == null) {
            res.json({
                "username": "outgoing-rps-finish",
                "text": "Nobodies playing!\nStart a match by calenging someone to a Battle with :video_game::punch:" +
                "\nthen mention them with @ and make your throw with :the_horns: :memo: or :scissors:"
            });
        } else if (theMatchData.invitedPlayer != requestBodyUserId) {
            res.json({
                "username": "outgoing-rps-finish",
                "text": "You weren't invited to play.\n<" + theMatchData.invitedPlayer + "> needs to make a throw first."
            });
        } else {
            res.json({
                "username": "outgoing-rps-finish",
                "text": "Somebody won! Or maybe it was a tie? You decide because I'm not smart enough yet!"
            });
        }
    }


    // next();
};