var account = require('./account.schema');

module.exports = {
	create: create,
	getAll: getAll,
	getOne: getOne,
	update: update,
	delete: deleteOne
};

function create(req, res) {
	var item = new account();
	item.balance = req.body.balance;

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
function getAll(req, res) {
	/*
	reservation.find({decoYear: Number(req.params.year)}, function(err, items) {
		if (err) res.send(err);
		res.json(items);
	});
	*/
}
function getOne(req, res) {
	/*
	reservation.findById(req.params.id, function (err, item) {
		if (err) res.send(err);
		res.json(item);
	});
	*/
}
function update(req, res) {
	/*
	reservation.findById(req.params.id, function (err, item) {
		if (err) res.send(err);
		item.sellList = req.body.sellList;

		item.save(function(err) {
			if (err) res.send(err);
			res.json({
				type: 0,
				message: "수정완료"
			});
		});
	});
	*/
}
function deleteOne(req, res) {
	/*
	reservation.remove({
		_id: req.params.id
	}, function(err, item) {
		if (err) res.send(err);
		res.json({
			message: "삭제완료"
		});
	});
	*/
}
