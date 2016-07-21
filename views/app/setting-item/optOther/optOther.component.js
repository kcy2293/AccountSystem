'use strict';
angular
  .module('optOther', [
    'md.data.table'
  ])
  .component('optOther', {
    templateUrl: 'app/setting-item/optOther/optOther.template.html',
    controller: optOtherController
  });

function optOtherController($scope, $mdDialog, $http, $q) {

  var self = this;

  self.selected = [];
  self.addItem = addItem;
  self.removeItem = removeItem;
  self.editItem = editItem;
  self.optOther = [];

  function getoptOther() {
    $http.get('/api/setting/optOther').then(function(res) {
      self.optOther = res.data;
    });
  }
  getoptOther();

  function addItem(event) {
    $mdDialog.show({
      clickOutsideToClose: true,
      controller: addoptOtherController,
      focusOnOpen: false,
      targetEvent: event,
      templateUrl: 'app/setting-item/optOther/optOther-dialog.html',
    }).then(function(data) {
      data.group = "optOther";
      $http.post('/api/setting/optOther', data)
        .then(function(res) {
          getoptOther();
        });
    });
  }

  function removeItem() {
    var promises = [];
    for (var i = 0, len = self.selected.length ; i < len ; i++) {
      promises.push($http.delete('/api/setting/optOther/' + self.selected[i]._id));
    }

    $q.all(promises).then(function(results) {
      getoptOther();
      self.selected = [];
    });
  }

  function editItem() {
    $mdDialog.show({
      clickOutsideToClose: true,
      controller: editoptOtherController,
      focusOnOpen: false,
      targetEvent: event,
      locals : {
        params : self.selected[0]
      },
      templateUrl: 'app/setting-item/optOther/optOther-dialog.html',
    }).then(function(data) {
      $http.put('/api/setting/optOther/' + data._id, data)
        .then(function(res) {
          self.selected = [];
        });
    });
  }
}

// dialog controller
function addoptOtherController($scope, $mdDialog) {
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

function editoptOtherController($scope, $mdDialog, params) {
  $scope.data = params;
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.addItem = function() {
    $mdDialog.hide($scope.data);
  };
}
