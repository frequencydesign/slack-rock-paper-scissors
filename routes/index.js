var express = require("express")
    , router = module.exports = express.Router()
    , start = require("./start.js");

router.route("/start").post(start.post);
