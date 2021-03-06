(function() {
	'use strict';
	angular
		.module('decoName', [
			'md.data.table', 'lfNgMdFileInput'
		])
		.component('decoName', {
			templateUrl: 'app/setting-item/decoName/decoName.template.html',
			controller: decoNameController
		});

	function decoNameController($scope, $mdDialog, $http, $q) {

		var self = this;

		self.selected = [];
		self.addItem = addItem;
		self.removeItem = removeItem;
		self.editItem = editItem;
		self.decoName = [];

		function getdecoName() {
			$http.get('/api/setting/decoName').then(function(res) {
				self.decoName = res.data;
			});
		}
		getdecoName();

		function addItem(event) {
			$mdDialog.show({
				clickOutsideToClose: true,
				controller: adddecoNameController,
				focusOnOpen: false,
				targetEvent: event,
				templateUrl: 'app/setting-item/decoName/decoName-dialog.html',
			}).then(function(data) {
				data.group = "decoName";
				console.log(data);
				$http.post('/api/setting/decoName', data)
					.then(function(res) {
						getdecoName();
					});
			});
		}

		function removeItem() {
			var promises = [];
			for (var i = 0, len = self.selected.length ; i < len ; i++) {
				promises.push($http.delete('/api/setting/decoName/' + self.selected[i]._id));
			}

			$q.all(promises).then(function(results) {
				getdecoName();
				self.selected = [];
			});
		}

		function editItem() {
			$mdDialog.show({
				clickOutsideToClose: true,
				controller: editdecoNameController,
				focusOnOpen: false,
				targetEvent: event,
				locals : {
					params : self.selected[0]
				},
				templateUrl: 'app/setting-item/decoName/decoName-dialog.html',
			}).then(function(data) {
				$http.put('/api/setting/decoName/' + data._id, data)
					.then(function(res) {
						self.selected = [];
					});
			});
		}
	}

	// dialog controller
	function adddecoNameController($scope, $mdDialog, $http) {
		$scope.data = {};
		$scope.cancel = function() {
			$mdDialog.cancel();
		};
		$scope.addItem = function() {
			var formData = new FormData();
			angular.forEach($scope.files,function(obj){
				formData.append('files[]', obj.lfFile);
				$scope.data.imgName = obj.lfFileName;
			});
			if ($scope.files.length > 0) {
				$http.post('/decoImage', formData, {
					transformRequest: angular.identity,
					headers: {'Content-Type': undefined}
				}).then(function(result){
					$mdDialog.hide($scope.data);
				},function(err){
					$mdDialog.hide($scope.data);
				});
			} else {
				$mdDialog.hide($scope.data);
			}
		};
	}

	function editdecoNameController($scope, $mdDialog, params) {
		$scope.data = params;
		$scope.cancel = function() {
			$mdDialog.cancel();
		};
		$scope.addItem = function() {
			$mdDialog.hide($scope.data);
		};
	}
})();
