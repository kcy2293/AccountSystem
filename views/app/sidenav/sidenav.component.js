'use strict';

angular.
  module('sidenav', [
    'ngMaterial'
  ]).
  directive('sideNav', function($mdSidenav) {
    return {
      restrict: 'E',
      replace: true,
      controller: sidenav,
      controllerAs: 'ctrl',
      templateUrl: 'app/sidenav/sidenav.template.html'
    };
  });

function sidenav($mdSidenav) {
  var self = this;

  self.menus = [
    {
      'name': 'menu1'
    },{
      'name': 'menu2'
    }
  ];
  self.selected = self.menus[0];
  self.selectMenu = selectMenu;
  self.toggleSidenav = toggleSidenav;

  function selectMenu(menu) {
    self.selected = menu;
  }

  function toggleSidenav() {
    $mdSidenav('left').toggle();
  }
}
