'use strict';

/* App Module */

var app = angular.module("NCApp", ['ngRoute', 'NCAnimations', 'NCControllers']);

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/loginpage', {
        templateUrl: 'partials/loginpage.html'//,
        //controller: 'homePageControl'
      }).
      when('/mainpage', {
        templateUrl: 'partials/mainpage.html'//,
        //controller: 'mainPageControl'
      }).
      otherwise({
        redirectTo: '/loginpage'
      });
  }]);
