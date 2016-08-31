(function() {
	'use strict';
	angular
		.module('optMovie', [
			'md.data.table'
		])
		.component('optMovie', {
			templateUrl: 'app/setting-item/optMovie/optMovie.template.html',
			controller: optMovieController
		});

	function optMovieController($scope, $mdDialog, $http, $q) {

		var self = this;

		self.selected = [];
		self.addItem = addItem;
		self.removeItem = removeItem;
		self.editItem = editItem;
		self.optMovie = [];

		function getoptMovie() {
			$http.get('/api/setting/optMovie').then(function(res) {
				self.optMovie = res.data;
			});
		}
		getoptMovie();

		function addItem(event) {
			$mdDialog.show({
				clickOutsideToClose: true,
				controller: addoptMovieController,
				focusOnOpen: false,
				targetEvent: event,
				templateUrl: 'app/setting-item/optMovie/optMovie-dialog.html',
			}).then(function(data) {
				data.group = "optMovie";
				$http.post('/api/setting/optMovie', data)
					.then(function(res) {
						getoptMovie();
					});
			});
		}

		function removeItem() {
			var promises = [];
			for (var i = 0, len = self.selected.length ; i < len ; i++) {
				promises.push($http.delete('/api/setting/optMovie/' + self.selected[i]._id));
			}

			$q.all(promises).then(function(results) {
				getoptMovie();
				self.selected = [];
			});
		}

		function editItem() {
			$mdDialog.show({
				clickOutsideToClose: true,
				controller: editoptMovieController,
				focusOnOpen: false,
				targetEvent: event,
				locals : {
					params : self.selected[0]
				},
				templateUrl: 'app/setting-item/optMovie/optMovie-dialog.html',
			}).then(function(data) {
				$http.put('/api/setting/optMovie/' + data._id, data)
					.then(function(res) {
						self.selected = [];
					});
			});
		}
	}

	// dialog controller
	function addoptMovieController($scope, $mdDialog) {
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

	function editoptMovieController($scope, $mdDialog, params) {
		$scope.data = params;
		$scope.cancel = function() {
			$mdDialog.cancel();
		};
		$scope.addItem = function() {
			$mdDialog.hide($scope.data);
		};
	}
})();
