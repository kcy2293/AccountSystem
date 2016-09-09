var express = require('express');
var router = express.Router();
var users = require('./users.controller');

router.route('/')
			.post(users.create)
			.get(users.getAll);


module.exports = router;
