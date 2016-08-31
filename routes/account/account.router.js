var express = require('express');
var router = express.Router();
var account = require('./account.controller');

router.route('/:year/:month/:accountDate')
			.get(account.getOne)
			.post(account.create)
			.put(account.update)
			.delete(account.deleteOne);

router.route('/:year')
			.get(account.getYearList);

router.route('/:year/:month')
			.get(account.getMonthList);

module.exports = router;
