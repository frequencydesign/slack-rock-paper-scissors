var express = require("express")
    , bodyParser = require("body-parser")
    , server = module.exports = express()
    , router = require("./routes/index.js");

server.use(bodyParser.jsson());
server.use(bodyParser.urlencoded({extended: false}));
server.use(router);
server.use(function(request, response) {
    response.status(200).send("All running.")
});

server.listen(port , function () {
    console.log("Up and running on port " + port + " for " + hostname);
});
