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

    setMatch: function(matchKey, setMatchData, callbackFunction) {
        var setMatchDataJSON = JSON.parse(setMatchData);
        setMatchDataJSON.active = 1;
        client.set(matchKey, JSON.stringify(setMatchDataJSON), function(err, reply) {
            console.log("setMatchDataJSON data " +  JSON.stringify(setMatchDataJSON));
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
    disableMatch: function(matchKey, disableMatchData, callbackFunction) {
        var disableMatchDataJSON = JSON.parse(disableMatchData);
        disableMatchDataJSON.active = 0;
        client.set(matchKey, JSON.stringify(disableMatchDataJSON), function(err, reply) {
            console.log("disableMatchDataJSON data " +  JSON.stringify(disableMatchDataJSON));
            if (reply) {
                console.log("disableMatchDataJSON reply data " + reply);
                callbackFunction(reply);
            }
        });
    }
};

module.exports = dbActions;
