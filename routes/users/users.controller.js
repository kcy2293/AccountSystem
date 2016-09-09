var users = require('./users.schema');

module.exports = {
	create: create,
	getAll: getAll
};

function create(req, res) {
	var user = new users();
	user.email = req.body.email;
	user.name = req.body.name;
	user.password = req.body.password;
	user.role = req.body.role;
	user.isManager = req.body.isManager;
	user.isMember = true;

	user.save(function(err) {
		if (err) res.send(err);
		else {
			res.json({
				type: 0,
				message: "생성완료"
			});
		}
	});
}

function getAll(req, res) {
	/*
	users.find({isMember: true}, {isMember: 0}, function(err, items) {
		if (err) res.send(err);
		res.json(items);
	});
	*/
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
}
