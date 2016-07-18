var mg = require('mongoose');
var Schema = mg.Schema;

var settingItemSchema = new Schema({
  settings: Schema.Types.Mixed
});

module.exports = mg.model('settingItem', settingItemSchema);
