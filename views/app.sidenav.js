'use strict';

angular.
  module('myApp').
  controller('SidenavController', [
    '$mdSidenav', '$location', SidenavController
  ]);

function SidenavController($mdSidenav, $location) {
  var self = this;

  self.menus = [
		{
      'name': '로그인',
      'route': '/login'
    },
		{
      'name': '전체 예약서 목록',
      'route': '/reservation/'
		},
		{
      'name': '이번주 예약서 목록',
      'route': '/reserv-week-list/'
		},
		{
      'name': '예약서 입력',
      'route': '/reserv-create/'
    },
		{
      'name': '예약서 항목 설정',
      'route': '/setting/1/'
    },
		{
      'name': '패키지 메뉴 설정',
      'route': '/setting/2/'
    },
		/*
		{
      'name': '페이 설정',
      'route': '/setting/3/'
    },
		*/
		{
      'name': '정산서 작성',
      'route': '/account/'
    }
  ];
  self.selected = self.menus[3];
  self.selectMenu = selectMenu;
  self.toggleSidenav = toggleSidenav;

  function selectMenu(menu) {
    self.selected = menu;
    $location.path(menu.route);
  }

  function toggleSidenav() {
    $mdSidenav('left').toggle();
  }

}
