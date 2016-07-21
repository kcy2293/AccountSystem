'use strict';
angular
  .module('optSnap', [
    'md.data.table'
  ])
  .component('optSnap', {
    templateUrl: 'app/setting-item/optSnap/optSnap.template.html',
    controller: optSnapController
  });

function optSnapController($scope, $mdDialog, $http, $q) {

  var self = this;

  self.selected = [];
  self.addItem = addItem;
  self.removeItem = removeItem;
  self.editItem = editItem;
  self.optSnap = [];

  function getoptSnap() {
    $http.get('/api/setting/optSnap').then(function(res) {
      self.optSnap = res.data;
    });
  }
  getoptSnap();

  function addItem(event) {
    $mdDialog.show({
      clickOutsideToClose: true,
      controller: addoptSnapController,
      focusOnOpen: false,
      targetEvent: event,
      templateUrl: 'app/setting-item/optSnap/optSnap-dialog.html',
    }).then(function(data) {
      data.group = "optSnap";
      $http.post('/api/setting/optSnap', data)
        .then(function(res) {
          getoptSnap();
        });
    });
  }

  function removeItem() {
    var promises = [];
    for (var i = 0, len = self.selected.length ; i < len ; i++) {
      promises.push($http.delete('/api/setting/optSnap/' + self.selected[i]._id));
    }

    $q.all(promises).then(function(results) {
      getoptSnap();
      self.selected = [];
    });
  }

  function editItem() {
    $mdDialog.show({
      clickOutsideToClose: true,
      controller: editoptSnapController,
      focusOnOpen: false,
      targetEvent: event,
      locals : {
        params : self.selected[0]
      },
      templateUrl: 'app/setting-item/optSnap/optSnap-dialog.html',
    }).then(function(data) {
      $http.put('/api/setting/optSnap/' + data._id, data)
        .then(function(res) {
          self.selected = [];
        });
    });
  }
}

// dialog controller
function addoptSnapController($scope, $mdDialog) {
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

function editoptSnapController($scope, $mdDialog, params) {
  $scope.data = params;
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.addItem = function() {
    $mdDialog.hide($scope.data);
  };
}
