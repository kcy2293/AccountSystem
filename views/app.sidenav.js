'use strict';

angular.
  module('myApp').
  controller('SidenavController', [
    '$mdSidenav', SidenavController
  ]);

function SidenavController($mdSidenav) {
  var self = this;

  self.menus = [
    {
      'name': 'menu1'
    },{
      'name': '구성항목 설정',
      'route': '#/setting/'
    }
  ];
  self.selected = self.menus[0];
  self.selectMenu = selectMenu;
  self.toggleSidenav = toggleSidenav;

  self.reservStatus = ['미정', '예약확인중', '예약완료'];


  function selectMenu(menu) {
    self.selected = menu;
  }

  function toggleSidenav() {
    $mdSidenav('left').toggle();
  }

}
