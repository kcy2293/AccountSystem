(function() {
	'use strict';
	angular
		.module('login', [
		])
		.component('login', {
			templateUrl: 'app/auth/login.template.html',
			controller: loginController
		});

	function loginController($scope, $location, $window, UserAuthFactory, AuthenticationFactory) {
		var self = this;

		self.user = {};
		self.doLogin = doLogin;

		function doLogin() {
			var email = self.user.email;
			var password = self.user.password;

			if (email !== undefined && password != undefined) {
				UserAuthFactory.login(email, password)
					.success(function(result) {
						console.log(result);
						AuthenticationFactory.isLogged = true;
						AuthenticationFactory.user = result.user.email;
						AuthenticationFactory.role = result.user.role;

						$window.sessionStorage.token = result.token;
						$window.sessionStorage.user = result.user.email;
						$window.sessionStorage.role = result.user.role;

						$location.path("/");
					})
					.error(function(result) {
						alert(result.message);
					});
			} else {
				alert("이메일과 비밀번호를 입력해주세요");
			}
		}
	}

})();
