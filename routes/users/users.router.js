var express = require('express');
var router = express.Router();

router.route('/').get(function(req, res) {
	res.json([
		{
			name: "송희진",
			rank: "가족실장",
			isManager: true
		},
		{
			name: "송남희",
			rank: "가족실장",
			isManager: false
		},
		{
			name: "송정희",
			rank: "가족실장",
			isManager: false
		},
		{
			name: "송대영",
			rank: "가족실장",
			isManager: false
		},
		{
			name: "송희경",
			rank: "가족실장",
			isManager: true
		},
		{
			name: "이선하",
			rank: "실장",
			isManager: false
		},
		{
			name: "이원이",
			rank: "알바",
			isManager: false
		},
		{
			name: "하경애",
			rank: "초보실장",
			isManager: false
		}
	]);
});

module.exports = router;
