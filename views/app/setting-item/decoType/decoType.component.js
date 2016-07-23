'use strict';
angular
  .module('decoType', [
    'md.data.table'
  ])
  .component('decoType', {
    templateUrl: 'app/setting-item/decoType/decoType.template.html',
    controller: decoTypeController
  });

function decoTypeController($scope, $mdDialog, $http, $q) {

  var self = this;

  self.selected = [];
  self.addItem = addItem;
  self.removeItem = removeItem;
  self.editItem = editItem;
  self.decoType = [];

  function getdecoType() {
    $http.get('/api/setting/decoType').then(function(res) {
      self.decoType = res.data;
    });
  }
  getdecoType();

  function addItem(event) {
    $mdDialog.show({
      clickOutsideToClose: true,
      controller: adddecoTypeController,
      focusOnOpen: false,
      targetEvent: event,
      templateUrl: 'app/setting-item/decoType/decoType-dialog.html',
    }).then(function(data) {
      data.group = "decoType";
      $http.post('/api/setting/decoType', data)
        .then(function(res) {
          getdecoType();
        });
    });
  }

  function removeItem() {
    var promises = [];
    for (var i = 0, len = self.selected.length ; i < len ; i++) {
      promises.push($http.delete('/api/setting/decoType/' + self.selected[i]._id));
    }

    $q.all(promises).then(function(results) {
      getdecoType();
      self.selected = [];
    });
  }

  function editItem() {
    $mdDialog.show({
      clickOutsideToClose: true,
      controller: editdecoTypeController,
      focusOnOpen: false,
      targetEvent: event,
      locals : {
        params : self.selected[0]
      },
      templateUrl: 'app/setting-item/decoType/decoType-dialog.html',
    }).then(function(data) {
      $http.put('/api/setting/decoType/' + data._id, data)
        .then(function(res) {
          self.selected = [];
        });
    });
  }
}

// dialog controller
function adddecoTypeController($scope, $mdDialog) {
  $scope.data = {};
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.addItem = function() {
    if(Object.keys($scope.data).length !== 1){
      alert('내용을 전부 채워주세요');
    } else {
      $mdDialog.hide($scope.data);
    }
  };
}

function editdecoTypeController($scope, $mdDialog, params) {
  $scope.data = params;
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.addItem = function() {
    $mdDialog.hide($scope.data);
  };
}
