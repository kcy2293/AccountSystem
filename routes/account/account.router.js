var express = require('express');
var router = express.Router();
var account = require('./account.controller');


router.route('/')
			.post(account.create)
			.get(function(req, res) {
				res.redirect((new Date()).getFullYear() + '/' + getLastWeekPeriod());
			});
router.route('/:year/:period')
			.get(function(req, res) {
			});
/*
router.route('/')
			.post(reserv.create)
			.get(function(req, res) {
				res.redirect((new Date()).getFullYear());
			});

router.route('/:year')
			.get(reserv.getAll);

router.route('/:year/:id')
			.get(reserv.getOne)
			.put(reserv.update)
			.delete(reserv.delete);
*/

module.exports = router;

function getLastWeekPeriod() {
	var now = new Date();
	now.setHours(0);
	now.setMinutes(0);
	now.setSeconds(0);
	now.setMilliseconds(0);

	var nowDay = now.getDay();
	var startSub = (nowDay == 0) ? 13 : nowDay + 6;
	var endSub = (nowDay == 0) ? 6 : nowDay - 1;
	var startDate = subDays(now, startSub);
	var endDate = subDays(now, endSub);

	var period = '';
	period += padLeft(startDate.getMonth() + 1);
	period += padLeft(startDate.getDate());
	period += padLeft(endDate.getMonth() + 1);
	period += padLeft(endDate.getDate());

	return period;
}

function subDays(theDate, days) {
	return new Date(theDate.getTime() - days*24*60*60*1000);
}

function padLeft(base) {
	if (base < 10) return '0'+String(base);
	else  return String(base);
}

