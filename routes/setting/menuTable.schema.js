var mg = require('mongoose');
var Schema = mg.Schema;

var menuTableSchema = new Schema({
	group: String,
	name: String,
	sell: Number,
});

module.exports = mg.model('menuTable', menuTableSchema);
