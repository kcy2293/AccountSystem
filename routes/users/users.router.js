var express = require('express');
var router = express.Router();

router.route('/').get(function(req, res) {
	res.json([
		{
			name: "송희진",
			role: "가족실장",
			isManager: true
		},
		{
			name: "송남희",
			role: "가족실장",
			isManager: false
		},
		{
			name: "송정희",
			role: "가족실장",
			isManager: false
		},
		{
			name: "송대영",
			role: "가족실장",
			isManager: false
		},
		{
			name: "송희진",
			role: "가족실장",
			isManager: true
		},
		{
			name: "선하쌤",
			role: "실장",
			isManager: false
		},
		{
			name: "원이알바",
			role: "알바",
			isManager: false
		}
	]);
});

module.exports = router;
