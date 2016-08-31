(function() {
	'use strict';
	angular
		.module('decoRcake', [
			'md.data.table'
		])
		.component('decoRcake', {
			templateUrl: 'app/setting-item/decoRcake/decoRcake.template.html',
			controller: decoRcakeController
		});

	function decoRcakeController($scope, $mdDialog, $http, $q) {

		var self = this;

		self.selected = [];
		self.addItem = addItem;
		self.removeItem = removeItem;
		self.editItem = editItem;
		self.decoRcake = [];

		function getdecoRcake() {
			$http.get('/api/setting/decoRcake').then(function(res) {
				self.decoRcake = res.data;
			});
		}
		getdecoRcake();

		function addItem(event) {
			$mdDialog.show({
				clickOutsideToClose: true,
				controller: adddecoRcakeController,
				focusOnOpen: false,
				targetEvent: event,
				templateUrl: 'app/setting-item/decoRcake/decoRcake-dialog.html',
			}).then(function(data) {
				data.group = "decoRcake";
				$http.post('/api/setting/decoRcake', data)
					.then(function(res) {
						getdecoRcake();
					});
			});
		}

		function removeItem() {
			var promises = [];
			for (var i = 0, len = self.selected.length ; i < len ; i++) {
				promises.push($http.delete('/api/setting/decoRcake/' + self.selected[i]._id));
			}

			$q.all(promises).then(function(results) {
				getdecoRcake();
				self.selected = [];
			});
		}

		function editItem() {
			$mdDialog.show({
				clickOutsideToClose: true,
				controller: editdecoRcakeController,
				focusOnOpen: false,
				targetEvent: event,
				locals : {
					params : self.selected[0]
				},
				templateUrl: 'app/setting-item/decoRcake/decoRcake-dialog.html',
			}).then(function(data) {
				$http.put('/api/setting/decoRcake/' + data._id, data)
					.then(function(res) {
						self.selected = [];
					});
			});
		}
	}

	// dialog controller
	function adddecoRcakeController($scope, $mdDialog) {
		$scope.data = {};
		$scope.cancel = function() {
			$mdDialog.cancel();
		};
		$scope.addItem = function() {
			if(Object.keys($scope.data).length !== 3){
				alert('내용을 전부 채워주세요');
			} else {
				$mdDialog.hide($scope.data);
			}
		};
	}

	function editdecoRcakeController($scope, $mdDialog, params) {
		$scope.data = params;
		$scope.cancel = function() {
			$mdDialog.cancel();
		};
		$scope.addItem = function() {
			$mdDialog.hide($scope.data);
		};
	}
})();
