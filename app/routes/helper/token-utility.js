var debug = require('debug')('track:utils');
var _ = require("lodash");
var jsonwebtoken = require("jsonwebtoken");
var redis = require("redis");
var client = redis.createClient();
var config = require("./../../config.json");
var UnauthorizedError = require("./../errors/UnauthorizedError");

client.on('error', function (err) {
    debug(err);
});

client.on('connect', function () {
    debug("Redis successfully connected");
});

const TOKEN_EXPIRATION = 60;
const TOKEN_EXPIRATION_SEC = TOKEN_EXPIRATION * 60;


/**
 * Fetches token filed in header
 * @param headers
 * @returns request token
 * @private
 */
function fetch(headers) {
    if (headers) {
        var authorization = headers['x-session-token'];
        debug(authorization);
        if(authorization) {
            var part = authorization.split(' ');
            if (part.length === 2) {
                var token = part[1];
                return part[1];
            }
            else {
                return null;
            }
        }
    }
    else {
        return null;
    }
}

/**
 * Setting up Token in redis server
 * @param user
 * @param done callback done
 * @private
 */
function _tokenSetup(user, done) {
    //setting token in redis
    client.set(user.token, JSON.stringify(user), function (err, reply) {
        if (err) return done(err);
        if (reply) {
            client.expire(user.token, TOKEN_EXPIRATION_SEC, function (err, reply) {
                if (err) return done(new Error("Can not set the expire value for the token key"));
                if (!reply)
                    return done(new Error('Expiration not set on redis'));
                return done(null, user);
            });
        }
        else {
            return done(new Error('Token not set in redis'));
        }
    });
}

/**
 * Creates Token from the request
 * @param user
 * @param done callback
 * @returns user info
 */
function create(user, done) {
    debug("Creating token...");

    user.token = jsonwebtoken.sign({ email: user.email }, config.secret, {
        expiresIn: TOKEN_EXPIRATION_SEC
    });

    var decoded = jsonwebtoken.decode(user.token);

    user.token_exp = decoded.exp;
    user.token_iat = decoded.iat;

    _tokenSetup(user, done);
}

/**
 * Retrieves Token
 * @param id
 * @param done
 * @returns jwt
 */
function retrieve(id, done) {
    debug("Calling retrieve for token: %s", id);
    if (_.isNull(id)) {
        return done(new Error("token_invalid"), {
            "message": "Invalid token"
        });
    }
    client.get(id, function (err, reply) {
        if (err)
            return done(err);
        if (_.isNull(reply)) {
            return done(new Error("token_invalid"), {
                "message": "Token doesn't exists, are you sure it hasn't expired or been revoked?"
            });
        } else {
            var data = JSON.parse(reply);
            debug("User data fetched from redis store for user: %s", data.email);

            if (_.isEqual(data.token, id)) {
                return done(null, data);
            } else {
                return done(new Error("token_not_exist"), {
                    "message": "Token doesn't exists, login into the system so it can generate new token."
                });
            }
        }
    });
}

/**
 * Verify if token is valid
 * @param req
 * @param done callback when done
 */
function verify(req, done) {
    debug("Verifying token...");
    var token = exports.fetch(req.headers);
    debug('token: ' + token);
    if(token) {
        jsonwebtoken.verify(token, config.secret, function (err) {
            if (err) return done(err);
            exports.retrieve(token, function (err, data) {
                if (err) return done(err);
                if (data) return done(null, data);
                done(new Error("Couldn't retrieve data"));
            });
        });
    } else {
        return done(new UnauthorizedError("401", {message: "No authorization"}));
    }
}

/**
 * Expirng token
 * @param request header
 * @param done callback when done
 * @private
 */
function expire(headers, done) {
    var token = exports.fetch(headers);

    debug("Expiring token: %s", token);
    if (token) {
        return done(null, client.expire(token, 0))
    }
    done(new UnauthorizedError("401", {message: "No authorization"}));
}


module.exports.TOKEN_EXPIRATION = TOKEN_EXPIRATION;
module.exports.TOKEN_EXPIRATION_SEC = TOKEN_EXPIRATION_SEC;

module.exports.fetch = fetch;

module.exports.create = create;

module.exports.retrieve = retrieve;

module.exports.verify = verify;

module.exports.expire = expire;

debug("Loaded");