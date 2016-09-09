
var config = {
	db : {
    uri: 'mongodb://localhost:9000/account',
    options: {
      server: {poolSize: 5},
		}
	},
	auth: {
		secret : "1234"
	}
};

module.exports = config;
