var debug = require('debug')('track');
var express = require('express');
var path = require('path');
var fs = require('fs');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var jwt = require("express-jwt");
var onFinished = require('on-finished');
var mongoose = require('mongoose');
var unless = require('express-unless');


var routes = require('./routes/index');
var users = require('./routes/users');
var auth = require('./routes/auth');
var config = require("./config.json");



var app = express();

/**
 * Environment Variable should be written here
 */
process.env.MONGO_URL = 'mongodb://127.0.0.1/track-me';
var HTTP_PORT = process.env.HTTP_PORT || 3000;
var HTTPS_PORT = process.env.HTTPS_PORT || 3443;

/**
 * HTTP & HTTPS Configuration
 */
/*debug("Creating HTTP server on port: %s", HTTP_PORT);
 require('http').createServer(app).listen(HTTP_PORT, function () {
 debug("HTTP Server listening on port: %s, in %s mode", HTTP_PORT, app.get('env'));
 });*/

debug("Creating HTTPS server on port: %s", HTTPS_PORT);
require('https').createServer({
    key: fs.readFileSync(path.join(__dirname, "../ssl/server.key")),
    cert: fs.readFileSync(path.join(__dirname, "../ssl/server.crt")),
    ca: fs.readFileSync(path.join(__dirname, "../ssl/ca.crt")),
    requestCert: true,
    rejectUnauthorized: false
}, app).listen(HTTPS_PORT, function () {
    debug("HTTPS Server listening on port: %s, in %s mode", HTTPS_PORT, app.get('env'));
});

/**
 * Debugging Mongoose connection
 */
mongoose.connect(process.env.MONGO_URL);
mongoose.set('debug', true);
mongoose.connection.on('error', function () {
    debug('Mongoose connection error');
});
mongoose.connection.once('open', function callback() {
    debug("Mongoose connected to the database");
});

/**
 * Debugging requests
 */
app.use(function (req, res, next) {

    onFinished(res, function () {
        debug("[%s] finished request", req.connection.remoteAddress);
    });
    next();
});

/**
 * Setting up view engine
 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

/**
 * Setting up HTTP functionality
 */
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, x-access-token');
    next();
});

/**
 * Express Static routes
 */
app.use('/js', express.static(path.join(__dirname, 'public/javascripts')));
app.use('/contents', express.static(path.join(__dirname, 'public/contents')));
app.use('/css', express.static(path.join(__dirname, 'public/stylesheets')));
app.use('/lib', express.static(path.join(__dirname, 'node_modules')));

/**
 * Setting up route managers
 */
app.use('/', routes);
app.use('/users', users);
app.use('/auth', auth);

/**
 * JWT Configuration
 */
var jwtCheck = jwt({
    secret: config.secret
});
jwtCheck.unless = unless;
// unprotected path configuration
app.use(jwtCheck.unless({path: ['/auth/verify', '/auth/login', '/auth/register', '/'] }));

/**
 * Error handler
 */
app.use(function(err, req, res, next) {
    debug(err);
    debug(req);
    res.status(err.status || 500).send(err.message);
});

module.exports = app;
