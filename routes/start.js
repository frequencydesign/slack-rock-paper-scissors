exports.post = function(req, res, next) {
    //console.log('Start route.');
    //res.send("Res.Send Start.");
    res.json({
        "username": "ghost-bot",
        "icon_emoji": ":ghost:",
        "text": "BOO!"
    });
};