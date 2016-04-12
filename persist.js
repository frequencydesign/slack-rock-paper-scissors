var redis = require("redis")
    , client = ''
    , rtg = '';

if (process.env.REDIS_URL) {
    rtg = require("url").parse(process.env.REDIS_URL);
    client = redis.createClient(rtg.port, rtg.hostname);
    client.auth(rtg.auth.split(':')[1]);
} else {
    client = redis.createClient();
}

var dbActions = {

    setMatch: function(matchKey, matchData, callbackFunction) {
        client.set(matchKey, matchData, function(err, reply) {
            if (reply) {
                callbackFunction(reply);
            }
        });
    },
    getMatch: function(matchId, callbackFunction) {
        client.get(matchId, function(err, reply) {
            if (reply) {
                callbackFunction(reply);
            } else {
                callbackFunction(null);
            }
        });
    },
    disableMatch: function(matchKey, matchData, callbackFunction) {
        matchData.active = 0;
        client.set(matchKey, matchData, function(err, reply) {
            console.log("disableMatch data " + matchData);
            if (reply) {
                console.log("disableMatch reply data " + reply);
                callbackFunction(reply);
            }
        });
    }
};

module.exports = dbActions;
