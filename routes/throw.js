
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
    /*
    match = {
        "matchName": newMatchID,
        "firstPlayerThrow": troubleMakerThrow,
        "invitedPlayer": invitedPlayer,
        "active": 1
    }
    */


dbActions.getMatch(newMatchID, secondPlayerThrow);

    function secondPlayerThrow(data) {
        console.log(data);
        var theMatchData = JSON.parse(data);
        requestBodyUserId = "@"+requestBodyUserId;
        var firstPlayerThrow = theMatchData.firstPlayerThrow;
        console.log(theMatchData.invitedPlayer);
        console.log(theMatchData.active);
        console.log(requestBodyUserId);
        console.log(requestBodyUserName);

        if (theMatchData.active != 1) {
            res.json({
                "username": "outgoing-rps-finish",
                "text": "Nobodies playing!\nStart a match by challenging someone to a Battle with :video_game::punch:" +
                "\nthen mention them with @ and make your throw with :the_horns: :memo: or :scissors:"
            });
        } else if (theMatchData.invitedPlayer != requestBodyUserId) {
            res.json({
                "username": "outgoing-rps-finish",
                "text": "You weren't invited to play.\n<" + theMatchData.invitedPlayer + "> needs to make a throw first."
            });
        } else {

            if (firstPlayerThrow == ":the_horns:") {
                if (troubleMakerThrow == ":memo:") {
                    res.json({
                        "username": "outgoing-rps-finish",
                        "text": "<" + requestBodyUserId + "> wrapped up the first player's throw"
                    })
                } else if (troubleMakerThrow == ":scissors:") {
                    res.json({
                        "username": "outgoing-rps-finish",
                        "text": "The first player smashed <" + requestBodyUserId + ">'s throw"
                    })
                } else {
                    res.json({
                        "username": "outgoing-rps-finish",
                        "text": "You two squared up in a tie."
                    })
                }
            } else if (firstPlayerThrow == ":memo:") {
                if (troubleMakerThrow == ":the_horns:") {
                    res.json({
                        "username": "outgoing-rps-finish",
                        "text": "The first player wrapped up <" + requestBodyUserId + ">'s throw"
                    })
                } else if (troubleMakerThrow == ":scissors:") {
                    res.json({
                        "username": "outgoing-rps-finish",
                        "text": "<" + requestBodyUserId + "> sliced up the first player's throw"
                    })
                } else {
                    res.json({
                        "username": "outgoing-rps-finish",
                        "text": "You two squared up in a tie."
                    })
                }
            } else if (firstPlayerThrow == ":scissors:") {
                if (troubleMakerThrow == ":memo:") {
                    res.json({
                        "username": "outgoing-rps-finish",
                        "text": "The first player sliced up <" + requestBodyUserId + ">'s throw"
                    })
                } else if (troubleMakerThrow == ":the_horns:") {
                    res.json({
                        "username": "outgoing-rps-finish",
                        "text": "<" + requestBodyUserId + "> smashed the first player's throw"
                    })
                } else {
                    res.json({
                        "username": "outgoing-rps-finish",
                        "text": "You two squared up in a tie."
                    })
                }
            }

            //dbActions.getMatch(newMatchID, closeMatch);
/*
            function closeMatch(data) {
                var theMatchData = JSON.stringify(data);
                console.log(data);
                console.log(data.invitedPlayer);
                console.log(data.active);
                console.log(theMatchData);
                console.log(theMatchData.invitedPlayer);
                console.log(theMatchData.active);
                data.active = 0;
                dbActions.disableMatch(newMatchID, data, confirmCloseMatch)
            }

            function confirmCloseMatch(data) {
                console.log(data);
                console.log(data.invitedPlayer);
                console.log(data.active);
                slackRes = "Closing last match. \n";
            }
*/
            theMatchData.active = 0;
            dbActions.disableMatch(newMatchID, theMatchData, confirmCloseMatch);
            function confirmCloseMatch(data) {
                console.log(data);
                console.log(data.invitedPlayer);
                console.log(data.active);
            }

        }
    }


    // next();
};