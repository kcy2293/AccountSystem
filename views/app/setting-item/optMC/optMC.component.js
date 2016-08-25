(function() {
	'use strict';
	angular
		.module('optMC', [
			'md.data.table'
		])
		.component('optMc', {
			templateUrl: 'app/setting-item/optMC/optMC.template.html',
			controller: optMCController
		});

	function optMCController($scope, $mdDialog, $http, $q) {

		var self = this;

		self.selected = [];
		self.addItem = addItem;
		self.removeItem = removeItem;
		self.editItem = editItem;
		self.optMC = [];

		function getoptMC() {
			$http.get('/api/setting/optMC').then(function(res) {
				self.optMC = res.data;
			});
		}
		getoptMC();

		function addItem(event) {
			$mdDialog.show({
				clickOutsideToClose: true,
				controller: addoptMCController,
				focusOnOpen: false,
				targetEvent: event,
				templateUrl: 'app/setting-item/optMC/optMC-dialog.html',
			}).then(function(data) {
				data.group = "optMC";
				$http.post('/api/setting/optMC', data)
					.then(function(res) {
						getoptMC();
					});
			});
		}

		function removeItem() {
			var promises = [];
			for (var i = 0, len = self.selected.length ; i < len ; i++) {
				promises.push($http.delete('/api/setting/optMC/' + self.selected[i]._id));
			}

			$q.all(promises).then(function(results) {
				getoptMC();
				self.selected = [];
			});
		}

		function editItem() {
			$mdDialog.show({
				clickOutsideToClose: true,
				controller: editoptMCController,
				focusOnOpen: false,
				targetEvent: event,
				locals : {
					params : self.selected[0]
				},
				templateUrl: 'app/setting-item/optMC/optMC-dialog.html',
			}).then(function(data) {
				$http.put('/api/setting/optMC/' + data._id, data)
					.then(function(res) {
						self.selected = [];
					});
			});
		}
	}

	// dialog controller
	function addoptMCController($scope, $mdDialog) {
		$scope.data = {};
		$scope.cancel = function() {
			$mdDialog.cancel();
		};
		$scope.addItem = function() {
			if(Object.keys($scope.data).length !== 4){
				alert('내용을 전부 채워주세요');
			} else {
				$mdDialog.hide($scope.data);
			}
		};
	}

	function editoptMCController($scope, $mdDialog, params) {
		$scope.data = params;
		$scope.cancel = function() {
			$mdDialog.cancel();
		};
		$scope.addItem = function() {
			$mdDialog.hide($scope.data);
		};
	}
})();
