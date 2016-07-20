'use strict';
angular
  .module('settingItem', [
    'md.data.table'
  ])
  .component('settingItem', {
      templateUrl: 'app/setting-item/setting-item.template.html',
      controller: settingItem
  });

function settingItem($scope, $mdDialog, $http, $q) {
  var self = this;

  self.selected = [];
  self.addItem = addItem;
  self.removeItem = removeItem;
  self.editItem = editItem;
  self.collaborPlace = [];

  getDecoLoc();

  function getDecoLoc() {
    $http.get('/api/setting/decoLoc').then(function(res) {
      self.decoLoc = res.data;
    });
  }

  function addItem(event) {
    $mdDialog.show({
      clickOutsideToClose: true,
      controller: addCollaborPlaceController,
      focusOnOpen: false,
      targetEvent: event,
      templateUrl: 'app/setting-item/add-collaborplace-dialog.html',
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
      controller: editCollaborPlaceController,
      focusOnOpen: false,
      targetEvent: event,
      locals : {
        params : self.selected[0]
      },
      templateUrl: 'app/setting-item/add-collaborplace-dialog.html',
    }).then(function(data) {
      $http.put('/api/setting/decoLoc/' + data._id, data)
        .then(function(res) {
          self.selected = [];
        });
    });
  }
}

function addCollaborPlaceController($scope, $mdDialog) {
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

function editCollaborPlaceController($scope, $mdDialog, params) {
  $scope.data = params;
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.addItem = function() {
    $mdDialog.hide($scope.data);
  };
}
