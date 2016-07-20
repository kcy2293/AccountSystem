var mg = require('mongoose');
var Schema = mg.Schema;

var settingSchema = new Schema({
	group: String,
	name: String,
	isCollabor: Boolean,
	commission: Number
});

module.exports = mg.model('setting', settingSchema);
