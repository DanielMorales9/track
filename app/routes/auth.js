var debug = require('debug')('track:routes:auth');
var _ = require("lodash");
var jwt = require("express-jwt");
var router = require("express").Router();
var User = require('./model/User');
var utils = require("./helper/token-utility.js");
var UnauthorizedError = require('./errors/UnauthorizedError');

router.unless = require("express-unless");

/**
 * Function that checks if signup parameters are well-formed
 * @param body request's body
 * @param next next middleware to call
 * @returns user info
 * @private
 */
function _checkSignup(body, next) {
    var user = {
        email: body.email,
        password: body.password,
        firstName: body.firstName,
        lastName: body.lastName
    };
    if (_.isEmpty(user.email) || _.isEmpty(user.password) ||
        _.isEmpty(user.lastName) || _.isEmpty(user.firstName)) {
        return next(new UnauthorizedError("401", {
            message: 'Invalid username or password'
        }));
    }
    return user;

}

/**
 * Function that checks if signin parameters are well-formed
 * @param body request's body
 * @param next next middleware to call
 * @returns user info
 */
function _checkSignin(body, next) {
    var email = body.email;
    var password = body.password;
    var user = {
        email: email,
        password: password
    };

    if (_.isEmpty(email) || _.isEmpty(password)) {
        return next(new UnauthorizedError("401", {
            message: 'Invalid username or password'
        }));
    }

    return user;
}


/**
 *  Verification API
 */
router.route("/verify").get(function (req, res, next) {
    utils.verify(req, function(err, doc) {
        if (err) return next(err);
        if (doc) return res.json(doc);
        return next(new Error('Internal Error Server'));
    });
});

/**
 * Logout API
 */
router.route("/logout").get(function (req, res, next) {
    utils.expire(req.headers, function (err, reply) {
        if (err) return next(err);
        if (reply) {
            res.json({
                "message": "User has been successfully logged out"
            });
        }
        else {
            next(new Error('Could not expire'));
        }
    });
});


/**
 * LOGIN API
 */
router.route("/login").post(function authentication(req, res, next) {
        debug("Processing authenticate middleware");

        var u = _checkSignin(req.body, next);

        if(u) {
            User.findOne({email: u.email}, function (err, user) {
                if (err) return next(err);
                if (!user)
                    return res.json({success: false, message: "Incorrect email or password"});

                user.comparePassword(u.password, function (err, isMatch) {
                    if(err) return next(err);
                    if (isMatch) {
                        debug("User authenticated, generating token...");
                        utils.create(user, function (err, data) {
                            if(err) return next(err);
                            if (!data) return next(new Error('Internal Error Server'));
                            return res.json({
                                success: true,
                                user: data,
                                token: data.token
                            });
                        });
                    } else {
                        return res.json({success: false, message: "Incorrect email or password"});
                    }
                });
            });
        }
    }
);

/**
 * REGISTRATION API
 * Tested with POSTMAN
 */
router.post('/register', function(req, res, next) {
    //user info check
    var u = _checkSignup(req.body, next);

    if(u) {
        //checking if user exists, if not creates token and saves data
        User.findOne({email: u.email}, function (err, user) {
            if (err) return next(err);
            if (user) {
                return res.json({
                    success: false,
                    message: "User already exists!"
                });
            }
            //here is were token is created
            utils.create(u, function (err, data) {
                if(err) return next(err);
                if (!data) return next(new Error('Internal Error Server'));
                //trying to save data
                u = new User(data);
                u.save(function (err) {
                    if (err) return next(err);
                    return res.json({
                        success: true,
                        user: u,
                        token: u.token
                    });
                });
            });
        });
    }
});

module.exports = router;

debug("Loaded");