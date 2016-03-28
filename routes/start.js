exports.post = function(req, res, next) {
    //console.log('Start route.');
    //res.send("Res.Send Start.");
    /*
    UPON POSTING
    Send a request for an opponent
    Consider a timer for accepting of a match
    when a match is accepted, create a match in the DB so that there is something to hold the answers and compare winners


     */

    var requestBody = req.body;

    res.json({
        "username": "outgoing-rps",
        //"icon_emoji": ":ghost:",
        "text": "You started a game! You typed " + requestBody
    });

    next();
};