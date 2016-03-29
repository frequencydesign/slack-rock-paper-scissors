exports.post = function(req, res, next) {

    res.json({
        "username": "outgoing-rps-finish",
        "text": "Somebody won! Or maybe it was a tie? You decide because I'm not smart enough yet!"
    });

    next();
};