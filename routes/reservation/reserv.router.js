var express = require('express');
var router = express.Router();
var reservation = require('./reserv.schema');

router.route('/').get(function(req, res) {
	res.redirect((new Date()).getFullYear());
});

router.route('/:yesr').get(function(req, res) {
});

module.exports = router;
