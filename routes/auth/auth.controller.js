var jwt = require('jwt-simple'),
		users = require('../users/users.schema');

module.exports = {
	login: login,
	validate: validate,
	validateUser: validateUser
};

function login(req, res) {
	var email = req.body.email || '';
	var password = req.body.password || '';
	
	if (email == '' || password == '') {
		res.status(401);
		res.json({
			"status": 401,
			"message": "이메일과 비밀번호를 입력해주세요"
		});
	}

	validate(email, password, function(user) {
		if(!user) {
			res.status(401);
			res.json({
				"status": 401,
				"message": "이메일 또는 비밀번호가 틀렸습니다"
			});
		} else {
			res.json(genToken(user));
		}
	});
}

function validate(email, password, callback) {
	users.findOne({email: email, password: password, isMember: true}, 
								{password: 0, isMember: 0}, function(err, user) {
			callback(user);
	});
}

function validateUser(email, callback) {
}

function genToken(user) {
	var expires = expiresIn(7);
	var token = jwt.encode({
		exp: expires
	}, require(__base + 'config').auth.secret);

	return {
		token: token,
		expires: expires,
		user: user
	}
}

function expiresIn(numDays) {
	var dateObj = new Date();
	return dateObj.setDate(dateObj.getDate() + numDays);
}

