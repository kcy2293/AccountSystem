'use strict';
angular
  .module('account-create', [
  ])
  .component('accountCreate', {
    templateUrl: 'app/account/account-create.template.html',
    controller: accountController
  });

function accountController($scope, $http, $mdToast) {
  var self = this;

}
