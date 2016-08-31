(function() {
	'use strict';
	angular
		.module('reserv-week-list', [
		])
		.component('reservWeekList', {
			templateUrl: 'app/reservation/reserv-week-list.template.html',
			controller: reservWeekListController
		});

	function reservWeekListController($scope, $http, $location, moment) {
		var self = this;
		var paths = $location.path().split('/');
		self.year = paths[paths.length - 1];

		var today = new moment().set('hour', 0).set('minute', 0).set('second', 0).set('millisecond', 0);
		var todayNum = today.day();
		todayNum = todayNum == 0 ? 7 : todayNum;
		// 0 -> 1~6 & -7 // 1 -> 1~6 & +7
		var startDate = new moment(today).subtract(todayNum - 1, 'days');
		var endDate = new moment(startDate).add(7, 'days');
		//var periodEnd = new moment(endDate).subtract(1, 'days');

		var config = {
			params: {
				from : startDate.toISOString(),
				to : endDate.toISOString()
			},
			headers: {'Accept' : 'application/json'}
		};

		$http.get('/api/reservation/', config).then(function(res) {
			self.list = res.data;
			for (var i = 0, len = self.list.length ; i < len ; i++){
				self.list[i].docoDate = new Date(self.list[i].decoDate);
				self.list[i].day = moment(self.list[i].decoDate).format('M/DD(dd) h:mm');
			}
			self.list.reverse();
		});

		self.listClicked = function(id) {
			$location.url('/reservation/' + self.year + '/' + id);
		}
	}
})();
