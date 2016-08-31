(function() {
	'use strict';
	angular
		.module('reserv-list', [
		])
		.component('reservList', {
			templateUrl: 'app/reservation/reserv-list.template.html',
			controller: reservListController
		});

	function reservListController($scope, $http, $location) {
		var self = this;
		var paths = $location.path().split('/');
		self.year = paths[paths.length - 1];

		$http.get('/api/reservation/' + self.year).then(function(res) {
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
