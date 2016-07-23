var express = require('express');
var router = express.Router();
var setting = require('./setting.schema');
var _ = require('underscore');

var models = [
	require('./setting.decoLoc'),
	require('./setting.decoType'),
	require('./setting.decoName'),
	require('./setting.decoFruit'),
	require('./setting.decoRcake'),
	require('./setting.decoPhoto'),
	require('./setting.optDress'),
	require('./setting.optMC'),
	require('./setting.optSnap'),
	require('./setting.optOther'),
	require('./setting.menuTable'),
	require('./setting.pay')
];

for (i in models) {
	router.route('/' + models[i].url)
		.post(models[i].create)
		.get(models[i].getAll);
	router.route('/'+ models[i].url + '/:id')
		.get(models[i].getOne)
		.put(models[i].update)
		.delete(models[i].delete);
}

router.route('/').get( function(req, res) {
	setting.find({}, function(err, items) {
		if (err) res.send(err);
		var results = _.groupBy(items, 'group');
		res.json(results);
	});
});

module.exports = router;
