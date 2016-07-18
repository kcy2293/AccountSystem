var express = require('express');
var router = express.Router();
var settingItem = require('./models/settingItem');

router.route('/items')
  .post(function (req, res) {
    console.log(req.body);
      res.json({
        message: 'item created!'
      });
    /*
    var item = new settingItem();
    item.collaborPlace = {
      name : req.body.name,
      commission : req.body.commission
    }

    item.save(function(err) {
      if (err) res.send(err);
      res.json({
        message: 'item created!'
      });
    });
    */
  });

module.exports = router;
