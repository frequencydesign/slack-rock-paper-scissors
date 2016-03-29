var redis = require("redis")
    , matchnameText = ''
    , triggerWord = ''
    , matchnameText = ''
    , slackRes = ''
    , client = ''
    , rtg = ''
    , operationComplete = false
    , ts = Math.floor(Date.now() / 1000);

if (process.env.REDIS_URL) {
    rtg = require("url").parse(process.env.REDIS_URL);
    client = redis.createClient(rtg.pot, rtg.hostname);
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
    }
};