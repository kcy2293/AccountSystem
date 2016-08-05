var mg = require('mongoose');
var Schema = mg.Schema;

var accountSchema = new Schema({
	createDate: Date,
});

module.exports = mg.model('account', accountSchema);
