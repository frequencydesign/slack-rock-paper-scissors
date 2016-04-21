//var Promise = require("bluebird");
var Q = require("q");

var match = ''
    , dbActions = require('./../persist.js')
    , slackRes = ''
    , newMatchID = ''
    , listActiveMatch = require("./../actions/listActiveMatch.js");

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
        "active": null
    };

    //this gets run first, and checks if there's an active match, and if there is, closes the match
//var checkForOpenGameAndCloseItFirst = new Promise()
    /*
    var checkCurrentMatchAndThenHandleNewMatch = new Promise(function (resolve, reject) {
        return dbActions.getMatch(newMatchID, listActiveMatch)
            .then(function() {
            dbActions.setMatch(newMatchID, JSON.stringify(match), printNewMatch)
        });

    });

    checkCurrentMatchAndThenHandleNewMatch();
    */

/*    function groupPromise() {
        Q.all(
            dbActions.getMatch(newMatchID, listActiveMatch),
            dbActions.setMatch(newMatchID, JSON.stringify(match), printNewMatch)
        )
    }
    groupPromise();*/
    /*
    Q.fcall(dbActions.getMatch(newMatchID, listActiveMatch))
        .then(function () {
            dbActions.setMatch(newMatchID, JSON.stringify(match), printNewMatch)
        })
        .done();
    */


/*
    function disableCurrentMatch() {

        dbActions.getMatch(newMatchID, listActiveMatch);

    }
    disableCurrentMatch();
*/
    /*
    dbActions.getMatch(newMatchID, listActiveMatch);
    function setupNewMatch() {
        dbActions.setMatch(newMatchID, JSON.stringify(match), printNewMatch);
    }

    setTimeout(setupNewMatch, 1000);*/
    //setTimeout(dbActions.setMatch(newMatchID, JSON.stringify(match), printNewMatch), 5000);
    //dbActions.setMatch(newMatchID, JSON.stringify(match), printNewMatch);

    var promise = new Q(function(resolve, reject) {
        dbActions.getMatch(newMatchID, isMatchActive);
        function isMatchActive(data){
            var isMatchActiveData = JSON.parse(data);
            console.log("isMatchActiveData.active " + isMatchActiveData.active);
            if (isMatchActiveData.active == 1) {
                dbActions.disableMatch(newMatchID, JSON.stringify(isMatchActiveData), confirmCloseMatch);
            }
        }

        function confirmCloseMatch() {
            slackRes = "Closing last match. \n";
        }

    });

    promise.then(function(result) {
       result();
        console.log("should finish before setMatch sets a new match");
    }, function(err) {
        console.log(err);
    }).then(function() {
        dbActions.setMatch(newMatchID, JSON.stringify(match), printNewMatch);
    });

/*

    dbActions.getMatch(newMatchID, isMatchActive);

    function isMatchActive(data){
        var isMatchActiveData = JSON.parse(data);
        console.log("isMatchActiveData.active " + isMatchActiveData.active);
        if (isMatchActiveData.active == 1) {
            ////theMatchData.active = 0;
            dbActions.disableMatch(newMatchID, JSON.stringify(isMatchActiveData), confirmCloseMatch);
            function confirmCloseMatch() {
                slackRes = "Closing last match. \n";
                startMatch();
            }
        } else {
            startMatch();
        }
    }

    function startMatch() {
console.log("Starting Match Data");
        dbActions.setMatch(newMatchID, JSON.stringify(match), printNewMatch);

    }

*/

    function printNewMatch() {
        dbActions.getMatch(newMatchID, confirmNewMatch);
    }

    function confirmNewMatch(data) {
        var theMatchData = JSON.parse(data);
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