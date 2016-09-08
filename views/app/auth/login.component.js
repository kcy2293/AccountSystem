(function() {
	'use strict';
	angular
		.module('login', [
		])
		.component('login', {
			templateUrl: 'app/auth/login.template.html',
			controller: loginController
		});

	function loginController($scope, $http) {
		var self = this;

		self.user = {};
		self.doLogin = doLogin;

		function doLogin() {
			console.log("doLogin");
		}
	}

})();
