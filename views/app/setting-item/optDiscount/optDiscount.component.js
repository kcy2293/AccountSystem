'use strict';
angular
  .module('optDiscount', [
    'md.data.table'
  ])
  .component('optDiscount', {
    templateUrl: 'app/setting-item/optDiscount/optDiscount.template.html',
    controller: optDiscountController
  });

function optDiscountController($scope, $mdDialog, $http, $q) {

  var self = this;

	self.itemList = {
		"decoLoc": "행사장소",
		"decoType": "장식종류",
		"decoFruit": "생과일",
		"decoRcake": "떡케익",
		"optDress": "돌복/드레스",
		"optMC": "행사사회",
		"optMovie": "성장동영상",
		"optOther": "기타"
	};
  self.selected = [];
  self.addItem = addItem;
  self.removeItem = removeItem;
  self.editItem = editItem;
  self.discountList = [];

  function getDiscount() {
    $http.get('/api/setting/optDiscount').then(function(res) {
      self.discountList = res.data;
    });
  }
  getDiscount();

  function addItem(event) {
    $mdDialog.show({
      clickOutsideToClose: true,
      controller: addDiscountController,
      focusOnOpen: false,
      targetEvent: event,
      templateUrl: 'app/setting-item/optDiscount/optDiscount-dialog.html',
    }).then(function(data) {
      data.group = "optDiscount";
      $http.post('/api/setting/optDiscount', data)
        .then(function(res) {
          getDiscount();
        });
    });
  }

  function removeItem() {
    var promises = [];
    for (var i = 0, len = self.selected.length ; i < len ; i++) {
      promises.push($http.delete('/api/setting/optDiscount/' + self.selected[i]._id));
    }

    $q.all(promises).then(function(results) {
      getDiscount();
      self.selected = [];
    });
  }

  function editItem() {
    $mdDialog.show({
      clickOutsideToClose: true,
      controller: editDiscountController,
      focusOnOpen: false,
      targetEvent: event,
      locals : {
        params : self.selected[0]
      },
      templateUrl: 'app/setting-item/optDiscount/optDiscount-dialog.html',
    }).then(function(data) {
      $http.put('/api/setting/optDiscount/' + data._id, data)
        .then(function(res) {
          self.selected = [];
        });
    });
  }
}

// dialog controller
function addDiscountController($scope, $mdDialog) {
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

function editDiscountController($scope, $mdDialog, params) {
  $scope.data = params;
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.addItem = function() {
    $mdDialog.hide($scope.data);
  };
}
