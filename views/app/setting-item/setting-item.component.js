'use strict';
angular
  .module('settingItem', [
    'md.data.table'
  ])
  .component('settingItem', {
      templateUrl: 'app/setting-item/setting-item.template.html',
      controller: settingItem
  });

function settingItem($scope, $mdDialog, $http) {
  var self = this;

  self.selected = [];
  self.addItem = addItem;
  self.removeItem = removeItem;
  self.editItem = editItem;
  self.collaborPlace = [
    {
      name: '이원',
      commission: 10
    },
    {
      name: '라페스타',
      commission: 5
    }
  ];

  function addItem(event) {
    $mdDialog.show({
      clickOutsideToClose: true,
      controller: addCollaborPlaceController,
      focusOnOpen: false,
      targetEvent: event,
      templateUrl: 'app/setting-item/add-collaborplace-dialog.html',
    }).then(function(data) {
      self.collaborPlace.push(data);
      //$http.post('/setting/items', data, {headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}})
      $http.post('/setting/items', data, {headers: {'Content-Type': 'application/json;charset=utf-8;'}})
        .then(function(res) {
          console.log(res);
        });
    });
  }

  function removeItem() {
    for (var i = 0, len = self.selected.length ; i < len ; i++) {
      var index = _.findIndex(self.collaborPlace, self.selected[i]);
      self.collaborPlace.splice(index, 1);
    }
    self.selected = [];
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
      self.selected = [];
      //var index = _.findIndex(self.collaborPlace, data);
      //self.collaborPlace[index] = data;
    });
  }
}

function addCollaborPlaceController($scope, $mdDialog) {
  $scope.data = {};
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.addItem = function() {
    if(Object.keys($scope.data).length === 0){
      alert('내용을 입력해주세요');
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
    if(Object.keys($scope.data).length === 0){
      alert('내용을 입력해주세요');
    } else {
      $mdDialog.hide($scope.data);
    }
  };
}
