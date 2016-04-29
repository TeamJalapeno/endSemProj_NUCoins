'use strict';

/* App Module */

var MainApp = angular.module("NCMainApp", ['ngRoute', 'NCAnimations', 'NCMainControllers']);

MainApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/homepage', {
        templateUrl: 'partials/page1.html'//,
        //controller: 'homePageControl'
      }).
      when('/otherpage', {
        templateUrl: 'partials/page2.html'//,
        //controller: 'mainPageControl'
      }).
      otherwise({
        redirectTo: '/homepage'
      });
  }]);
