var express = require('express');
var router = express.Router();
var reserv = require('./reserv.controller');

router.route('/')
			.post(reserv.create)
			.get(reserv.getRange);

router.route('/:year')
			.get(reserv.getAll);

router.route('/:year/:id')
			.get(reserv.getOne)
			.put(reserv.update)
			.delete(reserv.delete);

router.route('/:year/:id/consulting')
			.put(reserv.updateConsult);

module.exports = router;
