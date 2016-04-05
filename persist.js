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
    disableMatch: function(matchId, matchData, callbackFunction) {
        console.log(matchData);
        client.get(matchId, function(err, reply) {
            if (reply) {
                console.log(reply);
                callbackFunction(reply);
            } else {
                callbackFunction(null);
            }
        });
    }
};

module.exports = dbActions;
