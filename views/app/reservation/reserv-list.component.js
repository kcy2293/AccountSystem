'use strict';
angular
  .module('reserv-list', [
  ])
  .component('reservList', {
    templateUrl: 'app/reservation/reserv-list.template.html',
    controller: reservListController
  });

function reservListController($scope, $http) {
  var self = this;
}
