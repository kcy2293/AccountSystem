var reservation = require('./reserv.schema');

module.exports = {
	create: create,
	getAll: getAll,
	getOne: getOne,
	update: update,
	delete: deleteOne
};

function create(req, res) {
	var item = new reservation();
	var now = new Date();
	item.createDate = now;
	item.updateDate = now;
	item.status = req.body.status;
	item.decoLoc = req.body.decoLoc;
	item.decoLoc2 = req.body.decoLoc2;
	item.decoDate = new Date(req.body.decoDate);
	item.decoYear = item.decoDate.getFullYear();
	item.decoTime = new Date(req.body.decoTime);
	item.babyName = req.body.babyName;
	item.babyType = req.body.babyType;
	item.phoneNum = req.body.phoneNum;
	item.menuTable = req.body.menuTable;
	item.decoName = req.body.decoName;
	item.decoFruit = req.body.decoFruit;
	item.decoRcake = req.body.decoRcake;
	item.decoPhoto = req.body.decoPhoto;
	item.optDress = req.body.optDress;
	item.optMC = req.body.optMC;
	item.optMovie = req.body.optMovie;
	item.optSnap = req.body.optSnap;
	item.optOther = req.body.optOther;
	item.comment = req.body.commenct;
	item.manager = req.body.manager;
	item.role = req.body.role;
	item.deposit = req.body.deposit;
	item.balance = req.body.balance;
	item.sellList = req.body.sellList;

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
	reservation.find({decoYear: Number(req.params.year)}, function(err, items) {
		if (err) res.send(err);
		res.json(items);
	});
}
function getOne(req, res) {
	reservation.findById(req.params.id, function (err, item) {
		if (err) res.send(err);
		res.json(item);
	});
}
function update(req, res) {
	reservation.findById(req.params.id, function (err, item) {
		if (err) res.send(err);
		item.updateDate = new Date();
		item.status = req.body.status;
		item.decoLoc = req.body.decoLoc;
		item.decoLoc2 = req.body.decoLoc2;
		item.decoDate = new Date(req.body.decoDate);
		item.decoYear = item.decoDate.getFullYear();
		item.decoTime = new Date(req.body.decoTime);
		item.babyName = req.body.babyName;
		item.babyType = req.body.babyType;
		item.phoneNum = req.body.phoneNum;
		item.menuTable = req.body.menuTable;
		item.decoName = req.body.decoName;
		item.decoFruit = req.body.decoFruit;
		item.decoRcake = req.body.decoRcake;
		item.decoPhoto = req.body.decoPhoto;
		item.optDress = req.body.optDress;
		item.optMC = req.body.optMC;
		item.optMovie = req.body.optMovie;
		item.optSnap = req.body.optSnap;
		item.optOther = req.body.optOther;
		item.comment = req.body.commenct;
		item.manager = req.body.manager;
		item.role = req.body.role;
		item.deposit = req.body.deposit;
		item.balance = req.body.balance;
		item.sellList = req.body.sellList;

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
	reservation.remove({
		_id: req.params.id
	}, function(err, item) {
		if (err) res.send(err);
		res.json({
			message: "삭제완료"
		});
	});
}
