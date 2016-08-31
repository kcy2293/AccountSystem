var setting = require('./setting.schema');
var groupName = "optDiscount";

module.exports = {
	url: groupName,
	create: create,
	getAll: getAll,
	getOne: getOne,
	update: update,
	delete: deleteOne
};

function create(req, res) {
	var item = new setting();
	item.group = groupName;
	item.name = req.body.name;
	item.item = req.body.item;
	item.disPrice = req.body.disPrice;
	item.repair = req.body.repair;

	item.save(function(err) {
		if (err) res.send(err);
		res.json({
			message: "created!"
		});
	});
}
function getAll(req, res) {
	setting.find({group: groupName}, function(err, items) {
		if (err) res.send(err);
		res.json(items);
	});
}
function getOne(req, res) {
	setting.findById(req.params.id, function (err, item) {
		if (err) res.send(err);
		res.json(item);
	});
}
function update(req, res) {
	setting.findById(req.params.id, function (err, item) {
		if (err) res.send(err);

		item.name = req.body.name;
		item.item = req.body.item;
		item.disPrice = req.body.disPrice;
		item.repair = req.body.repair;

		item.save(function(err) {
			if (err) res.send(err);
			res.json({
				message: "update!"
			});
		});
	});
}
function deleteOne(req, res) {
	setting.remove({
		_id: req.params.id
	}, function(err, item) {
		if (err) res.send(err);
		res.json({
			message: "deleted!"
		});
	});
}
