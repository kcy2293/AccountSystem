(function() {
	'use strict';

	angular.
		module('myApp').
		config(['$locationProvider', '$routeProvider',
			function config($locationProvider, $routeProvider) {
				//$locationProvider.hashPrefix('!');

				var thisYear = new Date().getFullYear();
				var accountDate = getLastAccountDate();

				$routeProvider.
					when('/login', {
						template: '<login></login>'
					}).
					when('/setting/1/', {
						template: '<setting-item></setting-item>'
					}).
					when('/setting/2/', {
						template: '<setting-menutable></setting-menutable>'
					}).
					when('/setting/3/', {
						template: '<setting-pay></setting-pay>'
					}).
					when('/reservation/', {
						redirectTo: '/reservation/' + thisYear
					}).
					when('/reservation/:year', {
						template: '<reserv-list></reserv-list>'
					}).
					when('/reservation/:year/:id', {
						template: '<reserv-view></reserv-view>'
					}).
					when('/reserv-week-list/', {
						redirectTo: '/reserv-week-list/' + thisYear
					}).
					when('/reserv-week-list/:year', {
						template: '<reserv-week-list></reserv-week-list>'
					}).
					when('/reserv-create/', {
						template: '<reserv-create></reserv-create>'
					}).
					when('/reserv-update/:year/:id', {
						template: '<reserv-update></reserv-update>'
					}).
					when('/account/', {
						redirectTo: '/account/' + accountDate.year + '/' + accountDate.month + '/' + accountDate.date
					}).
					when('/account/:year', {
					}).
					when('/account/:year/:month', {
					}).
					when('/account/:year/:month/:date', {
						template: '<account-create></account-create>'
					}).
					otherwise('/reserv-create/');
			}
		]);

	angular.
		module('myApp').
		factory('moment', function($window) {
			return $window.moment;
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
