(function() {
	'use strict';
	angular
		.module('decoFruit', [
			'md.data.table'
		])
		.component('decoFruit', {
			templateUrl: 'app/setting-item/decoFruit/decoFruit.template.html',
			controller: decoFruitController
		});

	function decoFruitController($scope, $mdDialog, $http, $q) {

		var self = this;

		self.selected = [];
		self.addItem = addItem;
		self.removeItem = removeItem;
		self.editItem = editItem;
		self.decoFruit = [];

		function getdecoFruit() {
			$http.get('/api/setting/decoFruit').then(function(res) {
				self.decoFruit = res.data;
			});
		}
		getdecoFruit();

		function addItem(event) {
			$mdDialog.show({
				clickOutsideToClose: true,
				controller: adddecoFruitController,
				focusOnOpen: false,
				targetEvent: event,
				templateUrl: 'app/setting-item/decoFruit/decoFruit-dialog.html',
			}).then(function(data) {
				data.group = "decoFruit";
				$http.post('/api/setting/decoFruit', data)
					.then(function(res) {
						getdecoFruit();
					});
			});
		}

		function removeItem() {
			var promises = [];
			for (var i = 0, len = self.selected.length ; i < len ; i++) {
				promises.push($http.delete('/api/setting/decoFruit/' + self.selected[i]._id));
			}

			$q.all(promises).then(function(results) {
				getdecoFruit();
				self.selected = [];
			});
		}

		function editItem() {
			$mdDialog.show({
				clickOutsideToClose: true,
				controller: editdecoFruitController,
				focusOnOpen: false,
				targetEvent: event,
				locals : {
					params : self.selected[0]
				},
				templateUrl: 'app/setting-item/decoFruit/decoFruit-dialog.html',
			}).then(function(data) {
				$http.put('/api/setting/decoFruit/' + data._id, data)
					.then(function(res) {
						self.selected = [];
					});
			});
		}
	}

	// dialog controller
	function adddecoFruitController($scope, $mdDialog) {
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

	function editdecoFruitController($scope, $mdDialog, params) {
		$scope.data = params;
		$scope.cancel = function() {
			$mdDialog.cancel();
		};
		$scope.addItem = function() {
			$mdDialog.hide($scope.data);
		};
	}
})();
