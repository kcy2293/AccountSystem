var mg = require('mongoose');
var Schema = mg.Schema;

var reservSchema = new Schema({
	createDate: Date,
	updateDate: Date,
	company: String,
	status: String,
	decoLoc: String,
	decoLoc2: String,
	decoDate: Date,
	decoYear: Number,
	decoTime: Date,
	babyName: String,
	babyType: String,
	phoneNum: String,
	menuTable: String,
	decoType: String,
	decoName: String,
	decoImage: String,
	decoFruit: Array,
	decoRcake: Array,
	decoPhoto: String,
	optDress: Array,
	optMC: Array,
	optMovie: String,
	optSnap: String,
	optOther: Array,
	optDiscount: Array,
	optOutgoingFee: Number,
	comment: String,
	manager: Array,
	role: Array,
	deposit: Number,
	balance: Number,
	priceList: [Schema.Types.Mixed],
	consultList: [Schema.Types.Mixed]
});

module.exports = mg.model('reservation', reservSchema);
