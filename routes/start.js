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

/*    var promise = new Q(function(resolve, reject) {

    });

    promise.then(function(result) {
       result();
        console.log("should finish before setMatch sets a new match");
    }, function(err) {
        console.log(err);
    }).then(function() {
        dbActions.getMatch(newMatchID, isMatchActive);
    }).then(function() {
        dbActions.setMatch(newMatchID, JSON.stringify(match), printNewMatch);
    });*/

/*
    function one() {

        var deferred = Q.defer(); // Don't worry yet what this is
                                  // until after you understand the flow

        console.log("Starting one's ajax");
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
        return deferred.promise;
    }

    function two() {
        var deferred = Q.defer();
        console.log("Starting two's ajax");
        dbActions.setMatch(newMatchID, JSON.stringify(match), printNewMatch);
        return deferred.promise;
    }


    one()
        .then(two);
*/


    dbActions.getMatch(newMatchID, isMatchActive);
    function isMatchActive(data){
        var isMatchActiveData = JSON.parse(data);
        console.log("isMatchActiveData.active " + isMatchActiveData.active);
        console.log("step 1");
        if (isMatchActiveData.active == 1) {
            console.log("step 2");
            dbActions.disableMatch(newMatchID, JSON.stringify(isMatchActiveData), confirmCloseMatch);
        } else {
            slackRes = "";
            setupNewMatch();
        }
    }
    function confirmCloseMatch() {
        console.log("step 5");
        slackRes = "Closing last match. \n";
        console.log("step 6");
        setupNewMatch();
    }

    var setupNewMatch = function() {
        console.log("step 7");
        dbActions.setMatch(newMatchID, JSON.stringify(match), printNewMatch);
        console.log("step 8");
    };

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