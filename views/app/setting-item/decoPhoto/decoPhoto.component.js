(function() {
	'use strict';
	angular
		.module('decoPhoto', [
			'md.data.table'
		])
		.component('decoPhoto', {
			templateUrl: 'app/setting-item/decoPhoto/decoPhoto.template.html',
			controller: decoPhotoController
		});

	function decoPhotoController($scope, $mdDialog, $http, $q) {

		var self = this;

		self.selected = [];
		self.addItem = addItem;
		self.removeItem = removeItem;
		self.editItem = editItem;
		self.decoPhoto = [];

		function getdecoPhoto() {
			$http.get('/api/setting/decoPhoto').then(function(res) {
				self.decoPhoto = res.data;
			});
		}
		getdecoPhoto();

		function addItem(event) {
			$mdDialog.show({
				clickOutsideToClose: true,
				controller: adddecoPhotoController,
				focusOnOpen: false,
				targetEvent: event,
				templateUrl: 'app/setting-item/decoPhoto/decoPhoto-dialog.html',
			}).then(function(data) {
				data.group = "decoPhoto";
				$http.post('/api/setting/decoPhoto', data)
					.then(function(res) {
						getdecoPhoto();
					});
			});
		}

		function removeItem() {
			var promises = [];
			for (var i = 0, len = self.selected.length ; i < len ; i++) {
				promises.push($http.delete('/api/setting/decoPhoto/' + self.selected[i]._id));
			}

			$q.all(promises).then(function(results) {
				getdecoPhoto();
				self.selected = [];
			});
		}

		function editItem() {
			$mdDialog.show({
				clickOutsideToClose: true,
				controller: editdecoPhotoController,
				focusOnOpen: false,
				targetEvent: event,
				locals : {
					params : self.selected[0]
				},
				templateUrl: 'app/setting-item/decoPhoto/decoPhoto-dialog.html',
			}).then(function(data) {
				$http.put('/api/setting/decoPhoto/' + data._id, data)
					.then(function(res) {
						self.selected = [];
					});
			});
		}
	}

	// dialog controller
	function adddecoPhotoController($scope, $mdDialog) {
		$scope.data = {};
		$scope.cancel = function() {
			$mdDialog.cancel();
		};
		$scope.addItem = function() {
			$mdDialog.hide($scope.data);
		};
	}

	function editdecoPhotoController($scope, $mdDialog, params) {
		$scope.data = params;
		$scope.cancel = function() {
			$mdDialog.cancel();
		};
		$scope.addItem = function() {
			$mdDialog.hide($scope.data);
		};
	}
})();
