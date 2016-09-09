var express = require('express');
var router = express.Router();
var auth = require('./auth.controller');

router.route('/login')
			.post(auth.login);

module.exports = router;
