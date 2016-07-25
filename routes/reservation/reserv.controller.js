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
	item.status = req.body.status;
	item.decoLoc = req.body.decoLoc;
	if (req.body.date) {
		item.decoDate = new Date(req.body.date);
		item.decoYear = item.decoDate.getFullYear();
	}
	item.babyName = req.body.babyName;
	item.babyType = req.body.babyType;
	item.menuTable = req.body.menuTable;
	item.decoRcake = req.body.decoRcake;
	item.decoPhoto = req.body.decoPhoto;
	item.optDress = req.body.optDress;
	item.optMC = req.body.optMC;
	item.optSnap = req.body.optSnap;
	item.optOther = req.body.optOther;
	item.comment = req.body.commenct;
	item.manager = req.body.manager;
	item.role = req.body.role;
	item.deposit = req.body.deposit;
	item.balance = req.body.balance;

	item.save(function(err) {
		if (err) res.send(err);
		res.json({
			message: "created!"
		});
	});
}
function getAll(req, res) {
	reservation.find({group: groupName}, function(err, items) {
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

		item.status = req.body.status;
		item.decoLoc = req.body.decoLoc;
		if (req.body.date) {
			item.decoDate = new Date(req.body.date);
			item.decoYear = item.decoDate.getFullYear();
		}
		item.babyName = req.body.babyName;
		item.babyType = req.body.babyType;
		item.menuTable = req.body.menuTable;
		item.decoRcake = req.body.decoRcake;
		item.decoPhoto = req.body.decoPhoto;
		item.optDress = req.body.optDress;
		item.optMC = req.body.optMC;
		item.optSnap = req.body.optSnap;
		item.optOther = req.body.optOther;
		item.comment = req.body.commenct;
		item.manager = req.body.manager;
		item.role = req.body.role;
		item.deposit = req.body.deposit;
		item.balance = req.body.balance;

		item.save(function(err) {
			if (err) res.send(err);
			res.json({
				message: "update!"
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
			message: "deleted!"
		});
	});
}
