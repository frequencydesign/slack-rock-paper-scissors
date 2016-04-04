
var match = ''
    , dbActions = require('./../persist.js')
    , slackRes = '';

/*
* import redis
* GET match object
* I need to figure out which match I am throwing against
* I need to add my throw into the DB
* I need to compare the throws
* I need to print a winner
* */

exports.post = function(req, res, next) {

dbActions.getMatch();
    function messAroundWithCurrentMatch(data) {

    }

    res.json({
        "username": "outgoing-rps-finish",
        "text": "Somebody won! Or maybe it was a tie? You decide because I'm not smart enough yet!"
    });

    // next();
};