'use strict';

angular.
  module('myApp').
  config(['$locationProvider', '$routeProvider',
    function config($locationProvider, $routeProvider) {
      //$locationProvider.hashPrefix('!');

      var thisYear = new Date().getFullYear();

      $routeProvider.
        when('/setting/1/', {
          template: '<setting-item></setting-item>'
        }).
        when('/setting/2/', {
          template: '<setting-menutable></setting-menutable>'
        }).
        when('/setting/3/', {
          template: '<setting-pay></setting-pay>'
        }).
        when('/reservation/', {
          redirectTo: '/reservation/' + thisYear
        }).
        when('/reservation/:year', {
          template: '<reservation></reservatio>'
        }).
        when('/reserv-create/', {
          template: '<reserv-create></reserv-create>'
        }).
        otherwise('/reserv-create/');
    }
  ]);
