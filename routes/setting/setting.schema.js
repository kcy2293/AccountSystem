var mg = require('mongoose');
var Schema = mg.Schema;

var settingSchema = new Schema({
	group: String,
	name: String,
	isCollabor: Boolean,
	commission: Number,
	commCalcRule: String,
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
	optDiscount: String,
	item: String,
	disPrice: Number
});

module.exports = mg.model('setting', settingSchema);
