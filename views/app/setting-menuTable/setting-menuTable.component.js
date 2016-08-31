(function() {
	'use strict';
	angular
		.module('settingMenuTable', [
			'md.data.table'
		])
		.component('settingMenutable', {
				templateUrl: 'app/setting-menuTable/setting-menuTable.template.html',
				controller: settingMenuTable
		});

	function settingMenuTable($scope, $http, $mdDialog, $q) {
		var self = this;
		self.selected = [];
		self.addItem = addItem;
		self.removeItem = removeItem;
		self.editItem = editItem;
		self.menuTable = [];

		$http.get('/api/setting/').then(function(res) {
			self.settings = res.data;
		});

		function getMenuTable() {
			$http.get('/api/setting/menuTable').then(function(res) {
				self.menuTable = res.data;
			});
		}
		getMenuTable();

		function addItem(event) {
			$mdDialog.show({
				clickOutsideToClose: true,
				controller: addMenuTableController,
				focusOnOpen: false,
				targetEvent: event,
				locals : {
					settings : self.settings
				},
				templateUrl: 'app/setting-menuTable/menuTable-dialog.html',
			}).then(function(data) {
				data.group = "menuTable";
				$http.post('/api/setting/menuTable', data)
					.then(function(res) {
						getMenuTable();
					});
			});
		}

		function removeItem() {
			var promises = [];
			for (var i = 0, len = self.selected.length ; i < len ; i++) {
				promises.push($http.delete('/api/setting/menuTable/' + self.selected[i]._id));
			}

			$q.all(promises).then(function(results) {
				getMenuTable();
				self.selected = [];
			});
		}

		function editItem() {
			$mdDialog.show({
				clickOutsideToClose: true,
				controller: editMenuTableController,
				focusOnOpen: false,
				targetEvent: event,
				locals : {
					settings : self.settings,
					params : self.selected[0]
				},
				templateUrl: 'app/setting-menuTable/menuTable-dialog.html',
			}).then(function(data) {
				$http.put('/api/setting/menuTable/' + data._id, data)
					.then(function(res) {
						self.selected = [];
					});
			});
		}
	}

	// dialog controller
	function addMenuTableController($scope, $mdDialog, settings) {
		$scope.settings = settings;
		$scope.data = {};
		$scope.cancel = function() {
			$mdDialog.cancel();
		};
		$scope.addItem = function() {
			$mdDialog.hide($scope.data);
		};
	}

	function editMenuTableController($scope, $mdDialog, settings, params) {
		$scope.settings = settings;
		$scope.data = params;
		if ($scope.data.decoRcake) {
			$scope.data.decoRcake = $scope.data.decoRcake.split(',');
		}
		if ($scope.data.optDiscount) {
			$scope.data.optDiscount = $scope.data.optDiscount.split(',');
		}
		$scope.cancel = function() {
			$mdDialog.cancel();
		};
		$scope.addItem = function() {
			$mdDialog.hide($scope.data);
		};
	}
})();
