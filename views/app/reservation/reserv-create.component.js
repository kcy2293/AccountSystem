'use strict';
angular
  .module('reserv-create', [
    'md.data.table'
  ])
  .component('reservCreate', {
    templateUrl: 'app/reservation/reserv-create.template.html',
    controller: reservController
  });

function reservController($scope, $http) {
  var self = this;
  self.reserv = {};

  $http.get('/api/setting/').then(function(res) {
    self.settings = res.data;
    var pays = self.settings.pay;
    var role = [];
    for (var i = 0, len = pays.length ; i < len ; i++) {
      if (role.indexOf(pays[i].role) < 0) {
        role.push(pays[i].role);
      }
    }
    self.role = role;
  });

  $http.get('/api/users/').then(function(res) {
    self.users = res.data;
    /*
    var ranks = [];
    for (var i = 0, len = self.users.length ; i < len ; i++) {
      if (ranks.indexOf(self.users[i].rank) < 0) {
        ranks.push(self.users[i].rank);
      }
    }
    self.ranks = ranks;
    */
  });

  window.DEBUG = self;
}
