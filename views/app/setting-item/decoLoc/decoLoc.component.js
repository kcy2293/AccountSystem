'use strict';
angular
  .module('decoLoc', [
    'md.data.table'
  ])
  .component('decoLoc', {
    templateUrl: 'app/setting-item/decoLoc/decoLoc.template.html',
    controller: decoLocController
  });

function decoLocController($scope, $mdDialog, $http, $q) {

  var self = this;

  self.selected = [];
  self.addItem = addItem;
  self.removeItem = removeItem;
  self.editItem = editItem;
  self.DecoLoc = [];

  function getDecoLoc() {
    $http.get('/api/setting/decoLoc').then(function(res) {
      self.decoLoc = res.data;
    });
  }
  getDecoLoc();

  function addItem(event) {
    $mdDialog.show({
      clickOutsideToClose: true,
      controller: addDecoLocController,
      focusOnOpen: false,
      targetEvent: event,
      templateUrl: 'app/setting-item/decoLoc/decoLoc-dialog.html',
    }).then(function(data) {
      data.group = "decoLoc";
      $http.post('/api/setting/decoLoc', data)
        .then(function(res) {
          getDecoLoc();
        });
    });
  }

  function removeItem() {
    var promises = [];
    for (var i = 0, len = self.selected.length ; i < len ; i++) {
      promises.push($http.delete('/api/setting/decoLoc/' + self.selected[i]._id));
    }

    $q.all(promises).then(function(results) {
      getDecoLoc();
      self.selected = [];
    });
  }

  function editItem() {
    $mdDialog.show({
      clickOutsideToClose: true,
      controller: editDecoLocController,
      focusOnOpen: false,
      targetEvent: event,
      locals : {
        params : self.selected[0]
      },
      templateUrl: 'app/setting-item/decoLoc/decoLoc-dialog.html',
    }).then(function(data) {
      $http.put('/api/setting/decoLoc/' + data._id, data)
        .then(function(res) {
          self.selected = [];
        });
    });
  }
}

// dialog controller
function addDecoLocController($scope, $mdDialog) {
  $scope.data = {};
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.addItem = function() {
		$mdDialog.hide($scope.data);
  };
}

function editDecoLocController($scope, $mdDialog, params) {
  $scope.data = params;
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.addItem = function() {
    $mdDialog.hide($scope.data);
  };
}
