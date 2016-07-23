'use strict';
angular
  .module('optDress', [
    'md.data.table'
  ])
  .component('optDress', {
    templateUrl: 'app/setting-item/optDress/optDress.template.html',
    controller: optDressController
  });

function optDressController($scope, $mdDialog, $http, $q) {

  var self = this;

  self.selected = [];
  self.addItem = addItem;
  self.removeItem = removeItem;
  self.editItem = editItem;
  self.optDress = [];

  function getoptDress() {
    $http.get('/api/setting/optDress').then(function(res) {
      self.optDress = res.data;
    });
  }
  getoptDress();

  function addItem(event) {
    $mdDialog.show({
      clickOutsideToClose: true,
      controller: addoptDressController,
      focusOnOpen: false,
      targetEvent: event,
      templateUrl: 'app/setting-item/optDress/optDress-dialog.html',
    }).then(function(data) {
      data.group = "optDress";
      $http.post('/api/setting/optDress', data)
        .then(function(res) {
          getoptDress();
        });
    });
  }

  function removeItem() {
    var promises = [];
    for (var i = 0, len = self.selected.length ; i < len ; i++) {
      promises.push($http.delete('/api/setting/optDress/' + self.selected[i]._id));
    }

    $q.all(promises).then(function(results) {
      getoptDress();
      self.selected = [];
    });
  }

  function editItem() {
    $mdDialog.show({
      clickOutsideToClose: true,
      controller: editoptDressController,
      focusOnOpen: false,
      targetEvent: event,
      locals : {
        params : self.selected[0]
      },
      templateUrl: 'app/setting-item/optDress/optDress-dialog.html',
    }).then(function(data) {
      $http.put('/api/setting/optDress/' + data._id, data)
        .then(function(res) {
          self.selected = [];
        });
    });
  }
}

// dialog controller
function addoptDressController($scope, $mdDialog) {
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

function editoptDressController($scope, $mdDialog, params) {
  $scope.data = params;
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.addItem = function() {
    $mdDialog.hide($scope.data);
  };
}
