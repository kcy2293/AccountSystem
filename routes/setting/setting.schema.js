var mg = require('mongoose');
var Schema = mg.Schema;

var settingSchema = new Schema({
	group: String,
	name: String,
	isCollabor: Boolean,
	commission: Number,
	imgName: String,
	buy: Number,
	sell: Number,
	repair: Number,
	decoType: String,
	decoFruit: String,
	decoRcake: String,
	optDress: String,
	other: String,
	rank: String,
	role: String,
	pay: Number,
	item: String,
	disPrice: Number
});

module.exports = mg.model('setting', settingSchema);
