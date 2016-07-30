var express = require('express');
var router = express.Router();
var reserv = require('./reserv.controller');

router.route('/')
			.post(reserv.create)
			.get(function(req, res) {
				res.redirect((new Date()).getFullYear());
			});

router.route('/:year')
			.get(reserv.getAll);

router.route('/:year/:id')
			.get(reserv.getOne);

module.exports = router;
