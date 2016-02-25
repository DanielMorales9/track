var jwt = require("jsonwebtoken");
var express = require('express');
var router = express.Router();
var User = require('./model/User');
var authHelper = require('./helper/AuthenticationHelper');

router.post('/login', function(req, res) {
    User.findOne({
        email: req.body.email,
        password: req.body.password
    }, function(err, user) {
        if (err) {
            res.json({
                success: false,
                message: "Error occured: " + err
            });
        } else {
            if (user) {
                res.json({
                    success: true,
                    data: user,
                    token: user.token
                });
            } else {
                res.json({
                    success: false,
                    message: "Incorrect email/password"
                });
            }
        }
    });
});

router.post('/register', function(req, res) {
    User.findOne({
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName
    }, function(err, user) {
        if (err) {
            res.json({
                success: false,
                message: "Error occured: " + err
            });
        } else {
            if (user) {
                res.json({
                    success: false,
                    message: "User already exists!"
                });
            } else {
                var userModel = new User();
                userModel.email = req.body.email;
                userModel.password = req.body.password;
                userModel.firstName = req.body.firstName;
                userModel.lastName = req.body.lastName;
                userModel.save(function(err, user) {
                    user.token = jwt.sign(user, process.env.JWT_SECRET);
                    user.save(function(err, user1) {
                        res.json({
                            success: true,
                            user: user1,
                            token: user1.token
                        });
                    });
                })
            }
        }
    });
});

router.get('/verify', authHelper, function(req, res) {
    res.send({success: true});
});

module.exports = router;