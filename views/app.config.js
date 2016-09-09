(function() {
	'use strict';

	angular.
		module('myApp').
		config(['$locationProvider', '$routeProvider', '$httpProvider', 
			function config($locationProvider, $routeProvider, $httpProvider) {
				//$locationProvider.hashPrefix('!');

				$httpProvider.interceptors.push('TokenInterceptor');

				var thisYear = new Date().getFullYear();
				var accountDate = getLastAccountDate();

				$routeProvider.
					when('/login', {
						template: '<login></login>'
						, access: {
							requiredLogin: false
						}
					}).
					when('/setting/1/', {
						template: '<setting-item></setting-item>'
						, access: {
							requiredLogin: true
						}
					}).
					when('/setting/2/', {
						template: '<setting-menutable></setting-menutable>'
						, access: {
							requiredLogin: true
						}
					}).
					when('/setting/3/', {
						template: '<setting-pay></setting-pay>'
						, access: {
							requiredLogin: true
						}
					}).
					when('/reservation/', {
						redirectTo: '/reservation/' + thisYear
						, access: {
							requiredLogin: true
						}
					}).
					when('/reservation/:year', {
						template: '<reserv-list></reserv-list>'
						, access: {
							requiredLogin: true
						}
					}).
					when('/reservation/:year/:id', {
						template: '<reserv-view></reserv-view>'
						, access: {
							requiredLogin: true
						}
					}).
					when('/reserv-week-list/', {
						redirectTo: '/reserv-week-list/' + thisYear
						, access: {
							requiredLogin: true
						}
					}).
					when('/reserv-week-list/:year', {
						template: '<reserv-week-list></reserv-week-list>'
						, access: {
							requiredLogin: true
						}
					}).
					when('/reserv-create/', {
						template: '<reserv-create></reserv-create>'
						, access: {
							requiredLogin: true
						}
					}).
					when('/reserv-update/:year/:id', {
						template: '<reserv-update></reserv-update>'
						, access: {
							requiredLogin: true
						}
					}).
					when('/account/', {
						redirectTo: '/account/' + accountDate.year + '/' + accountDate.month + '/' + accountDate.date
						, access: {
							requiredLogin: true
						}
					}).
					when('/account/:year', {
					}).
					when('/account/:year/:month', {
					}).
					when('/account/:year/:month/:date', {
						template: '<account-create></account-create>'
						, access: {
							requiredLogin: true
						}
					}).
					otherwise('/reserv-create/');
			}
		]);
	
	angular.
		module('myApp').
		run(function($rootScope, $window, $location, AuthenticationFactory) {
			AuthenticationFactory.check();

			$rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
				if ( (nextRoute.access && nextRoute.access.requiredLogin) && !AuthenticationFactory.isLogged) {
					$location.path("/login");
				} else {
					if (!AuthenticationFactory.user) AuthenticationFactory.user = $window.sessionStorage.user;
					if (!AuthenticationFactory.role) AuthenticationFactory.role = $window.sessionStorage.role;
				}
			});

			$rootScope.$on('$routeChangeSuccess', function(event, nextRoute, currentRoute) {
				$rootScope.showMenu = AuthenticationFactory.isLogged;
				$rootScope.role = AuthenticationFactory.role;

				if (AuthenticationFactory.isLogged == true && $location.path() == '/login') {
					$location.path('/');
				}
			});
		});

	function getLastAccountDate() {
		var now = new Date();
		now.setHours(0);
		now.setMinutes(0);
		now.setSeconds(0);
		now.setMilliseconds(0);

		var nowDay = now.getDay();
		var endSub = (nowDay == 0) ? 7 : nowDay;
		var endDate = subDays(now, endSub);

		var yy = endDate.getFullYear();
		var mm = padLeft(endDate.getMonth() + 1);
		var dateStr = '';
		dateStr += yy;
		dateStr += mm;
		dateStr += padLeft(endDate.getDate());

		return {
			year: yy,
			month: mm,
			date: dateStr
		}
	}

	function subDays(theDate, days) {
		return new Date(theDate.getTime() - days*24*60*60*1000);
	}

	function padLeft(base) {
		if (base < 10) return '0'+String(base);
		else  return String(base);
	}

})();
