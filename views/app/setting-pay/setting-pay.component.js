(function() {
	'use strict';
	angular
		.module('settingPay', [
			'md.data.table'
		])
		.component('settingPay', {
				templateUrl: 'app/setting-pay/setting-pay.template.html',
				controller: settingPay
		});

	function settingPay($scope, $http, $mdDialog, $q) {
		var self = this;
		self.selected = [];
		self.addItem = addItem;
		self.removeItem = removeItem;
		self.editItem = editItem;
		self.pay = [];

		$http.get('/api/users/').then(function(res) {
			var users = res.data;
			var ranks = [];
			for (var i = 0, len = users.length ; i < len ; i++) {
				if (ranks.indexOf(users[i].rank) < 0) {
					ranks.push(users[i].rank);
				}
			}
			self.ranks = ranks;
		});

		function getPay() {
			$http.get('/api/setting/pay').then(function(res) {
				self.pay = res.data;
			});
		}
		getPay();

		function addItem(event) {
			$mdDialog.show({
				clickOutsideToClose: true,
				controller: addPayController,
				focusOnOpen: false,
				targetEvent: event,
				locals : {
					ranks : self.ranks
				},
				templateUrl: 'app/setting-pay/pay-dialog.html',
			}).then(function(data) {
				data.group = "pay";
				$http.post('/api/setting/pay', data)
					.then(function(res) {
						getPay();
					});
			});
		}

		function removeItem() {
			var promises = [];
			for (var i = 0, len = self.selected.length ; i < len ; i++) {
				promises.push($http.delete('/api/setting/pay/' + self.selected[i]._id));
			}

			$q.all(promises).then(function(results) {
				getPay();
				self.selected = [];
			});
		}

		function editItem() {
			$mdDialog.show({
				clickOutsideToClose: true,
				controller: editPayController,
				focusOnOpen: false,
				targetEvent: event,
				locals : {
					ranks : self.ranks,
					params : self.selected[0]
				},
				templateUrl: 'app/setting-pay/pay-dialog.html',
			}).then(function(data) {
				$http.put('/api/setting/pay/' + data._id, data)
					.then(function(res) {
						self.selected = [];
					});
			});
		}
	}

	// dialog controller
	function addPayController($scope, $mdDialog, ranks) {
		$scope.ranks = ranks;
		$scope.data = {};
		$scope.cancel = function() {
			$mdDialog.cancel();
		};
		$scope.addItem = function() {
			$mdDialog.hide($scope.data);
		};
	}

	function editPayController($scope, $mdDialog, ranks, params) {
		$scope.ranks = ranks;
		$scope.data = params;
		$scope.cancel = function() {
			$mdDialog.cancel();
		};
		$scope.addItem = function() {
			$mdDialog.hide($scope.data);
		};
	}
})();
