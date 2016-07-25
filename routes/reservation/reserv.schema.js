var mg = require('mongoose');
var Schema = mg.Schema;

var reservSchema = new Schema({
	status: String,
	decoLoc: String,
	decoDate: Date,
	decoYear: Number,
	babyName: String,
	babyType: String,
	phoneNum: String,
	menuTable: String,
	decoType: String,
	decoName: String,
	decoFruit: Array,
	decoRcake: Array,
	decoPhoto: String,
	optDress: Array,
	optMC: String,
	optSnap: String,
	optOther: Array,
	comment: String,
	manager: Array,
	role: Array,
	deposit: Number,
	balance: Number
});

module.exports = mg.model('reservation', reservSchema);
