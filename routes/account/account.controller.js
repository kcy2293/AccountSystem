var account = require('./account.schema');

module.exports = {
	create: create,
	getOne: getOne,
	update: update,
	deleteOne: deleteOne,
	getYearList: getYearList,
	getMonthList: getMonthList
};

function create(req, res) {
	var item = new account();
	item.accountDate = req.body.accountDate;
	item.dateStr = req.body.dateStr;
	item.period = req.body.period;
	item.revenueTotal = req.body.revenueTotal;
	item.expenseTotal = req.body.expenseTotal;
	item.incomeTotal = req.body.incomeTotal;
	item.revenueList = req.body.revenueList;
	item.expenseList = req.body.expenseList;
	item.incomeList = req.body.incomeList;
	item.addedExpenseList = req.body.addedExpenseList;

	item.save(function(err) {
		if (err) res.send(err);
		else {
			res.json({
				type: 0,
				message: "생성완료"
			});
		}
	});
}
function getOne(req, res) {
	account.find({dateStr: req.params.accountDate}, function (err, item) {
		if (err) res.send(err);
		res.json(item);
	});
}
function update(req, res) {
	account.find({dateStr: req.params.accountDate}, function (err, item) {
		if (err) res.send(err);
		item.accountDate = req.body.accountDate;
		item.dateStr = req.body.dateStr;
		item.period = req.body.period;
		item.revenueTotal = req.body.revenueTotal;
		item.expenseTotal = req.body.expenseTotal;
		item.incomeTotal = req.body.incomeTotal;
		item.revenueList = req.body.revenueList;
		item.expenseList = req.body.expenseList;
		item.incomeList = req.body.incomeList;
		item.addedExpenseList = req.body.addedExpenseList;

		item.save(function(err) {
			if (err) res.send(err);
			res.json({
				type: 0,
				message: "수정완료"
			});
		});
	});
}
function deleteOne(req, res) {
	account.remove({
		dateStr: req.params.accountDate
	}, function(err, item) {
		if (err) res.send(err);
		res.json({
			message: "삭제완료"
		});
	});
}

function getYearList(req, res) {
	/*
	reservation.find({decoYear: Number(req.params.year)}, function(err, items) {
		if (err) res.send(err);
		res.json(items);
	});
	*/
}
function getMonthList(req, res) {
	/*
	reservation.find({decoYear: Number(req.params.year)}, function(err, items) {
		if (err) res.send(err);
		res.json(items);
	});
	*/
}
