var express = require("express")
    , router = module.exports = express.Router()
    , start = require("./start.js")
    , throwing = require("./throw.js");

router.route("/start").post(start.post);
router.route("/throw").post(throwing.post);
