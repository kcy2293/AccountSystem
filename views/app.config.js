'use strict';

angular.
  module('myApp').
  config(['$locationProvider', '$routeProvider',
    function config($locationProvider, $routeProvider) {
      //$locationProvider.hashPrefix('!');

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
        when('/phones/:phoneId', {
          template: '<phone-detail></phone-detail>'
        }).
        otherwise('/setting/3/');
    }
  ]);
