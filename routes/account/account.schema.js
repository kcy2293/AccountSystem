var mg = require('mongoose');
var Schema = mg.Schema;

var accountSchema = new Schema({
	accountDate: Date, //기간 검색용
	dateStr: String, //특정일자 검색용
	period: String,
	revenueTotal: Number,
	expenseTotal: Number,
	incomeTotal: Number,
	revenueList: [Schema.Types.Mixed],
	expenseList: [Schema.Types.Mixed],
	incomeList: [Schema.Types.Mixed],
	addedExpenseList: [Schema.Types.Mixed]
});

module.exports = mg.model('account', accountSchema);
