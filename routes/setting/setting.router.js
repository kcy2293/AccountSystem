var express = require('express');
var router = express.Router();
var decoLoc = require('./setting.decoLoc');

router.route('/decoLoc')
	.post(decoLoc.create)
	.get(decoLoc.getAll);

router.route('/decoLoc/:decoLoc_id')
	.get(decoLoc.getOne)
	.put(decoLoc.update)
	.delete(decoLoc.delete);


module.exports = router;

