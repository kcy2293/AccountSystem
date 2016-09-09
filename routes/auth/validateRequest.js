var jwt = require('jwt-simple'),
		validateUser = require('./auth.controller').validateUser;

module.exports = function(req, res, next) {
	var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
	var key = (req.body && req.body.x_key) || (req.query && req.query.x_key) || req.headers['x-key'];

	if (token || key) {
		try {
			var decoded = jwt.decode(token, require(__base + 'config').auth.secret);

			if (decoded.exp <= Date.now()) {
				res.status(400);
				res.json({
					"status": 400,
					"message": "Token Expired"
				});
				return;
			}

			validateUser(key, function(user) {
				if (user) {
					//if ((req.url.indexOf('admin') >= 0 && dbUser.role == 'admin') || (req.url.indexOf('admin') < 0 && req.url.indexOf('/api/v1/') >= 0)) {
					if (req.url.indexOf('/api') >= 0) {
						next();
					}
					/*
					else {
						res.status(403);
						res.json({
							"status": 403,
							"message": "NotAuthorized"
						});
					}
					*/
				} else {
					res.status(401);
					res.json({
						"status": 401,
						"message": "Invalid User"
					});
					return;
				}
			});
		} catch(err) {
			res.status(500);
			res.json({
				"status": 500,
				"message": "Oops something went wrong",
				"error": err
			});
		}
	} else {
		res.status(401);
		res.json({
			"status": 401,
			"message": "Invalid Token or Key"
		});
		return;
	}
};
