'use strict';

angular.
  module('users').
  controller('UserController', [
    'userService', '$mdSidenav', '$mdBottomSheet', '$log', UserController
  ]);

function UserController(userService, $mdSidenav) {
  var self = this;

  self.selected = null;
  self.users = [];
  self.selectUser = selectUser;
  self.toggleList = toggleUsersList;

  userService.
    loadAllUsers().
    then( function(users) {
      self.users = [].concat(users);
      self.selected = users[0];
    });

  function selectUser (user) {
    self.selected = user;
  }

  function toggleUsersList() {
    $mdSidenav('left').toggle();
  }
}
