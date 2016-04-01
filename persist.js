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
    console.log(process.env.REDIS_URL);
    rtg = require("url").parse(process.env.REDIS_URL);
    console.log(rtg);
    client = redis.createClient(rtg.post, rtg.hostname);
    console.log(rtg.auth);
    console.log(rtg.auth.split(':')[1]);
    //client.auth(rtg.auth.split(':')[1]);
} else {
    console.log("createClient");
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
