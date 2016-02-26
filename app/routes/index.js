var debug = require('debug')('track:routes:index');

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var options = {
    root: __dirname + '/../public/'

  };
  res.sendFile('index.html', options, function (err) {
      debug(err);
    if (err) {
      res.status(err.status).end();
    }
    else {
        debug('sent index.html');
    }
  });
});

module.exports = router;

debug('Loaded');
