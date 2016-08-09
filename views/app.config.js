'use strict';

angular.
  module('myApp').
  config(['$locationProvider', '$routeProvider',
    function config($locationProvider, $routeProvider) {
      //$locationProvider.hashPrefix('!');

      var thisYear = new Date().getFullYear();

      $routeProvider.
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
        when('/reserv-create/', {
          template: '<reserv-create></reserv-create>'
        }).
        when('/reserv-update/:year/:id', {
          template: '<reserv-update></reserv-update>'
        }).
        when('/account-create/', {
          redirectTo: '/account-create/' + thisYear + '/' + getLastWeekPeriod()
        }).
        when('/account-create/:year/:period', {
          template: '<account-create></account-create>'
        }).
        otherwise('/reservation/');
    }
  ]);

function getLastWeekPeriod() {
	var now = new Date();
	now.setHours(0);
	now.setMinutes(0);
	now.setSeconds(0);
	now.setMilliseconds(0);

	var nowDay = now.getDay();
	var startSub = (nowDay == 0) ? 13 : nowDay + 6;
	var endSub = (nowDay == 0) ? 6 : nowDay - 1;
	var startDate = subDays(now, startSub);
	var endDate = subDays(now, endSub);

	var period = '';
	period += padLeft(startDate.getMonth() + 1);
	period += padLeft(startDate.getDate());
	period += padLeft(endDate.getMonth() + 1);
	period += padLeft(endDate.getDate());

	return period;
}

function subDays(theDate, days) {
	return new Date(theDate.getTime() - days*24*60*60*1000);
}

function padLeft(base) {
	if (base < 10) return '0'+String(base);
	else  return String(base);
}
