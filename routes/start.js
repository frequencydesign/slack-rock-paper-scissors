//var bodyParser = require("body-parser")

exports.post = function(req, res, next) {
    //console.log('Start route.');
    //res.send("Res.Send Start.");
    /*
    UPON POSTING
    Send a request for an opponent
    Consider a timer for accepting of a match
    when a match is accepted, create a match in the DB so that there is something to hold the answers and compare winners


     */

    //var requestBody = req.body.urlencoded;
    var requestBodyText = req.body["text"];
    var requestBodyUserName = req.body["user_name"];

    var pattern = /\B@[a-z0-9_-]+/gi;
    var mentions = requestBodyText.match(pattern);
    var invitedPlayer = mentions[0];

    if (invitedPlayer.length > 0) {
        res.json({
            "username": "outgoing-rps",
            //"icon_emoji": ":ghost:",
            "text": "Ready to battle " + invitedPlayer + "? /throw a :punch: :memo: or :scissors: to battle. " +requestBodyUserName+ " said " + requestBodyText
        });
    } else {
        res.json({
            "username": "outgoing-rps",
            "text": "You idiot! You didn't choose anyone to battle with!"
        });
    }


    next();
};